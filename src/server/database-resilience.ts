const TRANSIENT_DATABASE_CODES = new Set(["P1001", "P1002", "P1017"]);
const TRANSIENT_DATABASE_MESSAGE =
  /can't reach database server|connection (?:closed|refused|timed out)|ECONNREFUSED|ETIMEDOUT/i;

function errorDetails(error: unknown) {
  if (!error || typeof error !== "object") return { code: "", message: "", cause: undefined };

  return {
    code: "code" in error && typeof error.code === "string" ? error.code : "",
    message: "message" in error && typeof error.message === "string" ? error.message : "",
    cause: "cause" in error ? error.cause : undefined,
  };
}

export function isDatabaseUnavailable(error: unknown): boolean {
  const { code, message, cause } = errorDetails(error);
  return (
    TRANSIENT_DATABASE_CODES.has(code) ||
    TRANSIENT_DATABASE_MESSAGE.test(message) ||
    (cause !== undefined && isDatabaseUnavailable(cause))
  );
}

function pause(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function withDatabaseRetry<T>(operation: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;

  // Retry only known connection failures. Validation and query errors must surface immediately.
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isDatabaseUnavailable(error) || attempt === attempts - 1) throw error;
      await pause(200 * 2 ** attempt); // Short exponential backoff keeps request latency bounded.
    }
  }

  throw lastError;
}
