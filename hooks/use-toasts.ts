"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  showErrorToast,
  type ErrorToastKey,
  type ShowErrorToastOverrides
} from "@/lib/show-error-toast";
import {
  showSuccessToast,
  SUCCESS_TOAST_CLASSNAME,
  type ShowSuccessToastOverrides,
  type SuccessToastKey
} from "@/lib/show-success-toast";

export type LoadingToastKey = "saving" | "deleting" | "uploading";

type ToastValues = Record<string, string | number> | undefined;

export interface UseToastsApi {
  success: (
    key: SuccessToastKey,
    values?: ToastValues,
    overrides?: ShowSuccessToastOverrides
  ) => void;
  error: (key: ErrorToastKey, overrides?: ShowErrorToastOverrides) => void;
  errorByCode: (code: number | string, overrides?: ShowErrorToastOverrides) => void;
  loading: (key: LoadingToastKey, values?: ToastValues) => string | number;
  copy: () => void;
  raw: typeof toast;
}

export function useToasts(): UseToastsApi {
  const tToasts = useTranslations("Toasts");
  const tErrors = useTranslations("Errors");

  const success = useCallback<UseToastsApi["success"]>(
    (key, values, overrides) => {
      showSuccessToast(
        (k, v) => tToasts(k as Parameters<typeof tToasts>[0], v as never),
        key,
        values,
        overrides
      );
    },
    [tToasts]
  );

  const error = useCallback<UseToastsApi["error"]>(
    (key, overrides) => {
      showErrorToast(
        (k) => tErrors(k as Parameters<typeof tErrors>[0]),
        key,
        overrides
      );
    },
    [tErrors]
  );

  const errorByCode = useCallback<UseToastsApi["errorByCode"]>(
    (code, overrides) => {
      const codeKey = `byCode.${code}` as Parameters<typeof tErrors>[0];
      let description: string;
      try {
        description = tErrors(codeKey);
      } catch {
        description = tErrors("unexpected.description" as Parameters<typeof tErrors>[0]);
      }
      toast.error(overrides?.title ?? tErrors("unexpected.title" as Parameters<typeof tErrors>[0]), {
        description: overrides?.description ?? description
      });
    },
    [tErrors]
  );

  const loading = useCallback<UseToastsApi["loading"]>(
    (key, values) =>
      toast.loading(
        tToasts(`loading.${key}` as Parameters<typeof tToasts>[0], values as never)
      ),
    [tToasts]
  );

  const copy = useCallback(() => {
    toast.success(tToasts("success.copy" as Parameters<typeof tToasts>[0]), {
      className: SUCCESS_TOAST_CLASSNAME
    });
  }, [tToasts]);

  return useMemo<UseToastsApi>(
    () => ({ success, error, errorByCode, loading, copy, raw: toast }),
    [success, error, errorByCode, loading, copy]
  );
}
