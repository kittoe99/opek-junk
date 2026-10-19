// Unambiguous characters (no 0/O, 1/I) so order numbers are easy to read aloud.
const ORDER_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Cryptographically random order number, e.g. OPK-7KQ2MZ4P. */
export function generateOrderNumber(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let suffix = '';
  for (const byte of bytes) suffix += ORDER_ALPHABET[byte % ORDER_ALPHABET.length];
  return `OPK-${suffix}`;
}
