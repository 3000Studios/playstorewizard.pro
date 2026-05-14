"use client";
import { useWizard } from "@/lib/store";
import { Badge } from "@/components/ui/primitives";
import { ImageIcon, MonitorSmartphone } from "lucide-react";

export function StepAssets() {
  const w = useWizard();
  function onIcon(file: File) {
    const reader = new FileReader();
    reader.onload = () => w.set({ iconDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }
  function onScreens(files: FileList) {
    const arr = Array.from(files).slice(0, 8);
    Promise.all(
      arr.map(
        (f) =>
          new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.readAsDataURL(f);
          })
      )
    ).then((dataUrls) => w.set({ screenshotDataUrls: dataUrls }));
  }
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />App icon (1024×1024 PNG)
        </p>
        <label className="block rounded-xl border-2 border-dashed border-border-strong bg-bg-2/40 p-6 text-center cursor-pointer">
          <input type="file" accept="image/png" className="hidden" onChange={(e) => e.target.files?.[0] && onIcon(e.target.files[0])} />
          {w.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- data: URL preview, not optimizable
            <img src={w.iconDataUrl} alt="icon" className="h-24 w-24 mx-auto rounded-2xl" />
          ) : (
            <p className="text-sm text-text-muted">Drop your icon</p>
          )}
        </label>
      </div>
      <div>
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <MonitorSmartphone className="h-4 w-4" />Screenshots (2-8 phone screenshots)
        </p>
        <label className="block rounded-xl border-2 border-dashed border-border-strong bg-bg-2/40 p-6 text-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onScreens(e.target.files)}
          />
          {w.screenshotDataUrls.length > 0 ? (
            <div className="flex gap-2 justify-center flex-wrap">
              {w.screenshotDataUrls.map((u, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- data: URL preview, not optimizable
                <img key={i} src={u} alt={`screen ${i + 1}`} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">Drop your screenshots — auto-resized to every Play size</p>
          )}
        </label>
        {w.screenshotDataUrls.length > 0 && (
          <p className="text-xs text-text-muted mt-2">
            <Badge variant="emerald">{w.screenshotDataUrls.length}</Badge> uploaded · auto-padded to phone, 7&quot;, and 10&quot; tablet sizes
          </p>
        )}
      </div>
    </div>
  );
}
