/**
 * Sliding-window rate limiting backed by public.edge_rate_limits.
 * Requires a service-role Supabase client.
 */

// deno-lint-ignore no-explicit-any
type AdminClient = any;

export interface RateLimitRule {
  bucket: string;
  limit: number;
  windowMs: number;
}

/** Client IP from the edge proxy headers (first hop). */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for') ?? '';
  const first = forwarded.split(',')[0]?.trim();
  return first || req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || 'unknown';
}

/**
 * Returns the first rule that is exceeded, or null when all pass.
 * When every rule passes, one hit is recorded per bucket.
 */
export async function checkRateLimits(
  supabase: AdminClient,
  rules: RateLimitRule[]
): Promise<RateLimitRule | null> {
  for (const rule of rules) {
    const since = new Date(Date.now() - rule.windowMs).toISOString();
    const { count, error } = await supabase
      .from('edge_rate_limits')
      .select('id', { count: 'exact', head: true })
      .eq('bucket', rule.bucket)
      .gte('created_at', since);

    if (error) throw error;
    if ((count ?? 0) >= rule.limit) return rule;
  }

  const { error } = await supabase
    .from('edge_rate_limits')
    .insert(rules.map((rule) => ({ bucket: rule.bucket })));
  if (error) throw error;

  return null;
}
