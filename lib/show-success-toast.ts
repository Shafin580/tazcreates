import { toast } from "sonner";

export const SUCCESS_TOAST_CLASSNAME =
  "border-emerald-500 bg-emerald-100 dark:bg-emerald-700/30 text-emerald-800 dark:text-emerald-300";

export type SuccessToastKey =
  | "create"
  | "update"
  | "delete"
  | "save"
  | "upload"
  | "send"
  | "copy";

export type SuccessTranslator = (key: string, values?: Record<string, string | number>) => string;

export interface ShowSuccessToastOverrides {
  title?: string;
  description?: string;
}

export function showSuccessToast(
  t: SuccessTranslator,
  key: SuccessToastKey,
  values?: Record<string, string | number>,
  overrides?: ShowSuccessToastOverrides
) {
  const title = overrides?.title ?? t(`success.${key}`, values);
  toast.success(title, {
    description: overrides?.description,
    className: SUCCESS_TOAST_CLASSNAME
  });
}
