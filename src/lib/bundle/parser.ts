/**
 * AAB and APK metadata parser.
 *
 * Both .aab and .apk are ZIP archives. The data we care about lives in the
 * binary AndroidManifest.xml inside. This module:
 *
 *   1. Unzips the bundle.
 *   2. Reads the (binary) AndroidManifest.xml.
 *   3. Parses the Android binary XML format to extract:
 *        - package name
 *        - versionName, versionCode
 *        - minSdkVersion, targetSdkVersion
 *        - declared permissions
 *
 * Why not call bundletool? Bundletool is a Java JAR. Cloudflare Workers can't
 * exec subprocesses, so we'd need a separate Node companion service. This
 * parser runs in any environment, including the browser via File API.
 *
 * What it does NOT do (yet): signing config inspection, asset listing,
 * code transparency verification. Those need bundletool or aapt2.
 */

import { unzipSync } from "fflate";

export interface BundleMetadata {
  format: "aab" | "apk";
  packageName: string;
  versionName: string;
  versionCode: number;
  minSdkVersion: number;
  targetSdkVersion: number;
  compileSdkVersion?: number;
  permissions: string[];
  /** Raw bytes of the manifest, for debugging. */
  rawManifestSize: number;
}

const RES_STRING_POOL_TYPE = 0x0001;
const RES_XML_TYPE = 0x0003;
const RES_XML_RESOURCE_MAP_TYPE = 0x0180;
const RES_XML_START_NAMESPACE_TYPE = 0x0100;
const RES_XML_END_NAMESPACE_TYPE = 0x0101;
const RES_XML_START_ELEMENT_TYPE = 0x0102;
const RES_XML_END_ELEMENT_TYPE = 0x0103;
const RES_XML_CDATA_TYPE = 0x0104;

const ATTR_TYPE_REFERENCE = 0x01;
const ATTR_TYPE_STRING = 0x03;
const ATTR_TYPE_INT_DEC = 0x10;
const ATTR_TYPE_INT_HEX = 0x11;
const ATTR_TYPE_INT_BOOLEAN = 0x12;

/**
 * Parse an AAB or APK file from raw bytes.
 */
export async function parseBundle(bytes: Uint8Array): Promise<BundleMetadata> {
  const format = detectFormat(bytes);
  const files = unzipSync(bytes);

  const manifestPath =
    format === "aab" ? "base/manifest/AndroidManifest.xml" : "AndroidManifest.xml";
  const manifest = files[manifestPath];
  if (!manifest) {
    throw new Error(`Could not find ${manifestPath} in bundle`);
  }

  const parsed = parseBinaryXml(manifest);
  const meta = extractMetadata(parsed);

  return {
    format,
    ...meta,
    rawManifestSize: manifest.length,
  };
}

function detectFormat(bytes: Uint8Array): "aab" | "apk" {
  // Both are ZIPs (start with 0x504B0304 or 0x504B0506).
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    throw new Error("File is not a valid ZIP archive (not an AAB or APK).");
  }
  // Distinguish by checking for the AAB-only "BundleConfig.pb" entry without
  // unzipping everything — naive but cheap heuristic: AABs always start with
  // BundleConfig.pb early in the central directory. For correctness, we just
  // try AAB layout first, then APK. If the wrong path is missing, the caller
  // gets a clear error. For now, default to AAB if the filename hint is .aab,
  // else inspect a few bytes.
  // (The caller can override based on filename extension.)
  const text = new TextDecoder().decode(bytes.subarray(0, Math.min(bytes.length, 8192)));
  if (text.includes("BundleConfig")) return "aab";
  return "apk";
}

// ---------------------------------------------------------------------
//  Binary XML parser
// ---------------------------------------------------------------------
interface ParsedAttr {
  namespace: string;
  name: string;
  rawValue: string | number | boolean;
}
interface ParsedElement {
  tag: string;
  attrs: ParsedAttr[];
  children: ParsedElement[];
}

