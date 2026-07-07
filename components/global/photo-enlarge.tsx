"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";

interface PhotoEnlargeProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  thumbnailClassName?: string;
  priority?: boolean;
}

export function PhotoEnlarge({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  thumbnailClassName = "",
  priority = false,
}: PhotoEnlargeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Enlarge image: ${alt}`}
          className={`relative group cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${thumbnailClassName}`}>
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className={`transition-transform duration-300 group-hover:scale-105 ${className}`}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn className="size-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-transparent">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative flex items-center justify-center min-h-[50vh]">
          <div className="relative max-w-full max-h-full">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={1200}
              height={900}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
