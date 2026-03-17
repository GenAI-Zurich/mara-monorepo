import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const MAX_REQUEST_BYTES = 900_000;
const MAX_CHUNK_RETRIES = 5;

const textEncoder = new TextEncoder();
const byteLength = (value: string) => textEncoder.encode(value).byteLength;

const splitTopLevelGroups = (valuesStr: string): string[] => {
  const groups: string[] = [];
  let depth = 0;
  let inStr = false;
  let current = "";

  for (let i = 0; i < valuesStr.length; i++) {
    const ch = valuesStr[i];
    if (inStr) {
      if (ch === "\\") { current += ch; if (i + 1 < valuesStr.length) { current += valuesStr[i + 1]; i++; } continue; }
      if (ch === "'" && i + 1 < valuesStr.length && valuesStr[i + 1] === "'") { current += "''"; i++; continue; }
      if (ch === "'") inStr = false;
      current += ch;
      continue;
    }
    if (ch === "'") { inStr = true; current += ch; continue; }
    if (ch === "(") { depth++; current += ch; continue; }
    if (ch === ")") {
      depth--; current += ch;
      if (depth === 0) { const group = current.trim(); if (group) groups.push(group); current = ""; }
      continue;
    }
    if (ch === "," && depth === 0) continue;
    current += ch;
  }
  const tail = current.trim();
  if (tail) groups.push(tail);
  return groups;
};

const expandStatementForRequestSize = (statement: string, maxBytes: number): string[] => {
  const cleaned = statement.trim();
  if (!cleaned) return [];
  if (byteLength(cleaned) <= maxBytes) return [cleaned];

  const match = cleaned.match(/^(INSERT INTO\s+\S+(?:\s+\([^)]+\))?\s+VALUES)\s*(.+);?\s*$/is);
  if (!match) return [cleaned];

  const insertPrefix = match[1];
  let valuesRaw = match[2].trim();
  if (valuesRaw.endsWith(";")) valuesRaw = valuesRaw.slice(0, -1).trim();

  const groups = splitTopLevelGroups(valuesRaw).filter((g) => g.trim().startsWith("("));
  if (groups.length <= 1) return [cleaned];

  const splitStatements: string[] = [];
  let pending: string[] = [];

  for (const group of groups) {
    const candidate = `${insertPrefix} ${[...pending, group].join(",")};`;
    if (byteLength(candidate) <= maxBytes || pending.length === 0) { pending.push(group); continue; }
    splitStatements.push(`${insertPrefix} ${pending.join(",")};`);
    pending = [group];
  }
  if (pending.length > 0) splitStatements.push(`${insertPrefix} ${pending.join(",")};`);
  return splitStatements;
};

const extractCompleteStatements = (buffer: string): { statements: string[]; rest: string } => {
  const statements: string[] = [];
  let inStr = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;
  let cutStart = 0;

  for (let i = 0; i < buffer.length; i++) {
    const ch = buffer[i];
    const next = i + 1 < buffer.length ? buffer[i + 1] : "";
    const prev = i > 0 ? buffer[i - 1] : "";

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
    if (ch === "-" && next === "-" && (i === 0 || /\s/.test(prev))) { inLineComment = true; i++; continue; }
    if (ch === "#") { inLineComment = true; continue; }
    if (ch === "/" && next === "*") { inBlockComment = true; i++; continue; }
    if (ch === ";") {
      const stmt = buffer.slice(cutStart, i + 1).trim();
      if (stmt) statements.push(stmt);
      cutStart = i + 1;
    }
  }

  return { statements, rest: buffer.slice(cutStart) };
};

/** Parse CREATE TABLE statement to extract column names in order */
const parseCreateTableColumns = (statement: string): { table: string; columns: string[] } | null => {
  const match = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`?(\w+)`?\.)?`?(\w+)`?\s*\(/i);
  if (!match) return null;
  let table = (match[2] || match[1]).toLowerCase();
  if (table === "users") table = "pim_users";

  const parenIdx = statement.indexOf("(", match.index! + match[0].length - 1);
  if (parenIdx < 0) return null;

  const body = statement.slice(parenIdx + 1);
  const columns: string[] = [];
  const lines = body.split(/\n/);
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith(")")) break;
    if (!t || t.startsWith("--")) continue;
    if (/^(PRIMARY\s+KEY|KEY\s|UNIQUE\s|CONSTRAINT\s|INDEX\s|FOREIGN\s|CHECK\s)/i.test(t)) continue;
    const colMatch = t.match(/^`?(\w+)`?\s/);
    if (colMatch) columns.push(colMatch[1]);
  }

  return columns.length > 0 ? { table, columns } : null;
};

/**
 * Pre-scan the entire file to extract ALL CREATE TABLE column orders.
 * This is a fast scan that only looks at CREATE TABLE statements.
 */
