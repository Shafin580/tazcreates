"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
  onlineManager
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { isAPIError, isNoDataError } from "@/types/api-error";

const OFFLINE_TOAST_ID = "network-status-offline";

export function TanStackQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 /** milliseconds */ * 60 /** seconds */ * 10 /** minutes */,
            retry: (failureCount, error: unknown) => {
              // Don't retry on validation / bad-request errors — retries
              // can't fix malformed input. 500s are retried once (the
              // cache's onError surfaces a Retry button on the final 500).
              if (isAPIError(error) && (error.status_code === 422 || error.status_code === 400)) {
                return false;
              }
              return failureCount < 2;
            }
          },
          mutations: {
            retry: false
          }
        },
        queryCache: new QueryCache({
          onError: (error: unknown, query) => {
            console.error("Query error:", error);

            // Suppress toast for "no records" / "no data" empty-state responses —
            // these aren't failures, the table will just render its empty state.
            if (isNoDataError(error)) return;

            // Type guard to check if it's an API error
            if (!isAPIError(error)) return;

            // Handle specific status codes
            if (error.status_code === 422) {
              toast.error("Validation Error", {
                description: error.message || "Invalid data provided. Please check your input."
              });
            } else if (error.status_code === 400) {
              toast.error("Bad Request", {
                description:
                  error.message || "The request could not be processed. Please try again."
              });
            } else if (error.status_code === 500) {
              // Stable id per query so a second 500 replaces the toast in
              // place rather than stacking.
              const toastId = `query-error:${JSON.stringify(query.queryKey)}`;
              toast.error("Server Error", {
                id: toastId,
                description:
                  error.message || "An internal server error occurred. Please try again later.",
                duration: 10_000,
                action: {
                  label: "Retry",
                  onClick: () => {
                    toast.dismiss(toastId);
                    void query.fetch();
                  }
                }
              });
            } else {
              // Generic error for other status codes
              toast.error("Error", {
                description: error.message || "An error occurred. Please try again."
              });
            }
          }
        }),
        mutationCache: new MutationCache({
          onError: (error: unknown) => {
            console.error("Mutation error:", error);

            // Suppress toast for "no data" empty-state responses
            if (isNoDataError(error)) return;

            // Type guard to check if it's an API error
            if (!isAPIError(error)) return;

            // Handle specific status codes
            if (error.status_code === 422) {
              toast.error("Validation Error", {
                description: error.message || "Invalid data provided. Please check your input."
              });
            } else if (error.status_code === 400) {
              toast.error("Bad Request", {
                description:
                  error.message || "The request could not be processed. Please try again."
              });
            } else if (error.status_code === 500) {
              toast.error("Server Error", {
                description:
                  error.message || "An internal server error occurred. Please try again later."
              });
            } else {
              // Generic error for other status codes
              toast.error("Error", {
                description: error.message || "An error occurred. Please try again."
              });
            }
          }
        })
      })
  );

  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const showOfflineToast = () => {
      wasOfflineRef.current = true;
      toast.error("No internet connection", {
        id: OFFLINE_TOAST_ID,
        description: "Your changes will be sent once you're back online.",
        duration: Infinity
      });
    };

    if (!onlineManager.isOnline()) {
      showOfflineToast();
    }

    return onlineManager.subscribe((isOnline) => {
      if (!isOnline) {
        showOfflineToast();
        return;
      }
      if (wasOfflineRef.current) {
        wasOfflineRef.current = false;
        toast.dismiss(OFFLINE_TOAST_ID);
        toast.success("Back online", { duration: 2000 });
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== "production" ? (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  );
}
