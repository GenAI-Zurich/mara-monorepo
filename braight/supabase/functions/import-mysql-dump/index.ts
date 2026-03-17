import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { readLines } from "https://deno.land/std@0.168.0/io/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-import-reset, x-import-mode",
};

type BooleanColumnInfo = { names: Set<string>; indexes: number[] };
type VarcharColumnInfo = { maxByName: Map<string, number>; maxByIndex: Map<number, number> };
type JsonColumnInfo = { names: Set<string>; indexes: number[] };
type TableColumnInfo = { names: Set<string>; ordered: string[] };

type InsertProjection = {
  columns: string[] | null;
  keepIndexes: number[] | null;
};

type ParsedInsert = {
  tableToken: string;
  table: string;
  columnsRaw: string | null;
  valuesRaw: string;
};

const LEGACY_COLUMN_ORDERS: Record<string, string[]> = {
  article_media: [
    "id",
    "article_id",
    "path",
    "media_type",
    "language",
    "new_path",
    "created_at",
    "updated_at",
    "size",
    "hash",
  ],
};

function normalizeTableName(rawTable: string): string {
  const cleaned = rawTable.replace(/["`]/g, "");
  return cleaned.includes(".") ? cleaned.split(".").pop()!.toLowerCase() : cleaned.toLowerCase();
}

function parseInsertStatement(sql: string): ParsedInsert | null {
  const match = sql.match(/^(INSERT INTO\s+(\S+)(?:\s+\(([^)]+)\))?(?:\s+OVERRIDING SYSTEM VALUE)?\s+VALUES)\s*(.+);?\s*$/is);
  if (!match) return null;

  const tableToken = match[2];
  const table = normalizeTableName(tableToken);
  const columnsRaw = match[3] ?? null;
  let valuesRaw = match[4].trim();
  if (valuesRaw.endsWith(";")) valuesRaw = valuesRaw.slice(0, -1).trim();

  return { tableToken, table, columnsRaw, valuesRaw };
}

function convertMySQLEscapes(sql: string): string {
  const len = sql.length;
  const parts: string[] = [];
  let i = 0;
  let inString = false;

  while (i < len) {
    const ch = sql[i];

    if (!inString) {
      if (ch === "'") inString = true;
      parts.push(ch);
      i++;
      continue;
    }

    if (ch === "\\") {
      const next = i + 1 < len ? sql[i + 1] : "";
      if (next === "'") { parts.push("''"); i += 2; continue; }
      if (next === '"') { parts.push('"'); i += 2; continue; }
      if (next === "\\") { parts.push("\\\\"); i += 2; continue; }
      if (next === "n") { parts.push("\n"); i += 2; continue; }
      if (next === "r") { parts.push("\r"); i += 2; continue; }
      if (next === "t") { parts.push("\t"); i += 2; continue; }
      if (next === "0") { parts.push(""); i += 2; continue; }
      // Handle \uXXXX Unicode escapes — convert to actual character to avoid PG error
      if (next === "u" && i + 5 < len) {
        const hex = sql.substring(i + 2, i + 6);
        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
          try {
            const codePoint = parseInt(hex, 16);
            // Skip null character (U+0000) as PG can't store it
            if (codePoint === 0) {
              i += 6; continue;
            }
            parts.push(String.fromCharCode(codePoint));
            i += 6; continue;
          } catch (_e) {
            // fall through
          }
        }
      }
      // Skip unknown escape sequences
      parts.push(next); i += 2; continue;
    }

    if (ch === "'") {
      if (i + 1 < len && sql[i + 1] === "'") { parts.push("''"); i += 2; continue; }
      inString = false;
      parts.push(ch); i++; continue;
    }

    parts.push(ch); i++;
  }

  return parts.join("");
}

/** Remove PostgreSQL-unsupported Unicode escape sequences from string literals */
function sanitizeUnicodeEscapes(sql: string): string {
  // Replace \u0000 and similar null-byte patterns that PG rejects
  return sql.replace(/\\u0000/g, "");
}

function splitTopLevelGroups(valuesStr: string): string[] {
  const groups: string[] = [];
  let depth = 0;
  let inStr = false;
  let current = "";

  for (let i = 0; i < valuesStr.length; i++) {
    const ch = valuesStr[i];

    if (inStr) {
      if (ch === "\\") {
        current += ch;
        if (i + 1 < valuesStr.length) { current += valuesStr[i + 1]; i++; }
        continue;
      }
      if (ch === "'" && i + 1 < valuesStr.length && valuesStr[i + 1] === "'") { current += "''"; i++; continue; }
      if (ch === "'") inStr = false;
      current += ch;
      continue;
    }

    if (ch === "'") { inStr = true; current += ch; continue; }
    if (ch === "(") { depth++; current += ch; continue; }
    if (ch === ")") {
      depth--;
      current += ch;
      if (depth === 0) { groups.push(current.trim()); current = ""; }
      continue;
    }
    if (ch === "," && depth === 0) continue;
    current += ch;
  }

  const tail = current.trim();
  if (tail) groups.push(tail);
  return groups;
}