const prescanFileForCreateTables = async (
  file: File,
  addStatus: (msg: string) => void,
): Promise<Record<string, string[]>> => {
  addStatus("🔍 Vorscan: Extrahiere alle Tabellen-Strukturen ...");

  const reader = file.stream().getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  const columnMappings: Record<string, string[]> = {};

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    buffer += decoder.decode(value, { stream: true });

    const { statements, rest } = extractCompleteStatements(buffer);
    buffer = rest;

    for (const stmt of statements) {
      const trimmed = stmt.trim();
      if (/^CREATE\s+TABLE/i.test(trimmed)) {
        const parsed = parseCreateTableColumns(trimmed);
        if (parsed) {
          columnMappings[parsed.table] = parsed.columns;
        }
      }
    }
  }

  // Process remaining buffer
  buffer += decoder.decode();
  const { statements: finalStatements } = extractCompleteStatements(buffer);
  for (const stmt of finalStatements) {
    const trimmed = stmt.trim();
    if (/^CREATE\s+TABLE/i.test(trimmed)) {
      const parsed = parseCreateTableColumns(trimmed);
      if (parsed) {
        columnMappings[parsed.table] = parsed.columns;
      }
    }
  }

  addStatus(`✅ Vorscan: ${Object.keys(columnMappings).length} Tabellen-Strukturen gefunden`);
  return columnMappings;
};

