"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { SITE } from "@/content/site";
import { commissionFormSchema, type CommissionFormValues } from "@/lib/commission-schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom/CustomSelect";
import { useQaId } from "@/hooks/use-qa-id";
import { cn } from "@/lib/utils";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const PORTRAIT_OPTIONS = SITE.pricing.tiers.map((tier) => ({
  value: tier.id,
  label: `${tier.tier} — ${tier.people} (${tier.price})`
}));

const MEDIUM_OPTIONS = SITE.commission.mediums.map((m) => ({ value: m, label: m }));

type Status = "idle" | "submitting" | "sent" | "error" | "unavailable";

export function CommissionForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [token, setToken] = useState<string>("");
  // Bumping this remounts the widget, which is how a used or failed challenge is
  // reset. Doing it with a key rather than an imperative ref keeps the submit handler
  // free of ref access, which React's rules-of-hooks lint (correctly) rejects when the
  // handler is created during render.
  const [challengeKey, setChallengeKey] = useState(0);
  const resetChallenge = () => {
    setToken("");
    setChallengeKey((k) => k + 1);
  };

  const f = SITE.commission.fields;
  const nameId = useQaId("portfolio.commission.name");
  const emailId = useQaId("portfolio.commission.email");
  const peopleId = useQaId("portfolio.commission.people");
  const deadlineId = useQaId("portfolio.commission.deadline");
  const budgetId = useQaId("portfolio.commission.budget");
  const descriptionId = useQaId("portfolio.commission.description");
  const referenceId = useQaId("portfolio.commission.reference");
  const consentId = useQaId("portfolio.commission.consent");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionFormSchema),
    defaultValues: {
      name: "",
      email: "",
      portraitType: "solo",
      people: 1,
      medium: "",
      deadline: "",
      budget: "",
      description: "",
      referenceUrl: "",
      company: "",
      consent: true as const
    }
  });

  const onSubmit = async (values: CommissionFormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/commission", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token })
      });
      if (res.status === 503) {
        setStatus("unavailable");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        resetChallenge();
        return;
      }
      setStatus("sent");
      reset();
      resetChallenge();
    } catch {
      setStatus("error");
      resetChallenge();
    }
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        data-qa="portfolio.commission.success"
        className="border-border bg-card rounded-2xl border p-10 text-center">
        <p className="font-display text-foreground text-2xl">{SITE.commission.success.title}</p>
        <p className="text-ink-muted mt-3">{SITE.commission.success.body}</p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      data-qa="portfolio.commission.form"
      className="flex flex-col gap-5">
      {/* Honeypot. Hidden from sight and from assistive tech; only a bot fills it. */}
      <div aria-hidden className="hidden">
        {/* eslint-disable-next-line i18next/no-literal-string -- honeypot, never rendered to a human */}
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow label={f.name} htmlFor={nameId.id} error={errors.name?.message}>
          <Input
            {...nameId}
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FormRow>

        <FormRow
          label={f.email}
          htmlFor={emailId.id}
          hint={f.emailHint}
          error={errors.email?.message}>
          <Input
            {...emailId}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormRow>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow label={f.portraitType} error={errors.portraitType?.message}>
          <Controller
            control={control}
            name="portraitType"
            render={({ field }) => (
              <CustomSelect
                options={PORTRAIT_OPTIONS}
                value={field.value}
                onValueChange={(o) => field.onChange(o?.value ?? "solo")}
                placeholder={f.portraitTypePlaceholder}
                className="min-h-11"
                data-qa="portfolio.commission.portrait-type"
              />
            )}
          />
        </FormRow>

        <FormRow label={f.people} htmlFor={peopleId.id} error={errors.people?.message}>
          <Input
            {...peopleId}
            type="number"
            min={1}
            max={20}
            aria-invalid={!!errors.people}
            {...register("people")}
          />
        </FormRow>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormRow label={f.medium}>
          <Controller
            control={control}
            name="medium"
            render={({ field }) => (
              <CustomSelect
                options={MEDIUM_OPTIONS}
                value={field.value || undefined}
                onValueChange={(o) => field.onChange(o?.value ?? "")}
                placeholder={f.mediumPlaceholder}
                showClear
                className="min-h-11"
                data-qa="portfolio.commission.medium"
              />
            )}
          />
        </FormRow>

        <FormRow label={f.deadline} htmlFor={deadlineId.id} hint={f.deadlineHint}>
          <Input {...deadlineId} {...register("deadline")} />
        </FormRow>

        <FormRow label={f.budget} htmlFor={budgetId.id} hint={f.budgetHint}>
          <Input {...budgetId} {...register("budget")} />
        </FormRow>
      </div>

      <FormRow
        label={f.description}
        htmlFor={descriptionId.id}
        hint={f.descriptionHint}
        error={errors.description?.message}>
        <Textarea
          {...descriptionId}
          rows={5}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </FormRow>

      <FormRow
        label={f.referenceUrl}
        htmlFor={referenceId.id}
        hint={f.referenceUrlHint}
        error={errors.referenceUrl?.message}>
        <Input
          {...referenceId}
          type="url"
          inputMode="url"
          aria-invalid={!!errors.referenceUrl}
          {...register("referenceUrl")}
        />
      </FormRow>

      {/* The checkbox itself is 16px; the row gives it a 44px hit area so the whole
          line is tappable, per ui-ux-quality §2. */}
      <div className="-mx-2 flex min-h-11 items-start gap-3 px-2 py-2">
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <Checkbox
              id={consentId.id}
              // Radix renders the checkbox as a <button role="checkbox">, and a
              // `<label for>` does not give that an accessible name axe will accept.
              // The visible label still drives click-to-toggle; this names the control.
              aria-label={f.consent}
              data-qa="portfolio.commission.consent"
              checked={field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
              className="mt-1"
            />
          )}
        />
        <label
          htmlFor={consentId.id}
          className="text-ink-muted cursor-pointer py-1 text-sm leading-relaxed">
          {f.consent}
        </label>
      </div>

      {SITE_KEY ? (
        <Turnstile
          key={challengeKey}
          siteKey={SITE_KEY}
          onSuccess={setToken}
          onExpire={() => setToken("")}
          onError={() => setToken("")}
          options={{ theme: "light", size: "flexible" }}
        />
      ) : null}

      {/* Ink on cream, matching every other CTA on the page. The default `primary`
          button is rose with white text, which measures 3.55:1 — below the 4.5:1 floor
          for its 12px label. */}
      <Button
        type="submit"
        size="lg"
        disabled={submitting || (!!SITE_KEY && !token)}
        data-qa="portfolio.commission.submit"
        className="bg-foreground text-background hover:bg-secondary min-h-11 self-start rounded-full px-8 tracking-[0.12em] uppercase">
        {submitting ? f.submitting : f.submit}
      </Button>

      {status === "error" ? (
        <p role="alert" className="text-destructive text-sm" data-qa="portfolio.commission.error">
          {SITE.commission.error.body}
        </p>
      ) : null}

      {status === "unavailable" ? (
        <p
          role="alert"
          className="text-ink-muted text-sm"
          data-qa="portfolio.commission.unavailable">
          {SITE.commission.unavailable}
        </p>
      ) : null}
    </form>
  );
}

function FormRow({
  label,
  htmlFor,
  hint,
  error,
  children
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-foreground text-xs font-medium tracking-[0.12em] uppercase">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-ink-faint text-xs">{hint}</p> : null}
      {error ? (
        <p className={cn("text-destructive text-xs")} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