function splitTupleFields(tupleInner: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inStr = false;
  let depth = 0;

  for (let i = 0; i < tupleInner.length; i++) {
    const ch = tupleInner[i];

    if (inStr) {
      if (ch === "\\") {
        current += ch;
        if (i + 1 < tupleInner.length) { current += tupleInner[i + 1]; i++; }
        continue;
      }
      if (ch === "'" && i + 1 < tupleInner.length && tupleInner[i + 1] === "'") { current += "''"; i++; continue; }
      if (ch === "'") inStr = false;
      current += ch;
      continue;
    }

    if (ch === "'") { inStr = true; current += ch; continue; }
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { fields.push(current); current = ""; continue; }
    current += ch;
  }

  fields.push(current);
  return fields;
}

function buildInsertStatement(tableToken: string, columns: string[] | null, groups: string[]): string {
  if (columns && columns.length > 0) {
    return `INSERT INTO ${tableToken} (${columns.join(", ")}) OVERRIDING SYSTEM VALUE VALUES ${groups.join(",")};`;
  }
  return `INSERT INTO ${tableToken} OVERRIDING SYSTEM VALUE VALUES ${groups.join(",")};`;
}

function filterGroupByIndexes(group: string, keepIndexes: number[]): string {
  const trimmed = group.trim();
  if (!trimmed.startsWith("(") || !trimmed.endsWith(")")) return group;
  const inner = trimmed.slice(1, -1);
  const fields = splitTupleFields(inner);
  const kept = keepIndexes.map((idx) => (idx < fields.length ? fields[idx] : "NULL"));
  return `(${kept.join(",")})`;
}

