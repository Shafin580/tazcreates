import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export interface NotFoundContentProps {
  title?: string;
  description?: string;
  homeText?: string;
  homeHref?: string;
  contactText?: string;
  contactHref?: string;
  imageSrc?: string;
}

export function NotFoundContent({
  title = "Page not found",
  description = "Sorry, we couldn’t find the page you’re looking for.",
  homeText = "Go back home",
  homeHref = "/",
  contactText = "Contact support",
  contactHref,
  imageSrc
}: NotFoundContentProps = {}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  const illustrationSrc = imageSrc ?? `${siteUrl}/images/404.svg`;

  return (
    <main
      aria-labelledby="not-found-title"
      className="bg-background grid h-screen items-center pb-8 lg:grid-cols-2 lg:pb-0">
      <div className="text-center">
        <p aria-hidden="true" className="text-muted-foreground text-base font-semibold">
          404
        </p>
        <h1
          id="not-found-title"
          className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-7xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-6 text-base leading-7">{description}</p>
        <div className="mt-10 flex items-center justify-center gap-x-2">
          <Button size="lg" asChild>
            <Link data-qa="global.not-found.home" href={homeHref}>
              {homeText}
            </Link>
          </Button>
          {contactHref ? (
            <Button size="lg" variant="ghost" asChild>
              <a data-qa="global.not-found.contact" href={contactHref}>
                {contactText}
                <ArrowRight className="ms-2 size-4" aria-hidden="true" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      <div className="hidden lg:block">
        {/* Decorative illustration; heading already conveys meaning. */}
        <Image
          src={illustrationSrc}
          width={300}
          height={400}
          className="w-full object-contain lg:max-w-2xl"
          alt=""
          aria-hidden="true"
        />
      </div>
    </main>
  );
}
