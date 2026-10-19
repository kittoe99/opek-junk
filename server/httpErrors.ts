/** An error whose message is safe to show to the caller (bad input, not an internal failure). */
export class ClientError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'ClientError';
    this.status = status;
  }
}

/**
 * Maps a caught error to a response: ClientError messages pass through,
 * anything else is logged by the caller and replaced with `fallback`.
 */
export function toErrorResponse(error: unknown, fallback: string): { status: number; message: string } {
  if (error instanceof ClientError) {
    return { status: error.status, message: error.message };
  }
  if (error instanceof SyntaxError) {
    return { status: 400, message: 'Invalid JSON body.' };
  }
  return { status: 500, message: fallback };
}
