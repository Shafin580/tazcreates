"use client";

import type React from "react";
import { useEffect, useId } from "react";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DrawerProps {
  isOpenState: boolean;
  drawerTitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "w-1/4" | "w-2/4" | "w-3/4" | "w-1/3" | "w-2/3" | "w-1/2" | "w-full" | string;
  className?: string;
}

export function CustomDrawer({
  isOpenState,
  drawerTitle = "Drawer",
  children,
  onClose,
  size = "w-1/4",
  className
}: DrawerProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpenState) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpenState]);

  return (
    <div className={`relative ${className ? className : ""}`}>
      {/* Backdrop Overlay — must stay BELOW the drawer so clicks on drawer
          content (checkboxes, inputs) aren't swallowed by the backdrop's
          onClose handler. Only clicks on the exposed backdrop area (outside
          the drawer panel) should close. The backdrop is purely presentational
          — the close button below provides the a11y-affordance for closing. */}
      {isOpenState && (
        <div
          className="fixed inset-0 z-50 bg-black/5 transition-opacity duration-300 ease-in-out dark:bg-white/5"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Drawer — above the backdrop so interactions inside reach their targets. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!isOpenState}
        className={`fixed inset-y-0 right-0 z-50 ${size} bg-background min-w-[250px] transform shadow-lg transition-transform duration-300 ease-in-out dark:border-l ${
          isOpenState ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex h-full min-w-0 flex-col overflow-hidden p-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 id={titleId} className="truncate pr-2 text-lg font-semibold">
              {drawerTitle}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close drawer">
              <X className="size-5" aria-hidden="true" />
            </Button>
          </div>
          {/* min-h-0 + min-w-0 let this flex child shrink so nested overflow
              actually activates. overflow-y-auto handles vertical scroll;
              overflow-x-hidden prevents wide children from bleeding past the
              panel and forcing a horizontal scroll on the page. */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