function parseBinaryXml(data: Uint8Array): ParsedElement {
  const buf = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let pos = 0;

  function readU16(): number { const v = buf.getUint16(pos, true); pos += 2; return v; }
  function readU32(): number { const v = buf.getUint32(pos, true); pos += 4; return v; }
  function readS32(): number { const v = buf.getInt32(pos, true); pos += 4; return v; }

  // Root chunk: must be RES_XML_TYPE
  const rootType = readU16();
  readU16(); // headerSize
  readU32(); // chunkSize
  if (rootType !== RES_XML_TYPE) {
    throw new Error(`Expected RES_XML_TYPE at start of manifest, got ${rootType.toString(16)}`);
  }

  let stringPool: string[] = [];
  const elementStack: ParsedElement[] = [];
  const root: ParsedElement = { tag: "__root__", attrs: [], children: [] };
  elementStack.push(root);

  while (pos < data.byteLength) {
    const chunkStart = pos;
    const type = readU16();
    const headerSize = readU16();
    const chunkSize = readU32();
    const nextChunk = chunkStart + chunkSize;

    switch (type) {
      case RES_STRING_POOL_TYPE: {
        const stringCount = readU32();
        readU32(); // styleCount
        const flags = readU32();
        const stringsStart = readU32();
        readU32(); // stylesStart
        const isUtf8 = (flags & (1 << 8)) !== 0;
        const offsets: number[] = [];
        for (let i = 0; i < stringCount; i++) offsets.push(readU32());
        stringPool = readStringPool(
          new Uint8Array(data.buffer, data.byteOffset + chunkStart + stringsStart, chunkSize - stringsStart),
          offsets,
          isUtf8
        );
        pos = nextChunk;
        break;
      }
      case RES_XML_RESOURCE_MAP_TYPE: {
        pos = nextChunk;
        break;
      }
      case RES_XML_START_NAMESPACE_TYPE: {
        readU32(); readU32(); readU32(); readU32(); // lineNumber, comment, prefix, uri
        pos = nextChunk;
        break;
      }
      case RES_XML_END_NAMESPACE_TYPE: {
        pos = nextChunk;
        break;
      }
      case RES_XML_START_ELEMENT_TYPE: {
        readU32(); // lineNumber
        readS32(); // comment
        const nsIdx = readS32();
        const nameIdx = readS32();
        readU16(); // attrStart
        readU16(); // attrSize
        const attrCount = readU16();
        readU16(); // idIndex
        readU16(); // classIndex
        readU16(); // styleIndex
        const attrs: ParsedAttr[] = [];
        for (let i = 0; i < attrCount; i++) {
          const attrNsIdx = readS32();
          const attrNameIdx = readS32();
          const attrRawValueIdx = readS32();
          readU16(); // size
          readU16(); // typedValue.res0+dataType packed; we re-read below
          const valType = data[pos - 1]; // dataType byte
          // back up: above readU16 consumed res0+dataType, so we have valType
          const valData = readU32();
          const namespace = attrNsIdx >= 0 ? stringPool[attrNsIdx] ?? "" : "";
          const name = stringPool[attrNameIdx] ?? "";
          let rawValue: string | number | boolean;
          if (valType === ATTR_TYPE_STRING) {
            rawValue = stringPool[valData] ?? (attrRawValueIdx >= 0 ? stringPool[attrRawValueIdx] : "");
          } else if (valType === ATTR_TYPE_INT_DEC || valType === ATTR_TYPE_INT_HEX || valType === ATTR_TYPE_REFERENCE) {
            rawValue = valData;
          } else if (valType === ATTR_TYPE_INT_BOOLEAN) {
            rawValue = valData !== 0;
          } else {
            rawValue = attrRawValueIdx >= 0 ? stringPool[attrRawValueIdx] ?? "" : String(valData);
          }
          attrs.push({ namespace, name, rawValue });
        }
        const el: ParsedElement = { tag: stringPool[nameIdx] ?? "", attrs, children: [] };
        elementStack[elementStack.length - 1].children.push(el);
        elementStack.push(el);
        pos = nextChunk;
        break;
      }
      case RES_XML_END_ELEMENT_TYPE: {
        elementStack.pop();
        pos = nextChunk;
        break;
      }
      case RES_XML_CDATA_TYPE: {
        pos = nextChunk;
        break;
      }
      default: {
        // Unknown chunk — skip.
        pos = nextChunk;
        break;
      }
    }
    // Safety: avoid infinite loop on malformed data.
    if (pos <= chunkStart) break;
  }

  return root;
}