const ImportPage = () => {
  const [status, setStatus] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addStatus = (msg: string) => {
    setStatus((prev) => {
      const next = [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`];
      setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      return next;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) {
      addStatus(`📁 Datei ausgewählt: ${selected.name} (${(selected.size / 1024 / 1024).toFixed(1)} MB)`);
    }
  };

  const invokeImportChunk = async (chunkSql: string, chunkNumber: number, reset: boolean) => {
    const chunkKb = (byteLength(chunkSql) / 1024).toFixed(0);

    for (let attempt = 1; attempt <= MAX_CHUNK_RETRIES; attempt++) {
      addStatus(`📦 Chunk ${chunkNumber}: ${chunkKb} KB (Versuch ${attempt}/${MAX_CHUNK_RETRIES})`);

      try {
        const { data, error } = await supabase.functions.invoke("import-mysql-dump", {
          body: new Blob([chunkSql], { type: "text/plain" }),
          headers: {
            "x-import-reset": reset ? "true" : "false",
            "x-import-mode": "chunk",
          },
        });

        if (error) {
          addStatus(`❌ Chunk ${chunkNumber}: ${error.message}`);
          if (attempt < MAX_CHUNK_RETRIES) { await sleep(1000 * attempt); continue; }
          throw new Error(`Chunk ${chunkNumber} fehlgeschlagen: ${error.message}`);
        }

        if (data?.errorCount > 0) {
          addStatus(`⚠️ Chunk ${chunkNumber}: ${data.errorCount} Fehler`);
          data.errors?.slice(0, 5).forEach((e: string) => addStatus(`  → ${e.substring(0, 170)}`));
        }

        addStatus(`✅ Chunk ${chunkNumber}: ${data?.statements ?? 0} Statements, ~${data?.approximateRows ?? 0} Zeilen`);
        return data;
      } catch (err: any) {
        if (attempt < MAX_CHUNK_RETRIES) {
          addStatus(`⚠️ Chunk ${chunkNumber} Versuch ${attempt} fehlgeschlagen, warte...`);
          await sleep(1000 * attempt);
          continue;
        }
        throw err;
      }
    }
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const sendColumnMappings = async (mappings: Record<string, string[]>) => {
    const tableCount = Object.keys(mappings).length;
    if (tableCount === 0) return;

    addStatus(`📋 Sende Spalten-Mapping für ${tableCount} Tabellen ...`);
    try {
      const { data, error } = await supabase.functions.invoke("import-mysql-dump", {
        body: JSON.stringify(mappings),
        headers: {
          "x-import-reset": "false",
          "x-import-mode": "init-columns",
          "content-type": "application/json",
        },
      });
      if (error) {
        addStatus(`⚠️ Spalten-Mapping Fehler: ${error.message}`);
      } else {
        addStatus(`✅ Spalten-Mapping gespeichert: ${data?.tables ?? tableCount} Tabellen`);
      }
    } catch (err: any) {
      addStatus(`⚠️ Spalten-Mapping Fehler: ${err.message}`);
    }
  };

  const checkCounts = async () => {
    addStatus("📊 Überprüfe Datenbank ...");
    const tables = [
      "articles", "article_classifications", "article_character_profiles",
      "article_technical_profiles", "manufacturers", "light_categories",
      "light_families", "article_accountings", "article_media",
    ];
    for (const table of tables) {
      const { count, error } = await supabase.from(table as any).select("*", { count: "exact", head: true });
      if (error) addStatus(`  ${table}: ❌ ${error.message}`);
      else addStatus(`  ${table}: ${count} Zeilen`);
    }
  };

  const startImport = async () => {
    if (!file) { addStatus("⚠️ Bitte zuerst eine .sql Datei auswählen"); return; }

    setImporting(true);
    setStatus([]);

    try {
      addStatus("🚀 Import gestartet (Client-Chunking + Auto-Retry) ...");
      addStatus(`📤 Datei: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`);

      // ── PASS 1: Pre-scan for ALL CREATE TABLE column orders ──
      const columnMappings = await prescanFileForCreateTables(file, addStatus);

      // ── Send column mappings FIRST (before any reset/data) ──
      await sendColumnMappings(columnMappings);

      // ── PASS 2: Stream INSERT statements as chunks ──
      addStatus("📤 Starte Daten-Import ...");
      const reader = file.stream().getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let chunkStatements: string[] = [];
      let chunkBytes = 0;
      let chunkNumber = 0;
      let firstChunk = true;
      let totalStatements = 0;
      let totalRows = 0;
      let readBytes = 0;
      let nextProgressMb = 10;

      const flushChunk = async () => {
        if (chunkStatements.length === 0) return;

        chunkNumber += 1;
        const chunkSql = chunkStatements.join("\n");
        const result = await invokeImportChunk(chunkSql, chunkNumber, firstChunk);
        firstChunk = false;
        totalStatements += Number(result?.statements ?? 0);
        totalRows += Number(result?.approximateRows ?? 0);
        chunkStatements = [];
        chunkBytes = 0;
      };

      const pushStatement = async (statement: string) => {
        const trimmed = statement.trim();
        if (!trimmed) return;

        // Skip CREATE TABLE (already processed in pass 1)
        if (/^CREATE\s+TABLE/i.test(trimmed)) return;

        // Only process INSERT statements
        if (!/^INSERT\s+INTO/i.test(trimmed)) return;

        const parts = expandStatementForRequestSize(trimmed, MAX_REQUEST_BYTES);
        for (const part of parts) {
          const partBytes = byteLength(part) + 1;
          if (chunkStatements.length > 0 && chunkBytes + partBytes > MAX_REQUEST_BYTES) await flushChunk();
          chunkStatements.push(part);
          chunkBytes += partBytes;
          if (chunkBytes >= MAX_REQUEST_BYTES) await flushChunk();
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        readBytes += value.byteLength;
        buffer += decoder.decode(value, { stream: true });

        const { statements, rest } = extractCompleteStatements(buffer);
        buffer = rest;

        for (const statement of statements) await pushStatement(statement);

        const readMb = readBytes / (1024 * 1024);
        if (readMb >= nextProgressMb) {
          addStatus(`📖 Datei gelesen: ${readMb.toFixed(1)} MB`);
          nextProgressMb += 10;
        }
      }

      buffer += decoder.decode();
      const { statements: finalStatements, rest } = extractCompleteStatements(buffer);
      for (const statement of finalStatements) await pushStatement(statement);

      const tail = rest.trim();
      if (tail) await pushStatement(tail.endsWith(";") ? tail : `${tail};`);

      await flushChunk();

      if (chunkNumber === 0) {
        throw new Error("Keine INSERT-Statements in der Datei gefunden");
      }

      addStatus(`🏁 Import abgeschlossen: ${chunkNumber} Chunks, ${totalStatements} Statements, ~${totalRows} Zeilen`);
      addStatus(`📋 ${Object.keys(columnMappings).length} Tabellen-Spalten extrahiert`);
      await checkCounts();
    } catch (err: any) {
      addStatus(`❌ Unerwarteter Fehler: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-display mb-6">PIM Daten Import</h1>

      <div className="space-y-4 max-w-3xl">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            MySQL Dump Datei auswählen (.sql) — wird lokal in kleine Stücke zerlegt
          </label>
          <input
            type="file"
            accept=".sql"
            onChange={handleFile}
            disabled={importing}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-border file:text-sm file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-accent cursor-pointer"
          />
        </div>

        <button
          onClick={startImport}
          disabled={importing || !file}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold disabled:opacity-50 cursor-pointer"
        >
          {importing ? "⏳ Import läuft ..." : "🚀 Import starten"}
        </button>

        <div className="bg-card border border-border rounded-md p-4 max-h-[520px] overflow-y-auto">
          <div className="text-xs font-mono space-y-0.5">
            {status.length === 0 ? (
              <div className="text-muted-foreground">Wähle deine SQL-Dump Datei und starte den Import.</div>
            ) : (
              status.map((s, i) => (
                <div
                  key={i}
                  className={s.includes("❌") ? "text-destructive" : s.includes("✅") ? "text-primary" : "text-muted-foreground"}
                >
                  {s}
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;
