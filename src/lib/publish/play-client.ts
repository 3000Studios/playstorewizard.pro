/**
 * Google Play Developer API v3 client.
 *
 * The full publish sequence:
 *   1. Authenticate with a service-account JSON key (no user OAuth flow).
 *   2. POST /edits -> create an edit transaction.
 *   3. POST /edits/{id}/bundles -> upload the AAB.
 *   4. PATCH /edits/{id}/listings/{lang} -> set title/short/full description.
 *   5. PATCH /edits/{id}/tracks/{track} -> assign release to a track.
 *   6. POST /edits/{id}:commit -> publish.
 *
 * Auth uses JWT signed with the service-account private key, exchanged for
 * an access token at oauth2.googleapis.com/token. No paid auth library needed.
 *
 * Requires Node.js runtime (uses crypto + fetch). Cloudflare Workers compatible
 * via the Web Crypto API path below.
 *
 * Service account setup (one-time, free):
 *   1. https://console.cloud.google.com -> create or pick a project
 *   2. Enable the Google Play Android Developer API
 *   3. Create a service account, generate a JSON key
 *   4. https://play.google.com/console -> Setup -> API access ->
 *      link the GCP project, invite the service account, grant Admin role
 *      (or scoped: Release manager + Edit store listings)
 */

const PLAY_API_BASE = "https://androidpublisher.googleapis.com/androidpublisher/v3";
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/androidpublisher";

export interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

export interface PlayClientOptions {
  serviceAccount: ServiceAccountKey;
  /** App package name, e.g. "com.yourcompany.yourapp" */
  packageName: string;
}

export interface PlayListing {
  language: string; // BCP-47, e.g. "en-US"
  title: string;
  shortDescription: string;
  fullDescription: string;
  video?: string;
}

export interface PlayTrackRelease {
  name?: string; // release name
  versionCodes: string[];
  status: "draft" | "inProgress" | "halted" | "completed";
  userFraction?: number; // 0..1 for staged rollouts
  releaseNotes?: { language: string; text: string }[];
}

export interface PublishInput {
  bundleFile: ArrayBuffer; // raw AAB bytes
  listings: PlayListing[];
  track: "internal" | "alpha" | "beta" | "production";
  release: Omit<PlayTrackRelease, "versionCodes">; // versionCodes filled after upload
}

export interface PublishResult {
  editId: string;
  versionCode: number;
  uploadedAt: string;
  /** True iff commit succeeded. */
  committed: boolean;
}

// ---------------------------------------------------------------------
//  Token cache
// ---------------------------------------------------------------------
interface CachedToken {
  token: string;
  expiresAt: number;
}
const tokenCache = new Map<string, CachedToken>();

// ---------------------------------------------------------------------
//  JWT signing — Web Crypto so it works in Cloudflare Workers AND Node
// ---------------------------------------------------------------------
async function signJwt(sa: ServiceAccountKey): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: sa.client_email,
    scope: SCOPE,
    aud: sa.token_uri ?? OAUTH_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj: object): string =>
    base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)));

  const unsigned = `${encode(header)}.${encode(claims)}`;

  const pkBytes = pemToArrayBuffer(sa.private_key);
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pkBytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const sigB64 = base64UrlEncode(new Uint8Array(sig));
  return `${unsigned}.${sigB64}`;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return buf;
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.byteLength; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ---------------------------------------------------------------------
//  Get access token
// ---------------------------------------------------------------------
async function getAccessToken(sa: ServiceAccountKey): Promise<string> {
  const cacheKey = sa.client_email;
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  const jwt = await signJwt(sa);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });

  const res = await fetch(sa.token_uri ?? OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    throw new Error(`OAuth token exchange failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache.set(cacheKey, {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  });
  return json.access_token;
}

// ---------------------------------------------------------------------
//  Edit transaction helpers
// ---------------------------------------------------------------------
async function api(
  token: string,
  path: string,
  init: RequestInit = {}
): Promise<unknown> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && !(init.body instanceof ArrayBuffer)) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${PLAY_API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    throw new Error(`Play API ${res.status} on ${path}: ${await res.text()}`);
  }
  const ct = res.headers.get("Content-Type") ?? "";
  return ct.includes("json") ? res.json() : res.text();
}

// ---------------------------------------------------------------------
//  Client
// ---------------------------------------------------------------------
export class PlayClient {
  constructor(private opts: PlayClientOptions) {}

  async createEdit(): Promise<string> {
    const token = await getAccessToken(this.opts.serviceAccount);
    const result = (await api(token, `/applications/${this.opts.packageName}/edits`, {
      method: "POST",
    })) as { id: string };
    return result.id;
  }

  async uploadBundle(editId: string, bundle: ArrayBuffer): Promise<number> {
    const token = await getAccessToken(this.opts.serviceAccount);
    const url = `https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${this.opts.packageName}/edits/${editId}/bundles?uploadType=media`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/octet-stream",
      },
      body: bundle,
    });
    if (!res.ok) {
      throw new Error(`Bundle upload failed: ${res.status} ${await res.text()}`);
    }
    const json = (await res.json()) as { versionCode: number };
    return json.versionCode;
  }

  async setListing(editId: string, listing: PlayListing): Promise<void> {
    const token = await getAccessToken(this.opts.serviceAccount);
    await api(
      token,
      `/applications/${this.opts.packageName}/edits/${editId}/listings/${listing.language}`,
      {
        method: "PUT",
        body: JSON.stringify({
          language: listing.language,
          title: listing.title,
          shortDescription: listing.shortDescription,
          fullDescription: listing.fullDescription,
          video: listing.video,
        }),
      }
    );
  }

  async setTrack(editId: string, track: string, release: PlayTrackRelease): Promise<void> {
    const token = await getAccessToken(this.opts.serviceAccount);
    await api(
      token,
      `/applications/${this.opts.packageName}/edits/${editId}/tracks/${track}`,
      {
        method: "PUT",
        body: JSON.stringify({
          track,
          releases: [release],
        }),
      }
    );
  }

  async commit(editId: string): Promise<void> {
    const token = await getAccessToken(this.opts.serviceAccount);
    await api(token, `/applications/${this.opts.packageName}/edits/${editId}:commit`, {
      method: "POST",
    });
  }

  /**
   * Full publish: upload + listings + track + commit, all in one call.
   * If any step fails, the edit is left uncommitted and can be resumed manually.
   */
  async publish(input: PublishInput): Promise<PublishResult> {
    const editId = await this.createEdit();
    const versionCode = await this.uploadBundle(editId, input.bundleFile);

    for (const listing of input.listings) {
      await this.setListing(editId, listing);
    }

    await this.setTrack(editId, input.track, {
      ...input.release,
      versionCodes: [String(versionCode)],
    });

    await this.commit(editId);

    return {
      editId,
      versionCode,
      uploadedAt: new Date().toISOString(),
      committed: true,
    };
  }

  // ----- Read endpoints used by the dashboard -----
  async getReviews(maxResults: number = 50): Promise<unknown> {
    const token = await getAccessToken(this.opts.serviceAccount);
    return api(
      token,
      `/applications/${this.opts.packageName}/reviews?maxResults=${maxResults}`
    );
  }

  async getTracks(editId: string): Promise<unknown> {
    const token = await getAccessToken(this.opts.serviceAccount);
    return api(token, `/applications/${this.opts.packageName}/edits/${editId}/tracks`);
  }
}
