export const TIKTOK_URL_REGEX = /^https?:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/(\d+)/;

export function extractVideoId(url: string): string | null {
  const match = url.match(TIKTOK_URL_REGEX);
  return match ? match[1] : null;
}

export function isValidTiktokUrl(url: string): boolean {
  return TIKTOK_URL_REGEX.test(url);
}

export function toOEmbedUrl(url: string): string {
  return `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
}

export function extractUsername(url: string): string | null {
  // Matches https://www.tiktok.com/@username/video/123...
  const m = url.match(/^https?:\/\/www\.tiktok\.com\/@([\w.-]+)\/video\//);
  return m ? `@${m[1]}` : null;
}

export function formatTiktokLabel(url: string): string {
  const user = extractUsername(url);
  const id = extractVideoId(url);
  if (user && id) return `${user} · ${id}`;
  if (id) return `Video ${id}`;
  if (user) return `${user}`;
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname}`;
  } catch {
    return url;
  }
}
