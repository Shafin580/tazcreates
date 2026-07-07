"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useQaId } from "@/hooks/use-qa-id";

export type SessionExpiredModalProps = {
  open: boolean;
  onLoginClick: () => void;
  title: string;
  description: string;
  loginCta: string;
  qaPrefix?: string;
};

export function SessionExpiredModal({
  open,
  onLoginClick,
  title,
  description,
  loginCta,
  qaPrefix = "common.session-expired",
}: SessionExpiredModalProps) {
  const dialogQa = useQaId(`${qaPrefix}.dialog`);
  const loginQa = useQaId(`${qaPrefix}.login`);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        id={dialogQa.id}
        data-qa={dialogQa["data-qa"]}
      >
        <AlertDialogHeader>
          <AlertDialogTitle data-qa={`${qaPrefix}.title`}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription data-qa={`${qaPrefix}.description`}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            type="button"
            id={loginQa.id}
            data-qa={loginQa["data-qa"]}
            onClick={onLoginClick}
          >
            {loginCta}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
