/**
 * Browser-side image resizer.
 *
 * Uses HTML5 canvas to produce every required Play Store asset from a single
 * source image. Runs entirely in the user's browser — no server cost, no
 * file upload required, source images never leave the client.
 *
 * Requires DOM types (browser environment only).
 */

import { ASSET_SPECS, type AssetSpec, type AssetCategory, getSpec } from "./specs";

export type FitMode =
  | "contain"  // letterbox to keep entire source visible
  | "cover"    // crop to fill the spec entirely
  | "stretch"; // distort to exactly fill (rare — only use if user explicitly asks)

export interface ResizeOptions {
  fit: FitMode;
  /** Background color used when fit="contain" leaves empty space. Hex like "#000000". */
  background?: string;
  /** Output quality for jpg/webp (0..1). PNG ignores this. */
  quality?: number;
  /** Override format (otherwise uses spec's first format). */
  format?: "png" | "jpg" | "webp";
}

const DEFAULT_OPTS: ResizeOptions = {
  fit: "cover",
  background: "#000000",
  quality: 0.92,
};

export interface ResizedAsset {
  spec: AssetSpec;
  blob: Blob;
  /** Object URL for previewing in the UI. Caller should revoke when done. */
  previewUrl: string;
  /** Pixel data — keep null after revokeObjectURL is called. */
  filename: string;
}

/**
 * Load an image from a File or Blob into an HTMLImageElement.
 */
export function loadImage(source: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode the image. Use PNG, JPG, or WebP."));
    };
    img.src = url;
  });
}

/**
 * Resize a source image to a single asset spec.
 */
export async function resizeToSpec(
  source: HTMLImageElement,
  spec: AssetSpec,
  options: Partial<ResizeOptions> = {}
): Promise<ResizedAsset> {
  const opts: ResizeOptions = { ...DEFAULT_OPTS, ...options };
  const format = opts.format ?? spec.formats[0];

  const canvas = document.createElement("canvas");
  canvas.width = spec.width;
  canvas.height = spec.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable in this browser.");

  // Background fill (for "contain" and JPG-with-alpha cases).
  if (format === "jpg" || opts.fit === "contain") {
    ctx.fillStyle = opts.background ?? "#000000";
    ctx.fillRect(0, 0, spec.width, spec.height);
  }

  const { dx, dy, dw, dh } = computeDrawDimensions(
    source.naturalWidth,
    source.naturalHeight,
    spec.width,
    spec.height,
    opts.fit
  );

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, dx, dy, dw, dh);

  const mimeType = format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
      mimeType,
      format === "png" ? undefined : opts.quality
    );
  });

  if (blob.size > spec.maxFileSizeMb * 1024 * 1024) {
    // Recursively try lower quality if oversized.
    if (format !== "png" && (opts.quality ?? 0.92) > 0.5) {
      return resizeToSpec(source, spec, { ...opts, quality: (opts.quality ?? 0.92) - 0.1 });
    }
    throw new Error(
      `Output exceeds ${spec.maxFileSizeMb}MB limit even at minimum quality. Try a smaller source image.`
    );
  }

  return {
    spec,
    blob,
    previewUrl: URL.createObjectURL(blob),
    filename: filenameFor(spec, format),
  };
}

/**
 * Resize a source image to every required spec at once. Returns all the
 * resulting assets, suitable for downloading as a ZIP.
 */
export async function resizeToAllRequired(
  source: HTMLImageElement,
  options: Partial<ResizeOptions> = {}
): Promise<ResizedAsset[]> {
  const required = ASSET_SPECS.filter((s) => s.requirement === "required");
  const results: ResizedAsset[] = [];
  for (const spec of required) {
    results.push(await resizeToSpec(source, spec, options));
  }
  return results;
}

/**
 * Resize a screenshot to phone + 7-inch tablet + 10-inch tablet versions.
 * Pads with the background color rather than cropping (so no content is lost).
 */
