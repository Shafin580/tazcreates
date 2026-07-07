"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function ApiErrorCard({
  title = "Something went wrong",
  error,
  onRetry
}: {
  title?: string;
  error: unknown;
  onRetry?: () => void;
}) {
  const { status, message } = extractError(error);

  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="size-4" />
      <AlertTitle className="flex items-center justify-between gap-2">
        <span>{title}</span>
        {status && (
          <span className="rounded bg-red-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-red-900 dark:bg-red-900 dark:text-red-100">
            HTTP {status}
          </span>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-xs leading-relaxed">
          {message || "The server did not return a specific error message."}
        </p>
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="h-7 gap-1.5">
            <RefreshCw className="size-3" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

function extractError(error: unknown): { status?: number | string; message: string } {
  if (!error) return { message: "Unknown error" };

  if (typeof error === "string") {
    return { message: error };
  }

  if (error instanceof Error) {
    const anyErr = error as Error & {
      status?: number;
      response?: { status?: number; data?: { message?: string } };
    };
    const status =
      anyErr.status ??
      anyErr.response?.status ??
      (() => {
        const m = /(\d{3})/.exec(anyErr.message || "");
        return m ? Number(m[1]) : undefined;
      })();
    const apiMessage = anyErr.response?.data?.message;
    return { status, message: apiMessage || anyErr.message || "Error" };
  }

  if (typeof error === "object") {
    const obj = error as Record<string, any>;
    return {
      status: obj.status ?? obj.status_code,
      message: obj.message ?? obj.error ?? JSON.stringify(obj).slice(0, 200)
    };
  }

  return { message: String(error) };
}
