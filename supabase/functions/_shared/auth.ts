/**
 * Shared auth helpers for edge functions.
 * Rejects public anon key calls; allows service_role JWT or an internal secret.
 */

export function decodeJwtRole(token: string): string | null {
  try {
    const [, payload] = token.split('.');
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    return typeof decoded.role === 'string' ? decoded.role : null;
  } catch {
    return null;
  }
}

export interface EdgeAuthOptions {
  /** Allow service_role JWT from triggers/RPCs. Default true. */
  allowServiceRole?: boolean;
  /** Accept this shared secret as Authorization: Bearer <secret>. */
  secretEnvVar?: string;
}

/** Returns true when the request is from service_role or a valid internal secret. */
export function isInternalRequest(req: Request, options: EdgeAuthOptions = {}): boolean {
  const auth = req.headers.get('Authorization') ?? req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  const token = auth.slice('Bearer '.length).trim();

  const role = decodeJwtRole(token);
  if (options.allowServiceRole !== false && role === 'service_role') return true;

  if (options.secretEnvVar) {
    const expected = Deno.env.get(options.secretEnvVar);
    if (expected && token === expected) return true;
  }

  return false;
}
