"use client";

import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

import { ActiveThemeProvider } from "@/components/active-theme";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import messages from "@/messages/en.json";

export function DemoProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      storageKey="component-demo-color-mode">
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        <ActiveThemeProvider persist={false} restoreOnUnmount>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster />
          </TooltipProvider>
        </ActiveThemeProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
