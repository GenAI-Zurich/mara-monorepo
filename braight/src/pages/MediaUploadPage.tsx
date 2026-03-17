import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const CONCURRENCY = 3; // parallel uploads
const RETRY_ATTEMPTS = 5;
const RETRY_BASE_DELAY = 2000;

interface FileStatus {
  originalPath: string;
  storagePath: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  attempts: number;
}

const MediaUploadPage = () => {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);
  const fileMapRef = useRef<Map<string, File>>(new Map());

  const addLog = (msg: string) => {
    setLog((prev) => {
      const next = [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`];
      setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      return next;
    });
  };

  const sanitizeStorageSegment = (segment: string) => {
    const normalized = segment.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    const asciiSafe = normalized.replace(/[^\x20-\x7E]/g, "_");
    const cleaned = asciiSafe.replace(/[\\#?%]/g, "_").replace(/\s+/g, " ").trim();
    return cleaned.length > 0 ? cleaned : "file";
  };

  const sanitizeStoragePath = (rawPath: string) =>
    rawPath
      .split("/")
      .filter(Boolean)
      .map((segment) => sanitizeStorageSegment(segment))
      .join("/");

  const ensureUniqueStoragePath = (candidatePath: string, usedPaths: Set<string>) => {
    if (!usedPaths.has(candidatePath)) {
      usedPaths.add(candidatePath);
      return candidatePath;
    }

    const lastSlash = candidatePath.lastIndexOf("/");
    const dir = lastSlash >= 0 ? candidatePath.slice(0, lastSlash + 1) : "";
    const fileName = lastSlash >= 0 ? candidatePath.slice(lastSlash + 1) : candidatePath;
    const dot = fileName.lastIndexOf(".");
    const base = dot > 0 ? fileName.slice(0, dot) : fileName;
    const ext = dot > 0 ? fileName.slice(dot) : "";

    let i = 1;
    let unique = `${dir}${base}__${i}${ext}`;
    while (usedPaths.has(unique)) {
      i += 1;
      unique = `${dir}${base}__${i}${ext}`;
    }

    usedPaths.add(unique);
    return unique;
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const newFiles: FileStatus[] = [];
    const map = new Map<string, File>();
    const usedPaths = new Set<string>();
    let sanitizedCount = 0;
    let dedupedCount = 0;

    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      const relativePath = (file as any).webkitRelativePath || file.name;
      const sanitizedPath = sanitizeStoragePath(relativePath);
      const storagePath = ensureUniqueStoragePath(sanitizedPath, usedPaths);

      if (sanitizedPath !== relativePath) sanitizedCount += 1;
      if (storagePath !== sanitizedPath) dedupedCount += 1;

      map.set(storagePath, file);
      newFiles.push({
        originalPath: relativePath,
        storagePath,
        status: "pending",
        attempts: 0,
      });
    }

    fileMapRef.current = map;
    setFiles(newFiles);
    addLog(`📁 ${newFiles.length} Dateien ausgewählt`);
    if (sanitizedCount > 0) {
      addLog(`🛠️ ${sanitizedCount} Pfade für Storage bereinigt`);
    }
    if (dedupedCount > 0) {
      addLog(`🧩 ${dedupedCount} doppelte Dateinamen automatisch angepasst`);
    }
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const uploadSingleFile = async (
    originalPath: string,
    storagePath: string,
    fileObj: File
  ): Promise<boolean> => {
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
      if (abortRef.current) return false;

      try {
        const { error } = await supabase.storage
          .from("pim")
          .upload(storagePath, fileObj, { upsert: true });

        if (error) throw error;
        return true;
      } catch (err: any) {
        if (attempt < RETRY_ATTEMPTS) {
          await sleep(RETRY_BASE_DELAY * attempt);
          continue;
        }
        addLog(`❌ ${originalPath}: ${err.message}`);
        return false;
      }
    }
    return false;
  };

  const startUpload = async (onlyErrors = false) => {
    setUploading(true);
    abortRef.current = false;

    const toUpload = files
      .filter((f) => (onlyErrors ? f.status === "error" : f.status !== "done"))
      .map((f) => f.storagePath);

    const fileMetaByStoragePath = new Map(files.map((f) => [f.storagePath, f]));

    addLog(`🚀 Upload gestartet: ${toUpload.length} Dateien (${onlyErrors ? "nur Fehler" : "alle ausstehenden"})`);

    setFiles((prev) =>
      prev.map((f) =>
        toUpload.includes(f.storagePath) ? { ...f, status: "pending" as const } : f
      )
    );

    let done = 0;
    let errors = 0;
    const queue = [...toUpload];

    const worker = async () => {
      while (queue.length > 0 && !abortRef.current) {
        const storagePath = queue.shift();
        if (!storagePath) break;

        const fileObj = fileMapRef.current.get(storagePath);
        const fileMeta = fileMetaByStoragePath.get(storagePath);
        if (!fileObj || !fileMeta) {
          errors++;
          continue;
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.storagePath === storagePath ? { ...f, status: "uploading" as const } : f
          )
        );

        const success = await uploadSingleFile(fileMeta.originalPath, storagePath, fileObj);

        setFiles((prev) =>
          prev.map((f) =>
            f.storagePath === storagePath
              ? { ...f, status: success ? ("done" as const) : ("error" as const), attempts: f.attempts + 1 }
              : f
          )
        );

        if (success) done++;
        else errors++;

        if ((done + errors) % 50 === 0) {
          addLog(`📊 Fortschritt: ${done} ✅ / ${errors} ❌ / ${toUpload.length} gesamt`);
        }
      }
    };

    const workers = Array.from({ length: CONCURRENCY }, () => worker());
    await Promise.all(workers);

    addLog(`🏁 Upload abgeschlossen: ${done} ✅ / ${errors} ❌`);
    setUploading(false);
  };

  const stopUpload = () => {
    abortRef.current = true;
    addLog("⏹️ Upload wird gestoppt...");
  };

  const totalFiles = files.length;
  const doneFiles = files.filter((f) => f.status === "done").length;
  const errorFiles = files.filter((f) => f.status === "error").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;
  const progress = totalFiles > 0 ? (doneFiles / totalFiles) * 100 : 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-display mb-6">Media Batch Upload</h1>

      <div className="space-y-4 max-w-3xl">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Ordner auswählen (mit Unterordnern)
          </label>
          <input
            type="file"
            // @ts-ignore - webkitdirectory is not in types
            webkitdirectory=""
            // @ts-ignore
            directory=""
            multiple
            onChange={handleFolderSelect}
            disabled={uploading}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-border file:text-sm file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-accent cursor-pointer"
          />
        </div>

        {totalFiles > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>✅ {doneFiles}</span>
              <span>⏳ {uploadingFiles}</span>
              <span>❌ {errorFiles}</span>
              <span>📁 {totalFiles} gesamt</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-xs text-muted-foreground">{progress.toFixed(1)}%</div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => startUpload(false)}
            disabled={uploading || totalFiles === 0}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "⏳ Upload läuft ..." : "🚀 Upload starten"}
          </button>

          {errorFiles > 0 && !uploading && (
            <button
              onClick={() => startUpload(true)}
              className="px-6 py-3 bg-destructive text-destructive-foreground rounded-md font-semibold cursor-pointer"
            >
              🔄 {errorFiles} Fehler erneut versuchen
            </button>
          )}

          {uploading && (
            <button
              onClick={stopUpload}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md font-semibold cursor-pointer"
            >
              ⏹️ Stoppen
            </button>
          )}
        </div>

        <div className="bg-card border border-border rounded-md p-4 max-h-[400px] overflow-y-auto">
          <div className="text-xs font-mono space-y-0.5">
            {log.length === 0 ? (
              <div className="text-muted-foreground">Wähle einen Ordner und starte den Upload.</div>
            ) : (
              log.map((s, i) => (
                <div
                  key={i}
                  className={s.includes("❌") ? "text-destructive" : s.includes("✅") || s.includes("🏁") ? "text-primary" : "text-muted-foreground"}
                >
                  {s}
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>

        {errorFiles > 0 && !uploading && (
          <details className="text-sm">
            <summary className="cursor-pointer text-destructive font-semibold">
              {errorFiles} fehlgeschlagene Dateien anzeigen
            </summary>
            <div className="mt-2 max-h-[200px] overflow-y-auto bg-card border border-border rounded-md p-3">
              {files
                .filter((f) => f.status === "error")
                .map((f, i) => (
                  <div key={i} className="text-xs font-mono text-destructive">
                    {f.originalPath}
                    {f.originalPath !== f.storagePath ? ` → ${f.storagePath}` : ""} (Versuche: {f.attempts})
                  </div>
                ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default MediaUploadPage;
