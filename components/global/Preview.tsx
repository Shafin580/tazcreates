"use client";

import type React from "react";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";

type PreviewSize = "small" | "medium" | "large" | "xl";

interface PreviewProps {
  children: React.ReactNode;
  smallPreview?: React.ReactNode;
  enlargeSize?: PreviewSize;
  className?: string;
  previewText?: string;
  enlargeLabel?: string;
  qaPrefix?: string;
}

const sizeClasses = {
  small: "max-w-md max-h-96",
  medium: "max-w-2xl max-h-[600px]",
  large: "max-w-4xl max-h-[800px]",
  xl: "max-w-8xl max-h-[900px]"
};

export default function Preview({
  children,
  smallPreview,
  enlargeSize = "medium",
  className,
  previewText,
  enlargeLabel = "Enlarge preview",
  qaPrefix = "global.preview"
}: PreviewProps) {
  const [isEnlarged, setIsEnlarged] = useState(false);

  return (
    <Dialog onOpenChange={setIsEnlarged} open={isEnlarged}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "group bg-background ring-border focus-visible:ring-ring absolute cursor-pointer overflow-hidden rounded-4xl border-2 p-0 text-left shadow-xl ring-8 focus-visible:outline-none",
            className
          )}
          aria-label={enlargeLabel}
          data-qa={`${qaPrefix}.open`}>
          <div className="size-full">{smallPreview || children}</div>

          <div
            aria-hidden="true"
            className="bg-foreground/30 absolute inset-0 flex scale-500 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="bg-background/90 text-foreground rounded-md px-3 py-1 text-sm font-medium">
              {previewText || enlargeLabel}
            </span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className={cn("size-full overflow-hidden p-0", sizeClasses[enlargeSize])}>
        <DialogTitle className="sr-only">{enlargeLabel}</DialogTitle>
        <DialogDescription className="sr-only">{previewText || enlargeLabel}</DialogDescription>
        <div className="size-full overflow-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