function readStringPool(data: Uint8Array, offsets: number[], isUtf8: boolean): string[] {
  const out: string[] = [];
  for (const off of offsets) {
    if (isUtf8) {
      let p = off;
      // Skip a U16 length (sometimes there are two — one for u16 chars, one for utf-8 bytes).
      // The Android binary XML format uses two leading bytes for char count, two for byte count
      // (each can be one or two bytes depending on the high bit). Simpler approach:
      // skip first u8 (char count), skip second u8 (byte count), then read until NUL.
      let charCount = data[p++];
      if ((charCount & 0x80) !== 0) { charCount = ((charCount & 0x7f) << 8) | data[p++]; }
      let byteCount = data[p++];
      if ((byteCount & 0x80) !== 0) { byteCount = ((byteCount & 0x7f) << 8) | data[p++]; }
      out.push(new TextDecoder("utf-8").decode(data.subarray(p, p + byteCount)));
    } else {
      let p = off;
      let charCount = data[p++] | (data[p++] << 8);
      if ((charCount & 0x8000) !== 0) {
        charCount = ((charCount & 0x7fff) << 16) | (data[p++] | (data[p++] << 8));
      }
      const u16: number[] = [];
      for (let i = 0; i < charCount; i++) {
        u16.push(data[p++] | (data[p++] << 8));
      }
      out.push(String.fromCharCode(...u16));
    }
  }
  return out;
}

// ---------------------------------------------------------------------
//  Pull the fields we care about out of the parsed XML
// ---------------------------------------------------------------------
function extractMetadata(root: ParsedElement): Omit<BundleMetadata, "format" | "rawManifestSize"> {
  // Find the <manifest> element under the synthetic root.
  const manifest = root.children.find((c) => c.tag === "manifest");
  if (!manifest) throw new Error("No <manifest> element in manifest XML");

  const getAttr = (el: ParsedElement, name: string): ParsedAttr | undefined =>
    el.attrs.find((a) => a.name === name);

  const packageName = String(getAttr(manifest, "package")?.rawValue ?? "");
  const versionName = String(getAttr(manifest, "versionName")?.rawValue ?? "");
  const versionCode = Number(getAttr(manifest, "versionCode")?.rawValue ?? 0);
  const compileSdk = Number(getAttr(manifest, "compileSdkVersion")?.rawValue ?? 0) || undefined;

  let minSdk = 0;
  let targetSdk = 0;
  const usesSdk = manifest.children.find((c) => c.tag === "uses-sdk");
  if (usesSdk) {
    minSdk = Number(getAttr(usesSdk, "minSdkVersion")?.rawValue ?? 0);
    targetSdk = Number(getAttr(usesSdk, "targetSdkVersion")?.rawValue ?? 0);
  }

  const permissions: string[] = [];
  for (const child of manifest.children) {
    if (child.tag === "uses-permission") {
      const nameAttr = getAttr(child, "name");
      if (nameAttr && typeof nameAttr.rawValue === "string") {
        permissions.push(nameAttr.rawValue);
      }
    }
  }

  return {
    packageName,
    versionName,
    versionCode,
    minSdkVersion: minSdk,
    targetSdkVersion: targetSdk,
    compileSdkVersion: compileSdk,
    permissions,
  };
}
