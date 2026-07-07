import { NextResponse, type NextRequest } from "next/server";

type CookieResolver = (name: string) => Promise<unknown | null>;

interface AuthProxyOptions {
  appName: string;
  cookieName: string;
  mainAppUrl: string;
  getServerSideCookie: CookieResolver;
}

export function createAuthProxy(opts: AuthProxyOptions) {
  return async function proxy(_request: NextRequest) {
    const userData = await opts.getServerSideCookie(opts.cookieName);

    if (!userData) {
      let target: URL;
      try {
        target = new URL(opts.mainAppUrl);
      } catch {
        return new NextResponse("Misconfigured main app URL", { status: 500 });
      }
      target.searchParams.set("redirect", opts.appName);
      return NextResponse.redirect(target);
    }

    return NextResponse.next();
  };
}
