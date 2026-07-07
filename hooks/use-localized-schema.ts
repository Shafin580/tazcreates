"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { z } from "zod";

export type ValidationTranslator = (
  key: string,
  values?: Record<string, string | number>
) => string;

/**
 * Build a Zod schema with translated error messages.
 *
 * Usage:
 *   const schema = useLocalizedSchema((t) => z.object({
 *     name: z.string().min(1, t("required"))
 *   }));
 *
 * The translator is bound to the "Validation" namespace from
 * the Validation namespace in messages/<locale>.json — pass plain leaf keys
 * ("required", "minLength", etc.).
 */
export function useLocalizedSchema<TSchema extends z.ZodTypeAny>(
  factory: (t: ValidationTranslator) => TSchema
): TSchema {
  const tValidation = useTranslations("Validation");
  return useMemo(
    () =>
      factory((key, values) =>
        tValidation(
          key as Parameters<typeof tValidation>[0],
          values as never
        )
      ),
    [factory, tValidation]
  );
}

/**
 * Global Zod error map producing translated default messages for unspecified
 * constraints (invalid_type, too_small, too_big, invalid_string variants).
 *
 * Usage at app boot (root layout / providers):
 *   z.setErrorMap(makeZodErrorMap(t));
 *
 * `t` should be the "Validation" namespace translator.
 */
export function makeZodErrorMap(t: ValidationTranslator): z.ZodErrorMap {
  return (issue, ctx) => {
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.received === "undefined" || issue.received === "null") {
          return { message: t("required") };
        }
        return { message: ctx.defaultError };
      case z.ZodIssueCode.too_small: {
        const minimum = Number(issue.minimum);
        if (issue.type === "string") {
          return minimum === 1
            ? { message: t("required") }
            : { message: t("minLength", { min: minimum }) };
        }
        if (issue.type === "number") {
          return { message: t("number.min", { min: minimum }) };
        }
        return { message: ctx.defaultError };
      }
      case z.ZodIssueCode.too_big: {
        const maximum = Number(issue.maximum);
        if (issue.type === "string") {
          return { message: t("maxLength", { max: maximum }) };
        }
        if (issue.type === "number") {
          return { message: t("number.max", { max: maximum }) };
        }
        return { message: ctx.defaultError };
      }
      case z.ZodIssueCode.invalid_string: {
        if (issue.validation === "email") return { message: t("email") };
        if (issue.validation === "url") return { message: t("url") };
        return { message: ctx.defaultError };
      }
      default:
        return { message: ctx.defaultError };
    }
  };
}

/**
 * Convenience: install the global error map by calling once inside a client
 * component that has access to `useTranslations("Validation")`. Runs as a side
 * effect during render, idempotent across re-renders.
 */
export function useInstallZodErrorMap(): void {
  const tValidation = useTranslations("Validation");
  useMemo(() => {
    z.setErrorMap(
      makeZodErrorMap((key, values) =>
        tValidation(
          key as Parameters<typeof tValidation>[0],
          values as never
        )
      )
    );
  }, [tValidation]);
}
