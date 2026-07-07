// API Error Response Type
export interface APIError {
  status_code: number;
  message?: string;
  results?: any;
}

// Type guard to check if error is an APIError
export function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status_code" in error &&
    typeof (error as any).status_code === "number"
  );
}

// Detects backend "no data found" responses that should NOT surface as toast errors.
// Backend sometimes returns 404/500 with messages like "No records to show",
// "No data found", "Record not found" — these are empty-state cases, not failures.
export function isNoDataError(error: unknown): boolean {
  if (!error) return false;
  let message = "";
  if (isAPIError(error)) {
    message = error.message ?? "";
  } else if (error instanceof Error) {
    message = error.message ?? "";
  } else if (typeof error === "string") {
    message = error;
  }
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("no record") ||
    lower.includes("no data") ||
    lower.includes("not found") ||
    lower.includes("no result")
  );
}

// Custom error class for API fetch errors
export class APIFetchError extends Error {
  public readonly timestamp: string;

  constructor(
    message: string,
    public readonly context: Record<string, any>,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "APIFetchError";
    this.timestamp = new Date().toISOString();

    // Preserve original error as cause if available
    if (originalError instanceof Error) {
      this.cause = originalError;
    }
  }
}
