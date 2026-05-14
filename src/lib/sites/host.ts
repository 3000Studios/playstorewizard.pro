const ROOT_HOSTS = new Set(["playstorewizard.pro", "www.playstorewizard.pro", "localhost", "127.0.0.1"]);

export function subdomainFromHost(host: string | null): string | null {
  const clean = (host ?? "").split(":")[0].toLowerCase();
  if (!clean.endsWith(".playstorewizard.pro") || ROOT_HOSTS.has(clean)) return null;
  const slug = clean.replace(".playstorewizard.pro", "");
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(slug) ? slug : null;
}
