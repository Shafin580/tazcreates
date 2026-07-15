"use client";

import { useEffect, useState } from "react";

export function DeviceCheck({
  children,
  fallbackMode = "page",
  headingLevel,
  unsupportedTitle = "Device Not Supported",
  unsupportedDescription = "This web application can only be viewed on tablets, laptops, or PCs with a screen width of 600px or greater."
}: {
  children: React.ReactNode;
  fallbackMode?: "inline" | "page";
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  unsupportedTitle?: string;
  unsupportedDescription?: string;
}) {
  const [isUnsupported, setIsUnsupported] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isSmallScreen = window.innerWidth < 600;
      setIsUnsupported(isSmallScreen);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isUnsupported) {
    const Heading = `h${headingLevel ?? (fallbackMode === "inline" ? 2 : 1)}` as const;
    const message = (
      <div
        role="alert"
        className="bg-card text-card-foreground mx-auto max-w-md p-6 text-center shadow-lg">
        <Heading className="mb-4 text-2xl font-bold">{unsupportedTitle}</Heading>
        <p className="text-muted-foreground">{unsupportedDescription}</p>
      </div>
    );

    return fallbackMode === "inline" ? (
      <div className="bg-muted flex min-h-64 items-center justify-center">{message}</div>
    ) : (
      <main className="bg-muted flex min-h-screen items-center justify-center">{message}</main>
    );
  }

  return <>{children}</>;
}
