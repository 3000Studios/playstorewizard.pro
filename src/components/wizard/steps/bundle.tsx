"use client";
import { useWizard } from "@/lib/store";
import { Badge } from "@/components/ui/primitives";
import { useState } from "react";
import { parseBundle } from "@/lib/bundle/parser";
import { UploadCloud, FileCheck2, AlertCircle } from "lucide-react";

export function StepBundle() {
  const w = useWizard();
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setError(null);
    setParsing(true);
    try {
      const buf = await file.arrayBuffer();
      const meta = await parseBundle(new Uint8Array(buf));
      w.set({
        bundleFormat: meta.format,
        versionName: meta.versionName,
        versionCode: meta.versionCode,
        minSdk: meta.minSdkVersion,
        targetSdk: meta.targetSdkVersion,
        declaredPermissions: meta.permissions,
        packageName: meta.packageName || w.packageName,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not parse bundle");
    } finally {
      setParsing(false);
    }
  }

  const hasParsed = w.versionName !== undefined;

  return (
    <div className="space-y-4">
      <label
        className="block rounded-xl border-2 border-dashed border-border-strong bg-bg-2/40 p-8 text-center cursor-pointer hover:border-brand-indigo/50 transition-colors"
      >
        <input
          type="file"
          accept=".aab,.apk"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
        <UploadCloud className="h-10 w-10 mx-auto text-text-muted mb-2" />
        <p className="text-text font-medium">Drop your .aab or .apk here</p>
        <p className="text-xs text-text-muted mt-1">Parsed entirely in your browser — file never leaves your device</p>
      </label>
      {parsing && <p className="text-sm text-text-muted">Parsing manifest…</p>}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
          <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-rose-200">{error}</p>
        </div>
      )}
      {hasParsed && (
        <div className="p-5 rounded-xl bg-bg-2 border border-border space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck2 className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-medium">Manifest parsed</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-text-dim">Format:</span> <Badge variant="indigo">{w.bundleFormat?.toUpperCase()}</Badge></div>
            <div><span className="text-text-dim">Version:</span> {w.versionName} ({w.versionCode})</div>
            <div><span className="text-text-dim">Min SDK:</span> {w.minSdk}</div>
            <div><span className="text-text-dim">Target SDK:</span> {w.targetSdk} {(w.targetSdk ?? 0) < 35 && <Badge variant="rose">Below API 35</Badge>}</div>
            <div className="col-span-2"><span className="text-text-dim">Permissions:</span> {w.declaredPermissions.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
