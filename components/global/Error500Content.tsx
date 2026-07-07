export function Error500Content() {
  return (
    <main
      aria-labelledby="error-500-title"
      className="bg-background grid h-screen items-center pb-8 lg:grid-cols-2 lg:pb-0"
    >
      <div role="alert" className="text-center">
        <p
          aria-hidden="true"
          className="text-muted-foreground text-base font-semibold"
        >
          500
        </p>
        <h1
          id="error-500-title"
          className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-7xl"
        >
          Server Error
        </h1>
        <p className="text-muted-foreground mt-6 text-base leading-7">
          There seems to be a connection problem between the server and the website.
        </p>
      </div>

      <div className="col-span-1 hidden lg:block">
        {/* Decorative illustration; the heading already conveys the meaning. */}
        <img
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/500.svg`}
          alt=""
          aria-hidden="true"
          className="object-contain"
        />
      </div>
    </main>
  );
}
