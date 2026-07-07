"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

/**
 * Hook to detect and warn about unsaved changes before navigation
 * @param hasUnsavedChanges - Boolean indicating if there are unsaved changes
 * @param message - Custom warning message to display
 */
export function useUnsavedChanges(
  hasUnsavedChanges: boolean,
  message: string = "You have unsaved changes. Are you sure you want to leave?"
) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && hasUnsavedChanges && !isNavigatingRef.current) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");
        if (href && href.startsWith("/") && !href.startsWith("//") && targetAttr !== "_blank") {
          e.preventDefault();
          e.stopPropagation();
          setTargetHref(href);
          setShowModal(true);
        }
      }
    };

    if (hasUnsavedChanges) {
      document.addEventListener("click", handleClick, true);
    }

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [hasUnsavedChanges]);

  const handleConfirm = useCallback(() => {
    isNavigatingRef.current = true;
    setShowModal(false);
    if (targetHref) {
      router.push(targetHref);
    }
  }, [targetHref, router]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    setTargetHref(null);
  }, []);

  const allowNavigation = useCallback(() => {
    isNavigatingRef.current = true;
  }, []);

  const modal = (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white border-0">
            Leave Page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { allowNavigation, modal };
}