function resolveInsertProjection(
  parsed: Pick<ParsedInsert, "table" | "tableToken" | "columnsRaw">,
  mysqlColumnMap: Record<string, string[]>,
  pgColumnMap: Record<string, TableColumnInfo>,
): InsertProjection {
  const { table, columnsRaw } = parsed;
  const pgInfo = pgColumnMap[table];

  if (columnsRaw) {
    const sourceCols = columnsRaw.split(",").map((c) => c.trim().replace(/["`]/g, "")).filter(Boolean);
    if (!pgInfo) return { columns: sourceCols, keepIndexes: null };

    const keepIndexes = sourceCols
      .map((col, idx) => (pgInfo.names.has(col.toLowerCase()) ? idx : -1))
      .filter((idx) => idx >= 0);

    if (keepIndexes.length === 0) return { columns: sourceCols, keepIndexes: null };
    if (keepIndexes.length === sourceCols.length) return { columns: sourceCols, keepIndexes: null };

    return { columns: keepIndexes.map((idx) => sourceCols[idx]), keepIndexes };
  }

  const mysqlCols = mysqlColumnMap[table];
  if (!mysqlCols || mysqlCols.length === 0) {
    // No MySQL column order known — pass through as-is.
    // Do NOT add PG columns: PG ordinal order differs from MySQL's.
    return { columns: null, keepIndexes: null };
  }

  const keepIndexes = mysqlCols
    .map((col, idx) => (pgInfo.names.has(col.toLowerCase()) ? idx : -1))
    .filter((idx) => idx >= 0);

  if (keepIndexes.length === 0) return { columns: null, keepIndexes: null };
  if (keepIndexes.length === mysqlCols.length) return { columns: mysqlCols, keepIndexes: null };

  return { columns: keepIndexes.map((idx) => mysqlCols[idx]), keepIndexes };
}

async function loadTableColumnInfo(connection: any): Promise<Record<string, TableColumnInfo>> {
  const result = await connection.queryObject<{ table_name: string; column_name: string }>(`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public' ORDER BY table_name, ordinal_position
  `);
  const map: Record<string, TableColumnInfo> = {};
  for (const row of result.rows) {
    const table = row.table_name.toLowerCase();
    if (!map[table]) map[table] = { names: new Set<string>(), ordered: [] };
    map[table].names.add(row.column_name.toLowerCase());
    map[table].ordered.push(row.column_name);
  }
  return map;
}

async function loadBooleanColumnInfo(connection: any): Promise<Record<string, BooleanColumnInfo>> {
  const result = await connection.queryObject<{ table_name: string; column_name: string; ordinal_position: number }>(`
    SELECT table_name, column_name, ordinal_position FROM information_schema.columns
    WHERE table_schema = 'public' AND data_type = 'boolean' ORDER BY table_name, ordinal_position
  `);
  const map: Record<string, BooleanColumnInfo> = {};
  for (const row of result.rows) {
    const table = row.table_name.toLowerCase();
    if (!map[table]) map[table] = { names: new Set<string>(), indexes: [] };
    map[table].names.add(row.column_name.toLowerCase());
    map[table].indexes.push(Number(row.ordinal_position) - 1);
  }
  return map;
}

async function loadVarcharColumnInfo(connection: any): Promise<Record<string, VarcharColumnInfo>> {
  const result = await connection.queryObject<{
    table_name: string; column_name: string; ordinal_position: number; character_maximum_length: number;
  }>(`
    SELECT table_name, column_name, ordinal_position, character_maximum_length FROM information_schema.columns
    WHERE table_schema = 'public' AND data_type = 'character varying' AND character_maximum_length IS NOT NULL
    ORDER BY table_name, ordinal_position
  `);
  const map: Record<string, VarcharColumnInfo> = {};
  for (const row of result.rows) {
    const table = row.table_name.toLowerCase();
    if (!map[table]) map[table] = { maxByName: new Map<string, number>(), maxByIndex: new Map<number, number>() };
    const maxLen = Number(row.character_maximum_length);
    map[table].maxByName.set(row.column_name.toLowerCase(), maxLen);
    map[table].maxByIndex.set(Number(row.ordinal_position) - 1, maxLen);
  }
  return map;
}

async function loadJsonColumnInfo(connection: any): Promise<Record<string, JsonColumnInfo>> {
  const result = await connection.queryObject<{ table_name: string; column_name: string; ordinal_position: number }>(`
    SELECT table_name, column_name, ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'public' AND data_type IN ('json', 'jsonb')
    ORDER BY table_name, ordinal_position
  `);

  const map: Record<string, JsonColumnInfo> = {};
  for (const row of result.rows) {
    const table = row.table_name.toLowerCase();
    if (!map[table]) map[table] = { names: new Set<string>(), indexes: [] };
    map[table].names.add(row.column_name.toLowerCase());
    map[table].indexes.push(Number(row.ordinal_position) - 1);
  }
  return map;
}

async function loadImportColumnMap(connection: any): Promise<Record<string, string[]>> {
  const map: Record<string, string[]> = {};
  try {
    const result = await connection.queryObject<{ table_name: string; columns: string[] | null }>(`
      SELECT table_name, columns FROM public._import_column_map
    `);

    for (const row of result.rows) {
      const table = row.table_name?.toLowerCase?.();
      if (!table || !Array.isArray(row.columns) || row.columns.length === 0) continue;
      map[table] = row.columns.map((col) => String(col));
    }
  } catch (_err) {
    // table optional for runtime mapping, ignore when unavailable
  }

  return map;
}

function normalizeBooleanLiterals(insertSql: string, booleanMap: Record<string, BooleanColumnInfo>): string {
  const parsed = parseInsertStatement(insertSql);
  if (!parsed) return insertSql;
  const { table, columnsRaw, valuesRaw, tableToken } = parsed;
  const boolInfo = booleanMap[table];
  if (!boolInfo) return insertSql;

  let boolIndexes: number[] = [];
  let columns: string[] | null = null;

  if (columnsRaw) {
    columns = columnsRaw.split(",").map((c) => c.trim().replace(/["`]/g, "")).filter(Boolean);
    boolIndexes = columns.map((col, idx) => (boolInfo.names.has(col.toLowerCase()) ? idx : -1)).filter((idx) => idx >= 0);
  } else {
    boolIndexes = boolInfo.indexes;
  }

  if (boolIndexes.length === 0) return insertSql;

  const groups = splitTopLevelGroups(valuesRaw).filter((g) => g.trim().startsWith("("));
  const normalizedGroups = groups.map((group) => {
    const trimmed = group.trim();
    if (!trimmed.startsWith("(") || !trimmed.endsWith(")")) return group;
    const inner = trimmed.slice(1, -1);
    const fields = splitTupleFields(inner);
    for (const idx of boolIndexes) {
      if (idx < 0 || idx >= fields.length) continue;
      const value = fields[idx].trim();
      if (value === "0" || value === "'0'") fields[idx] = "false";
      else if (value === "1" || value === "'1'") fields[idx] = "true";
      else if (value === "''" || /^'\s*'$/.test(value)) fields[idx] = "NULL";
    }
    return `(${fields.join(",")})`;
  });

  return buildInsertStatement(tableToken, columns, normalizedGroups);
}

function truncateStringLiteral(field: string, maxLen: number): string {
  const trimmed = field.trim();
  if (trimmed.toUpperCase() === "NULL") return field;
  if (!trimmed.startsWith("'") || !trimmed.endsWith("'")) return field;
  const inner = trimmed.slice(1, -1);
  const decoded = inner.replace(/''/g, "'");
  if (decoded.length <= maxLen) return field;
  const truncated = decoded.slice(0, maxLen).replace(/'/g, "''");
  return `'${truncated}'`;
}

function truncateVarcharLiterals(insertSql: string, varcharMap: Record<string, VarcharColumnInfo>): string {
  const parsed = parseInsertStatement(insertSql);
  if (!parsed) return insertSql;
  const { table, columnsRaw, valuesRaw, tableToken } = parsed;
  const info = varcharMap[table];
  if (!info) return insertSql;

  let varcharIndexes: Array<{ idx: number; maxLen: number }> = [];
  let columns: string[] | null = null;

  if (columnsRaw) {
    columns = columnsRaw.split(",").map((c) => c.trim().replace(/["`]/g, "")).filter(Boolean);
    varcharIndexes = columns
      .map((col, idx) => { const maxLen = info.maxByName.get(col.toLowerCase()); return maxLen ? { idx, maxLen } : null; })
      .filter((v): v is { idx: number; maxLen: number } => v !== null);
  } else {
    varcharIndexes = [...info.maxByIndex.entries()].map(([idx, maxLen]) => ({ idx, maxLen }));
  }

  if (varcharIndexes.length === 0) return insertSql;

  const groups = splitTopLevelGroups(valuesRaw).filter((g) => g.trim().startsWith("("));
  const normalizedGroups = groups.map((group) => {
    const trimmed = group.trim();
    if (!trimmed.startsWith("(") || !trimmed.endsWith(")")) return group;
    const inner = trimmed.slice(1, -1);
    const fields = splitTupleFields(inner);
    for (const { idx, maxLen } of varcharIndexes) {
      if (idx < 0 || idx >= fields.length) continue;
      fields[idx] = truncateStringLiteral(fields[idx], maxLen);
    }
    return `(${fields.join(",")})`;
  });

  return buildInsertStatement(tableToken, columns, normalizedGroups);
}

function normalizeJsonField(field: string): string {
  const trimmed = field.trim();
  if (trimmed.toUpperCase() === "NULL") return field;

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    const inner = trimmed.slice(1, -1).replace(/''/g, "'").trim();
    if (!inner || inner.toLowerCase() === "null") return "NULL";
    try {
      JSON.parse(inner);
      return `'${inner.replace(/'/g, "''")}'`;
    } catch (_e) {
      return "NULL";
    }
  }

  try {
    JSON.parse(trimmed);
    return field;
  } catch (_e) {
    return field;
  }
}

function normalizeJsonLiterals(insertSql: string, jsonMap: Record<string, JsonColumnInfo>): string {
  const parsed = parseInsertStatement(insertSql);
  if (!parsed) return insertSql;
  const { table, columnsRaw, valuesRaw, tableToken } = parsed;
  const info = jsonMap[table];
  if (!info) return insertSql;

  let jsonIndexes: number[] = [];
  let columns: string[] | null = null;

  if (columnsRaw) {
    columns = columnsRaw.split(",").map((c) => c.trim().replace(/["`]/g, "")).filter(Boolean);
    jsonIndexes = columns
      .map((col, idx) => (info.names.has(col.toLowerCase()) ? idx : -1))
      .filter((idx) => idx >= 0);
  } else {
    jsonIndexes = info.indexes;
  }

  if (jsonIndexes.length === 0) return insertSql;

  const groups = splitTopLevelGroups(valuesRaw).filter((g) => g.trim().startsWith("("));
  const normalizedGroups = groups.map((group) => {
    const trimmed = group.trim();
    if (!trimmed.startsWith("(") || !trimmed.endsWith(")")) return group;
    const inner = trimmed.slice(1, -1);
    const fields = splitTupleFields(inner);

    for (const idx of jsonIndexes) {
      if (idx < 0 || idx >= fields.length) continue;
      fields[idx] = normalizeJsonField(fields[idx]);
    }

    return `(${fields.join(",")})`;
  });

  return buildInsertStatement(tableToken, columns, normalizedGroups);
}

function removeMissingColumnFromInsert(insertSql: string, missingColumn: string): string | null {
  const parsed = parseInsertStatement(insertSql);
  if (!parsed || !parsed.columnsRaw) return null;
  const { tableToken, columnsRaw, valuesRaw } = parsed;
  const columns = columnsRaw.split(",").map((c) => c.trim().replace(/["`]/g, "")).filter(Boolean);
  const target = missingColumn.toLowerCase();
  const removeIdx = columns.findIndex((c) => c.toLowerCase() === target);
  if (removeIdx === -1) return null;
  const keepIndexes = columns.map((_c, idx) => idx).filter((idx) => idx !== removeIdx);
  const nextColumns = keepIndexes.map((idx) => columns[idx]);
  const groups = splitTopLevelGroups(valuesRaw).filter((g) => g.trim().startsWith("("));
  const nextGroups = groups.map((group) => filterGroupByIndexes(group, keepIndexes));
  return buildInsertStatement(tableToken, nextColumns, nextGroups);
}

function addConflictIgnore(insertSql: string): string {
  if (/\sON\s+CONFLICT\s+/i.test(insertSql)) return insertSql;
  return insertSql.replace(/;\s*$/, " ON CONFLICT DO NOTHING;");
}

function estimateRows(insertSql: string): number {
  const parsed = parseInsertStatement(insertSql);
  if (!parsed) return 1;
  return splitTopLevelGroups(parsed.valuesRaw).length;
}

async function executeBatchWithAutoFix(
  connection: any,
  sql: string,
  booleanMap: Record<string, BooleanColumnInfo>,
  varcharMap: Record<string, VarcharColumnInfo>,
  jsonMap: Record<string, JsonColumnInfo>,
): Promise<{ ok: boolean; rows: number; error?: string }> {
  let attemptSql = addConflictIgnore(sql);
  attemptSql = sanitizeUnicodeEscapes(attemptSql);
  attemptSql = normalizeBooleanLiterals(attemptSql, booleanMap);
  attemptSql = normalizeJsonLiterals(attemptSql, jsonMap);
  attemptSql = truncateVarcharLiterals(attemptSql, varcharMap);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await connection.queryObject(attemptSql);
      return { ok: true, rows: estimateRows(attemptSql) };
    } catch (e: any) {
      const message = e?.message ?? String(e);
      const missingColumnMatch = message.match(/column\s+"([^"]+)"\s+of relation\s+"([^"]+)"\s+does not exist/i);
      if (missingColumnMatch) {
        const col = missingColumnMatch[1];
        const repaired = removeMissingColumnFromInsert(attemptSql, col);
        if (repaired && repaired !== attemptSql) {
          attemptSql = normalizeBooleanLiterals(repaired, booleanMap);
          attemptSql = normalizeJsonLiterals(attemptSql, jsonMap);
          attemptSql = truncateVarcharLiterals(attemptSql, varcharMap);
          continue;
        }
      }
      const retruncated = truncateVarcharLiterals(attemptSql, varcharMap);
      if (retruncated !== attemptSql) { attemptSql = retruncated; continue; }
      return { ok: false, rows: 0, error: `Error: ${message} (first 200: ${attemptSql.substring(0, 200)})` };
    }
  }
  return { ok: false, rows: 0, error: `Error: max retries reached (first 200: ${attemptSql.substring(0, 200)})` };
}

async function resetAllPublicTables(connection: any): Promise<void> {
  const result = await connection.queryObject<{ table_name: string }>(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
  // Exclude _import_column_map from truncation to preserve column mappings
  const tables = result.rows.map((r) => r.table_name).filter((t) => t !== "_import_column_map");
  if (tables.length > 0) {
    const quoted = tables.map((t) => `"${t.replace(/"/g, '""')}"`).join(", ");
    await connection.queryObject(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`);
  }
}

function shouldReset(req: Request): boolean {
  return req.headers.get("x-import-reset")?.toLowerCase() === "true";
}

// ─── CHUNK MODE: receive pre-split INSERT statements as text, execute directly ───

function normalizeInsertForPg(rawSql: string): string {
  // Remove backticks, rename `users` → `pim_users`, add OVERRIDING SYSTEM VALUE
  let sql = rawSql.replace(/`/g, "");
  sql = sql.replace(/INSERT INTO\s+(?:\w+\.)?users(\s|\()/i, "INSERT INTO pim_users$1");

  // Add OVERRIDING SYSTEM VALUE if not already present
  if (!/OVERRIDING SYSTEM VALUE/i.test(sql)) {
    sql = sql.replace(/\)\s*VALUES/i, ") OVERRIDING SYSTEM VALUE VALUES");
    // For inserts without column list
    sql = sql.replace(/(INSERT INTO\s+\S+)\s+VALUES/i, (match, prefix) => {
      if (/OVERRIDING/i.test(match)) return match;
      return `${prefix} OVERRIDING SYSTEM VALUE VALUES`;
    });
  }

  return sql;
}

async function handleChunkMode(
  req: Request,
  connection: any,
  booleanMap: Record<string, BooleanColumnInfo>,
  varcharMap: Record<string, VarcharColumnInfo>,
  jsonMap: Record<string, JsonColumnInfo>,
  pgColumnMap: Record<string, TableColumnInfo>,
  mysqlColumnMap: Record<string, string[]>,
): Promise<Response> {
  const bodyBytes = await req.arrayBuffer();
  const bodyText = new TextDecoder().decode(bodyBytes);

  if (!bodyText || bodyText.trim().length < 10) {
    return new Response(JSON.stringify({ success: true, statements: 0, approximateRows: 0, errorCount: 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Extract complete statements (split by semicolons respecting strings)
  const statements = extractStatementsFromText(bodyText);
  let totalRows = 0;
  let processedStatements = 0;
  const errors: string[] = [];

  for (const rawStmt of statements) {
    if (!/^INSERT\s+INTO/i.test(rawStmt.trim())) continue;

    let stmt = normalizeInsertForPg(rawStmt);
    stmt = convertMySQLEscapes(stmt);

    // Resolve projection to handle column mismatches and legacy MySQL column orders
    const parsed = parseInsertStatement(stmt);
    if (parsed) {
      const projection = resolveInsertProjection(
        { tableToken: parsed.tableToken, table: parsed.table, columnsRaw: parsed.columnsRaw },
        mysqlColumnMap,
        pgColumnMap,
      );

      if ((projection.columns && projection.columns.length > 0) || projection.keepIndexes) {
        const groups = splitTopLevelGroups(parsed.valuesRaw).filter((g) => g.trim().startsWith("("));
        const projectedGroups = projection.keepIndexes
          ? groups.map((g) => filterGroupByIndexes(g, projection.keepIndexes!))
          : groups;
        stmt = buildInsertStatement(parsed.tableToken, projection.columns, projectedGroups);
      }
    }

    const result = await executeBatchWithAutoFix(connection, stmt, booleanMap, varcharMap, jsonMap);
    if (result.ok) {
      totalRows += result.rows;
      processedStatements++;
    } else if (result.error && errors.length < 50) {
      errors.push(result.error);
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      statements: processedStatements,
      approximateRows: totalRows,
      errors: errors.length > 0 ? errors.slice(0, 15) : undefined,
      errorCount: errors.length,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

function extractStatementsFromText(text: string): string[] {
  const statements: string[] = [];
  let inStr = false;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  let cutStart = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = i + 1 < text.length ? text[i + 1] : "";
    const prev = i > 0 ? text[i - 1] : "";

    if (inLineComment) { if (ch === "\n") inLineComment = false; continue; }
    if (inBlockComment) { if (prev === "*" && ch === "/") inBlockComment = false; continue; }

    if (inStr) {
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }
      if (ch === "'" && next === "'") { i++; continue; }
      if (ch === "'") inStr = false;
      continue;
    }

    if (ch === "'") { inStr = true; continue; }
    if (ch === "-" && next === "-") { inLineComment = true; i++; continue; }
    if (ch === "#") { inLineComment = true; continue; }
    if (ch === "/" && next === "*") { inBlockComment = true; i++; continue; }

    if (ch === ";") {
      const stmt = text.slice(cutStart, i + 1).trim();
      if (stmt) statements.push(stmt);
      cutStart = i + 1;
    }
  }

  const tail = text.slice(cutStart).trim();
  if (tail) statements.push(tail);
  return statements;
}

// ─── FULL DUMP MODE: receive entire file, parse CREATE TABLE + INSERT ───

async function saveRequestBodyToTempFile(req: Request): Promise<{ filePath: string; byteSize: number }> {
  if (!req.body) throw new Error("No request body provided");
  const filePath = `/tmp/import-${crypto.randomUUID()}.sql`;
  const file = await Deno.open(filePath, { create: true, write: true, truncate: true });
  const reader = req.body.getReader();
  let byteSize = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || value.byteLength === 0) continue;
      byteSize += value.byteLength;
      await file.write(value);
    }
  } finally {
    reader.releaseLock();
    file.close();
  }
  if (byteSize < 10) throw new Error("No dump text provided");
  return { filePath, byteSize };
}

async function extractMySQLColumnOrderFromFile(filePath: string): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};
  let currentTable: string | null = null;
  let cols: string[] = [];
  let inCreate = false;

  const file = await Deno.open(filePath, { read: true });
  try {
    for await (const line of readLines(file)) {
      const t = line.trim();
      if (!inCreate) {
        const m = t.match(/^CREATE\s+TABLE\s+`?(\w+)`?/i);
        if (m) {
          currentTable = m[1].toLowerCase();
          if (currentTable === "users") currentTable = "pim_users";
          cols = [];
          inCreate = true;
        }
      } else {
        if (t.startsWith(")")) {
          if (currentTable && cols.length > 0) result[currentTable] = cols;
          inCreate = false;
          currentTable = null;
          continue;
        }
        if (/^(PRIMARY KEY|KEY |UNIQUE KEY|CONSTRAINT|INDEX|FOREIGN KEY)/i.test(t)) continue;
        const cm = t.match(/^`?(\w+)`?/);
        if (cm) cols.push(cm[1]);
      }
    }
  } finally {
    file.close();
  }
  return result;
}

type InsertHeader = {
  tableToken: string;
  table: string;
  columnsRaw: string | null;
  valuesRemainder: string;
};

function parseInsertHeaderBuffer(buffer: string): InsertHeader | null {
  let normalized = buffer.replace(/`/g, "");
  normalized = normalized.replace(/INSERT INTO\s+(?:\w+\.)?users(\s|\()/i, "INSERT INTO pim_users$1");
  const match = normalized.match(/^INSERT INTO\s+(\S+)(?:\s+\(([^)]+)\))?\s+VALUES\s*(.*)$/is);
  if (!match) return null;
  const tableToken = normalizeTableName(match[1]);
  const table = normalizeTableName(tableToken);
  const columnsRaw = match[2]?.trim() ?? null;
  const valuesRemainder = match[3] ?? "";
  return { tableToken, table, columnsRaw, valuesRemainder };
}

class InsertValuesStreamParser {
  private depth = 0;
  private inStr = false;
  private pending = "";
  private done = false;

  feed(chunk: string): { groups: string[]; done: boolean } {
    const groups: string[] = [];
    for (let i = 0; i < chunk.length; i++) {
      if (this.done) break;
      const ch = chunk[i];

      if (this.inStr) {
        this.pending += ch;
        if (ch === "\\") { if (i + 1 < chunk.length) { this.pending += chunk[i + 1]; i++; } continue; }
        if (ch === "'" && i + 1 < chunk.length && chunk[i + 1] === "'") { this.pending += "'"; i++; continue; }
        if (ch === "'") this.inStr = false;
        continue;
      }

      if (ch === "'") { if (this.depth > 0) this.pending += ch; this.inStr = true; continue; }
      if (ch === "(") { this.depth++; this.pending += ch; continue; }
      if (ch === ")") {
        this.depth--;
        this.pending += ch;
        if (this.depth === 0) { const group = this.pending.trim(); if (group) groups.push(group); this.pending = ""; }
        continue;
      }
      if (this.depth === 0) { if (ch === ";") this.done = true; continue; }
      this.pending += ch;
    }
    return { groups, done: this.done };
  }
}

async function processDumpFile(
  connection: any,
  filePath: string,
  mysqlColumnMap: Record<string, string[]>,
  pgColumnMap: Record<string, TableColumnInfo>,
  booleanMap: Record<string, BooleanColumnInfo>,
  varcharMap: Record<string, VarcharColumnInfo>,
  jsonMap: Record<string, JsonColumnInfo>,
): Promise<{ processedStatements: number; totalRows: number; errors: string[] }> {
  type ActiveInsertState = {
    tableToken: string;
    projection: InsertProjection;
    parser: InsertValuesStreamParser;
    pendingGroups: string[];
  };

  const batchSize = 50;
  let totalRows = 0;
  let processedStatements = 0;
  const errors: string[] = [];
  let active: ActiveInsertState | null = null;
  let headerBuffer = "";
  let collectingHeader = false;

  const flushActive = async (force = false) => {
    if (!active) return;
    while (active && (active.pendingGroups.length >= batchSize || (force && active.pendingGroups.length > 0))) {
      const take = Math.min(batchSize, active.pendingGroups.length);
      const groups = active.pendingGroups.splice(0, take);
      const sql = buildInsertStatement(active.tableToken, active.projection.columns, groups);
      const converted = convertMySQLEscapes(sql);
      const result = await executeBatchWithAutoFix(connection, converted, booleanMap, varcharMap, jsonMap);
      if (result.ok) { totalRows += result.rows; }
      else if (result.error && errors.length < 300) { console.error(result.error); errors.push(result.error); }
    }
  };

  const feedActive = async (chunk: string) => {
    if (!active) return;
    const { groups, done } = active.parser.feed(chunk);
    for (const group of groups) {
      const projected = active.projection.keepIndexes ? filterGroupByIndexes(group, active.projection.keepIndexes) : group;
      active.pendingGroups.push(projected);
      if (active.pendingGroups.length >= batchSize) await flushActive(false);
    }
    if (done) {
      await flushActive(true);
      processedStatements++;
      if (processedStatements % 5 === 0) console.log(`Processed ${processedStatements} INSERT statements, ${totalRows} rows so far`);
      active = null;
    }
  };

  const file = await Deno.open(filePath, { read: true });
  try {
    for await (const rawLine of readLines(file)) {
      const t = rawLine.trim();
      if (active) { await feedActive(rawLine + "\n"); continue; }
      if (!collectingHeader) {
        if (!t || t.startsWith("--") || t.startsWith("/*") || t.startsWith("LOCK ") || t.startsWith("UNLOCK ") ||
            t.startsWith("DROP ") || t.startsWith("CREATE ") || t.startsWith("SET ") || t.startsWith("/*!")) continue;
        if (!t.toUpperCase().startsWith("INSERT INTO")) continue;
        collectingHeader = true;
        headerBuffer = rawLine;
      } else {
        headerBuffer += "\n" + rawLine;
      }
      const header = parseInsertHeaderBuffer(headerBuffer);
      if (!header) continue;
      const projection = resolveInsertProjection(
        { tableToken: header.tableToken, table: header.table, columnsRaw: header.columnsRaw },
        mysqlColumnMap, pgColumnMap,
      );
      active = { tableToken: header.tableToken, projection, parser: new InsertValuesStreamParser(), pendingGroups: [] };
      collectingHeader = false;
      headerBuffer = "";
      await feedActive(header.valuesRemainder + "\n");
    }
    if (active) await feedActive(";");
  } finally {
    file.close();
  }

  return { processedStatements, totalRows, errors };
}

// ─── Main handler ───

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const importMode = req.headers.get("x-import-mode")?.toLowerCase() ?? "full";
  let tempFilePath: string | null = null;

  try {
    const dbUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!dbUrl) throw new Error("SUPABASE_DB_URL not configured");

    const { Pool } = await import("https://deno.land/x/postgres@v0.17.0/mod.ts");
    const pool = new Pool(dbUrl, 3, true);
    const connection = await pool.connect();

    try {
      if (shouldReset(req)) {
        console.log("Reset requested: truncating all public tables");
        await resetAllPublicTables(connection);
      }

      try { await connection.queryObject(`SET session_replication_role = replica`); } catch (_e) {}

      const [pgColumnMap, booleanMap, varcharMap, jsonMap, storedImportColumnMap] = await Promise.all([
        loadTableColumnInfo(connection),
        loadBooleanColumnInfo(connection),
        loadVarcharColumnInfo(connection),
        loadJsonColumnInfo(connection),
        loadImportColumnMap(connection),
      ]);

      const chunkColumnMap: Record<string, string[]> = {
        ...LEGACY_COLUMN_ORDERS,
        ...storedImportColumnMap,
      };

      // ─── INIT-COLUMNS MODE: store MySQL column orders ───
      if (importMode === "init-columns") {
        const bodyBytes = await req.arrayBuffer();
        const mappings = JSON.parse(new TextDecoder().decode(bodyBytes)) as Record<string, string[]>;
        await connection.queryObject(`DELETE FROM _import_column_map`);
        for (const [tableName, cols] of Object.entries(mappings)) {
          if (!Array.isArray(cols) || cols.length === 0) continue;
          await connection.queryObject(
            `INSERT INTO _import_column_map (table_name, columns) VALUES ($1, $2::text[])`,
            [tableName, cols],
          );
        }
        console.log(`Stored column mappings for ${Object.keys(mappings).length} tables`);
        return new Response(
          JSON.stringify({ success: true, tables: Object.keys(mappings).length }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // ─── CHUNK MODE ───
      if (importMode === "chunk") {
        const response = await handleChunkMode(req, connection, booleanMap, varcharMap, jsonMap, pgColumnMap, chunkColumnMap);
        try { await connection.queryObject(`SET session_replication_role = DEFAULT`); } catch (_e) {}
        return response;
      }

      // ─── FULL DUMP MODE ───
      const { filePath, byteSize } = await saveRequestBodyToTempFile(req);
      tempFilePath = filePath;
      console.log(`Received dump: ${byteSize} bytes`);

      const extractedColumnMap = await extractMySQLColumnOrderFromFile(filePath);
      const mysqlColumnMap: Record<string, string[]> = {
        ...chunkColumnMap,
        ...extractedColumnMap,
      };
      console.log(`Extracted column orders for ${Object.keys(extractedColumnMap).length} tables from CREATE TABLE`);
      console.log(`Column mappings available: ${Object.keys(mysqlColumnMap).length} tables`);

      const { processedStatements, totalRows, errors } = await processDumpFile(
        connection, filePath, mysqlColumnMap, pgColumnMap, booleanMap, varcharMap, jsonMap,
      );

      try { await connection.queryObject(`SET session_replication_role = DEFAULT`); } catch (_e) {}

      // Reset sequences
      const seqResult = await connection.queryObject<{ table_name: string }>(`
        SELECT table_name FROM information_schema.columns
        WHERE table_schema = 'public' AND column_name = 'id' AND is_identity = 'YES'
      `);
      for (const row of seqResult.rows) {
        try {
          await connection.queryObject(
            `SELECT setval(pg_get_serial_sequence('${row.table_name}', 'id'), COALESCE((SELECT MAX(id) FROM ${row.table_name}), 1))`,
          );
        } catch (_e) {}
      }

      return new Response(
        JSON.stringify({
          success: true,
          statements: processedStatements,
          approximateRows: totalRows,
          errors: errors.length > 0 ? errors.slice(0, 15) : undefined,
          errorCount: errors.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } finally {
      connection.release();
      await pool.end();
    }
  } catch (err: any) {
    console.error("Import error:", err);
    return new Response(JSON.stringify({ error: err.message ?? "Unknown import error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } finally {
    if (tempFilePath) {
      try { await Deno.remove(tempFilePath); } catch (_e) {}
    }
  }
});
