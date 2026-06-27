/**
 * Resolve API paths for production. Apex domain redirects POST /api/* with a
 * non-JSON body, so payment calls must target www when on the apex host.
 */
export function apiUrl(path: string): string {
  if (typeof window === 'undefined') {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const { hostname, origin } = window.location;

  if (hostname === 'opekjunkremoval.com') {
    return `https://www.opekjunkremoval.com${normalizedPath}`;
  }

  return `${origin}${normalizedPath}`;
}
