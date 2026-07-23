/** Normalize and validate US / Canadian postal codes. */

export type PostalParse =
  | { ok: true; formatted: string; country: 'US' | 'CA' }
  | { ok: false; error: string };

const US_ZIP = /^\d{5}(-\d{4})?$/;
const CA_POSTAL = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

export function normalizePostalInput(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9\s-]/g, '').slice(0, 12);
}

export function parsePostalCode(raw: string): PostalParse {
  const trimmed = raw.trim().toUpperCase().replace(/\s+/g, ' ');

  if (!trimmed) {
    return { ok: false, error: 'Enter a ZIP or postal code.' };
  }

  const digitsOnly = trimmed.replace(/\D/g, '');
  if (/^\d+$/.test(trimmed.replace(/-/g, '')) && digitsOnly.length === 5) {
    return { ok: true, formatted: digitsOnly, country: 'US' };
  }
  if (digitsOnly.length === 9) {
    const formatted = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
    if (US_ZIP.test(formatted)) {
      return { ok: true, formatted, country: 'US' };
    }
  }
  if (US_ZIP.test(trimmed)) {
    return { ok: true, formatted: trimmed, country: 'US' };
  }

  const caCompact = trimmed.replace(/\s/g, '');
  if (caCompact.length === 6 && CA_POSTAL.test(caCompact)) {
    const formatted = `${caCompact.slice(0, 3)} ${caCompact.slice(3)}`;
    return { ok: true, formatted, country: 'CA' };
  }
  if (CA_POSTAL.test(trimmed)) {
    const parts =
      caCompact.length === 6 ? `${caCompact.slice(0, 3)} ${caCompact.slice(3)}` : trimmed;
    return { ok: true, formatted: parts, country: 'CA' };
  }

  return {
    ok: false,
    error: 'Enter a valid ZIP (12345) or postal code (A1A 1A1).',
  };
}
