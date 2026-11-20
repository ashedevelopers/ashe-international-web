// Content sniffing from magic bytes: never trust the browser-supplied MIME type.
export function sniffMime(bytes) {
  const b = bytes;
  const ascii = (from, to) => String.fromCharCode(...b.slice(from, to));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && ascii(1, 4) === 'PNG') return 'image/png';
  if (ascii(0, 4) === 'GIF8') return 'image/gif';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(0, 4) === '%PDF') return 'application/pdf';
  if (ascii(4, 8) === 'ftyp') return ascii(8, 10) === 'qt' ? 'video/quicktime' : 'video/mp4';
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return 'video/webm';
  const head = b.slice(0, 512);
  if (head.length && !head.some((x) => x === 0 || (x < 9 && x !== 0))) return 'text/plain';
  return null;
}

export const EXT = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
  'application/pdf': 'pdf', 'text/plain': 'txt', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
};
export const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
