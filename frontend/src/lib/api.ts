export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export async function getJson<T>(
  path: string,
  decode: (value: unknown) => T,
  signal?: AbortSignal,
): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\"))
    throw new ApiError("Invalid API path.");
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  if (signal?.aborted) cancel();
  const timer = setTimeout(cancel, 10_000);
  try {
    const response = await fetch(`/api${path}`, {
      signal: controller.signal,
      credentials: "omit",
      headers: { Accept: "application/json" },
    });
    const rawId = response.headers.get("X-Request-ID");
    const requestId =
      rawId && /^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(rawId)
        ? rawId
        : undefined;
    if (!response.ok)
      throw new ApiError(
        "The service is unavailable. Please try again.",
        response.status,
        requestId,
      );
    try {
      return decode(await response.json());
    } catch (error) {
      if (controller.signal.aborted) throw error;
      throw new ApiError(
        "The service returned an unexpected response.",
        response.status,
        requestId,
      );
    }
  } catch (error) {
    if (signal?.aborted)
      throw new DOMException("Request cancelled", "AbortError");
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      controller.signal.aborted
        ? "The request took too long. Please try again."
        : "Could not reach the service. Please try again.",
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
  }
}
