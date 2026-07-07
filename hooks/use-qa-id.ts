"use client";

import * as React from "react";

/**
 * Generates a stable, unique HTML `id` paired with a `data-qa` hook for any
 * interactive element outside of a `<Form>` context.
 *
 * Inside `<Form>` (react-hook-form), continue using `FormItem` + `FormControl`
 * which already generate ids via `React.useId()`. Use this helper only for
 * standalone inputs, modals, or buttons.
 *
 * @example
 * ```tsx
 * const phone = useQaId("main.contact-form.phone");
 * return (
 *   <>
 *     <Label htmlFor={phone.id}>Phone</Label>
 *     <Input {...phone} />
 *   </>
 * );
 * ```
 *
 * @param qa Dot-separated QA hook: `<area>.<feature>.<element>[.<variant>]`.
 */
export function useQaId(qa: string): { id: string; "data-qa": string } {
  const id = React.useId();
  return { id, "data-qa": qa };
}
