import { SITE } from "@/content/site";
import { CommissionForm } from "./commission-form";

/**
 * Server component wrapper: the heading and copy render server-side (so search and
 * answer engines read them without executing JS), and only the form itself is a client
 * island.
 */
export function CommissionSection() {
  return (
    <section id="commission" className="px-6 py-28 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
        <div>
          <p className="font-hand text-primary text-2xl md:text-3xl">{SITE.commission.eyebrow}</p>
          <h2 className="font-display text-foreground mt-3 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] font-semibold">
            {SITE.commission.title}
          </h2>
          <p className="text-ink-muted mt-5 max-w-prose text-lg">{SITE.commission.body}</p>
          <p className="text-ink-faint mt-8 text-sm">{SITE.pricing.note}</p>
        </div>

        <div className="border-border bg-card rounded-[1.75rem] border p-6 md:p-9">
          <CommissionForm />
        </div>
      </div>
    </section>
  );
}