export async function resizeScreenshot(
  source: HTMLImageElement,
  options: Partial<ResizeOptions> = {}
): Promise<ResizedAsset[]> {
  const screenshotSpecs: AssetCategory[] = [
    "phone-screenshot",
    "tablet-7-screenshot",
    "tablet-10-screenshot",
  ];
  const results: ResizedAsset[] = [];
  for (const cat of screenshotSpecs) {
    const spec = getSpec(cat);
    if (!spec) continue;
    // Default to "contain" for screenshots so nothing is cropped.
    results.push(await resizeToSpec(source, spec, { fit: "contain", ...options }));
  }
  return results;
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function computeDrawDimensions(
  sw: number,
  sh: number,
  dw: number,
  dh: number,
  fit: FitMode
): { dx: number; dy: number; dw: number; dh: number } {
  if (fit === "stretch") {
    return { dx: 0, dy: 0, dw, dh };
  }

  const sourceRatio = sw / sh;
  const destRatio = dw / dh;

  let outW: number;
  let outH: number;

  if (fit === "cover") {
    if (sourceRatio > destRatio) {
      outH = dh;
      outW = dh * sourceRatio;
    } else {
      outW = dw;
      outH = dw / sourceRatio;
    }
  } else {
    // contain
    if (sourceRatio > destRatio) {
      outW = dw;
      outH = dw / sourceRatio;
    } else {
      outH = dh;
      outW = dh * sourceRatio;
    }
  }

  const offsetX = (dw - outW) / 2;
  const offsetY = (dh - outH) / 2;

  return { dx: offsetX, dy: offsetY, dw: outW, dh: outH };
}

function filenameFor(spec: AssetSpec, format: string): string {
  return `${spec.category}-${spec.width}x${spec.height}.${format === "jpg" ? "jpg" : format}`;
}

/**
 * Free up object URLs after a batch is done.
 */
export function revokeAssetUrls(assets: ResizedAsset[]): void {
  for (const a of assets) URL.revokeObjectURL(a.previewUrl);
}

/**
 * Auto-generate a feature graphic (1024x500) from an icon + brand color.
 * Useful when the user hasn't designed one yet — produces a clean,
 * non-cliched output by placing the icon on a gradient with the app name.
 */
export async function generateFeatureGraphic(
  iconSource: HTMLImageElement,
  appName: string,
  brandColor: string = "#6366f1"
): Promise<ResizedAsset> {
  const spec = getSpec("feature-graphic");
  if (!spec) throw new Error("Feature graphic spec missing");

  const canvas = document.createElement("canvas");
  canvas.width = spec.width;
  canvas.height = spec.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Gradient background.
  const gradient = ctx.createLinearGradient(0, 0, spec.width, spec.height);
  gradient.addColorStop(0, darken(brandColor, 0.3));
  gradient.addColorStop(0.5, brandColor);
  gradient.addColorStop(1, lighten(brandColor, 0.2));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, spec.width, spec.height);

  // Subtle radial highlight.
  const radial = ctx.createRadialGradient(
    spec.width * 0.7, spec.height * 0.5, 0,
    spec.width * 0.7, spec.height * 0.5, spec.width * 0.6
  );
  radial.addColorStop(0, "rgba(255,255,255,0.15)");
  radial.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, spec.width, spec.height);

  // Icon on the left, rounded corners.
  const iconSize = 280;
  const iconX = 80;
  const iconY = (spec.height - iconSize) / 2;
  const radius = 56;
  ctx.save();
  roundedRect(ctx, iconX, iconY, iconSize, iconSize, radius);
  ctx.clip();
  ctx.drawImage(iconSource, iconX, iconY, iconSize, iconSize);
  ctx.restore();

  // App name on the right.
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 2;
  ctx.fillText(appName, iconX + iconSize + 60, spec.height / 2);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });

  return {
    spec,
    blob,
    previewUrl: URL.createObjectURL(blob),
    filename: filenameFor(spec, "png"),
  };
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, Math.round(r * (1 - amount))),
    Math.max(0, Math.round(g * (1 - amount))),
    Math.max(0, Math.round(b * (1 - amount)))
  );
}

function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.round(r + (255 - r) * amount)),
    Math.min(255, Math.round(g + (255 - g) * amount)),
    Math.min(255, Math.round(b + (255 - b) * amount))
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}
