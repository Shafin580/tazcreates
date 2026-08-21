import { z } from "zod";

/**
 * The commission request contract, shared by the client form and the route handler.
 *
 * One definition on purpose: client-side validation is a convenience for the visitor
 * and nothing more. The route handler re-parses the raw body with this same schema
 * before it does anything with it, because anyone can POST to the endpoint directly.
 */

export const PORTRAIT_TYPES = ["solo", "duo", "group"] as const;
export type PortraitType = (typeof PORTRAIT_TYPES)[number];

export const commissionSchema = z.object({
  name: z.string().trim().min(2, "required").max(80),
  email: z.string().trim().email("email").max(160),
  portraitType: z.enum(PORTRAIT_TYPES),
  people: z.coerce.number().int().min(1).max(20),
  medium: z.string().trim().max(60).optional().or(z.literal("")),
  deadline: z.string().trim().max(60).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  description: z.string().trim().min(10, "required").max(2000),
  referenceUrl: z.string().trim().url("url").max(500).optional().or(z.literal("")),
  consent: z.literal(true),

  /**
   * Honeypot. A real visitor never sees this field, so any value in it is a bot.
   * Named plausibly rather than `honeypot` — naive scrapers fill what looks fillable.
   *
   * Deliberately permissive: rejecting a filled honeypot HERE would return 400 and tell
   * the bot exactly which field caught it. The route handler inspects it after parsing
   * and answers 200 without sending anything, so a bot cannot distinguish being dropped
   * from succeeding.
   */
  company: z.string().max(200).optional(),

  /** Cloudflare Turnstile token; verified server-side before anything is sent. */
  turnstileToken: z.string().min(1).max(4096)
});

export type CommissionInput = z.infer<typeof commissionSchema>;

/** The client form's own shape — same fields, minus what only the server cares about. */
export const commissionFormSchema = commissionSchema.omit({ turnstileToken: true });
export type CommissionFormValues = z.infer<typeof commissionFormSchema>;
