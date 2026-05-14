import { verifyLicense, type License, type SignedLicense } from "@/lib/pro/tiers";

export async function getVerifiedLicenseFromRequest(req: Request): Promise<License | null> {
  const header = req.headers.get("authorization") ?? "";
  const encoded = header.match(/^License\s+(.+)$/i)?.[1];
  if (!encoded) return null;

  const secret = process.env.LICENSE_SIGNING_SECRET;
  if (!secret) return null;

  try {
    const signed = JSON.parse(atob(encoded)) as SignedLicense;
    return await verifyLicense(signed, secret);
  } catch {
    return null;
  }
}

export function encodeLicenseForHeader(value: unknown): string {
  return btoa(JSON.stringify(value));
}
