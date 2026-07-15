"use client";

import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { DEFAULT_THEME, ThemeType } from "@/lib/themes";

const THEME_BODY_ATTRIBUTES = [
  "data-theme-radius",
  "data-theme-preset",
  "data-theme-content-layout",
  "data-theme-scale",
  "data-theme-chart-preset",
  "data-theme-font"
] as const;

function setThemeCookie(key: string, value: string | null) {
  if (typeof window === "undefined") return;

  if (!value) {
    document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
  } else {
    document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
  }
}

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({
  children,
  initialTheme,
  persist = true,
  restoreOnUnmount = false
}: {
  children: ReactNode;
  initialTheme?: ThemeType;
  persist?: boolean;
  restoreOnUnmount?: boolean;
}) {
  const previousBodyAttributes = useRef<Record<string, string | null> | null>(null);
  const [theme, setTheme] = useState<ThemeType>(() =>
    initialTheme ? initialTheme : DEFAULT_THEME
  );

  useEffect(() => {
    if (!restoreOnUnmount) return;

    const body = document.body;
    previousBodyAttributes.current = Object.fromEntries(
      THEME_BODY_ATTRIBUTES.map((attribute) => [attribute, body.getAttribute(attribute)])
    );

    return () => {
      const previous = previousBodyAttributes.current;
      if (!previous) return;

      for (const attribute of THEME_BODY_ATTRIBUTES) {
        const value = previous[attribute];
        if (value === null) body.removeAttribute(attribute);
        else body.setAttribute(attribute, value);
      }
    };
  }, [restoreOnUnmount]);

  useEffect(() => {
    const body = document.body;
    const persistCookie = (key: string, value: string | null) => {
      if (persist) setThemeCookie(key, value);
    };

    if (theme.radius != "default") {
      persistCookie("theme_radius", theme.radius);
      body.setAttribute("data-theme-radius", theme.radius);
    } else {
      persistCookie("theme_radius", null);
      body.removeAttribute("data-theme-radius");
    }

    if (theme.preset != "default") {
      persistCookie("theme_preset", theme.preset);
      body.setAttribute("data-theme-preset", theme.preset);
    } else {
      persistCookie("theme_preset", null);
      body.removeAttribute("data-theme-preset");
    }

    persistCookie("theme_content_layout", theme.contentLayout);
    body.setAttribute("data-theme-content-layout", theme.contentLayout);

    if (theme.scale != "none") {
      persistCookie("theme_scale", theme.scale);
      body.setAttribute("data-theme-scale", theme.scale);
    } else {
      persistCookie("theme_scale", null);
      body.removeAttribute("data-theme-scale");
    }

    if (theme.chartPreset != "default") {
      persistCookie("theme_chart_preset", theme.chartPreset);
      body.setAttribute("data-theme-chart-preset", theme.chartPreset);
    } else {
      persistCookie("theme_chart_preset", null);
      body.removeAttribute("data-theme-chart-preset");
    }

    if (theme.font != "default") {
      persistCookie("theme_font", theme.font);
      body.setAttribute("data-theme-font", theme.font);
    } else {
      persistCookie("theme_font", null);
      body.removeAttribute("data-theme-font");
    }
  }, [
    persist,
    theme.preset,
    theme.radius,
    theme.scale,
    theme.chartPreset,
    theme.contentLayout,
    theme.font
  ]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ActiveThemeProvider");
  }
  return context;
}
