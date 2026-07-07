"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../ui/button";

export interface ThemeSwitchProps {
  themeCookieData?: { themeData: string };
  onToggle?: (newTheme: "light" | "dark") => void;
}

export function ThemeSwitch({ themeCookieData, onToggle }: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && themeCookieData) {
      setTheme(themeCookieData.themeData);
    }
  }, [mounted, themeCookieData, setTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      size="icon"
      variant="outline"
      className="relative"
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        onToggle?.(newTheme);
      }}>
      {theme === "light" ? (
        <SunIcon aria-hidden="true" focusable="false" />
      ) : (
        <MoonIcon aria-hidden="true" focusable="false" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
