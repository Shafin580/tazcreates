import { Mail } from "lucide-react";
import { InstagramGlyph } from "./primitives/instagram-glyph";
import { SITE } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-border border-t px-6 py-16 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-foreground text-3xl">{SITE.artist.name}</p>
          <p className="text-ink-faint mt-2 text-sm">{SITE.footer.rights}</p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:gap-12">
          <div>
            <p className="text-ink-faint text-xs tracking-[0.18em] uppercase">
              {SITE.footer.instagramLabel}
            </p>
            <a
              href={SITE.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-qa="portfolio.footer.instagram"
              className="text-foreground hover:text-primary focus-visible:ring-ring -mx-2 mt-0.5 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none">
              <InstagramGlyph className="size-4" />
              {SITE.contact.instagramHandle}
            </a>
          </div>

          <div>
            <p className="text-ink-faint text-xs tracking-[0.18em] uppercase">
              {SITE.footer.emailLabel}
            </p>
            <a
              href={`mailto:${SITE.contact.email}`}
              data-qa="portfolio.footer.email"
              className="text-foreground hover:text-primary focus-visible:ring-ring -mx-2 mt-0.5 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none">
              <Mail aria-hidden className="size-4" />
              {SITE.contact.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
