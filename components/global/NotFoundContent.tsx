import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export function NotFoundContent() {
  return (
    <main
      aria-labelledby="not-found-title"
      className="bg-background grid h-screen items-center pb-8 lg:grid-cols-2 lg:pb-0"
    >
      <div className="text-center">
        <p
          aria-hidden="true"
          className="text-muted-foreground text-base font-semibold"
        >
          404
        </p>
        <h1
          id="not-found-title"
          className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-7xl"
        >
          Page not found
        </h1>
        <p className="text-muted-foreground mt-6 text-base leading-7">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-2">
          <Button size="lg" asChild>
            <Link href="/dashboard">Go back home</Link>
          </Button>
          <Button size="lg" variant="ghost">
            Contact support
            <ArrowRight className="ms-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div className="hidden lg:block">
        {/* Decorative illustration; heading already conveys meaning. */}
        <Image
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/404.svg`}
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
