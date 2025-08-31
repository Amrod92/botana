export const TIKTOK_URL_REGEX = /^https?:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
export const TIKTOK_SHORT_URL_REGEX = /^https?:\/\/vm\.tiktok\.com\/([A-Za-z0-9]+)/;
export const TIKTOK_SHORT_URL_ROOT_REGEX = /^https?:\/\/(?:www\.)?tiktok\.com\/([A-Za-z0-9]{7,})\/?$/;

export function extractVideoId(url: string): string | null {
  // Full canonical TikTok URL with numeric ID
  const match = url.match(TIKTOK_URL_REGEX);
  if (match) return match[1];

  // Short vm.tiktok.com URL. Use the short code as a stable surrogate ID.
  const short = url.match(TIKTOK_SHORT_URL_REGEX);
  if (short) return `vm:${short[1]}`;

  // Short root tiktok.com/<code> URL.
  const shortRoot = url.match(TIKTOK_SHORT_URL_ROOT_REGEX);
  if (shortRoot) return `short:${shortRoot[1]}`;

  return null;
}

export function isValidTiktokUrl(url: string): boolean {
  return (
    TIKTOK_URL_REGEX.test(url) ||
    TIKTOK_SHORT_URL_REGEX.test(url) ||
    TIKTOK_SHORT_URL_ROOT_REGEX.test(url)
  );
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
