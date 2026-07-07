"use client";

import { useEffect, useState } from "react";

export function DeviceCheck({ children }: { children: React.ReactNode }) {
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
    return (
      <main className="min-h-screen flex items-center justify-center bg-muted">
        <div
          role="alert"
          className="max-w-md mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Device Not Supported</h1>
          <p className="text-muted-foreground">
            This web application can only be viewed on tablets, laptops, or PCs with a screen width of 600px or greater.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
