import { toast } from "sonner";

export const ERROR_TOAST_CLASSNAME =
  "border-red-500 bg-red-100 dark:bg-red-700/30 text-red-800 dark:text-red-300";

export type ErrorToastKey =
  | "server"
  | "unexpected"
  | "validation"
  | "fetch"
  | "tryAgain"
  | "actionFailed"
  | "fileTooLarge"
  | "network"
  | "unauthorized"
  | "notFound";

export type ErrorTranslator = (key: string) => string;

export interface ShowErrorToastOverrides {
  title?: string;
  description?: string;
}

export function showErrorToast(
  t: ErrorTranslator,
  key: ErrorToastKey,
  overrides?: ShowErrorToastOverrides,
) {
  toast.error(overrides?.title ?? t(`${key}.title`), {
    description: overrides?.description ?? t(`${key}.description`),
    className: ERROR_TOAST_CLASSNAME,
  });
}
