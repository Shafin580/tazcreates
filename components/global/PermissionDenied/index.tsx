"use client";

import { LockIcon, AlertCircleIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../ui/card";

interface PermissionDeniedProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
  backText?: string;
  supportDescription?: string;
  contactEmail?: string;
  contactText?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function PermissionDenied({
  title = "Access Denied",
  description = "You don't have permission to view this content.",
  showBackButton = false,
  backHref = "/",
  backText = "Go back",
  supportDescription = "If you believe this is an error, please contact your administrator for assistance.",
  contactEmail,
  contactText = "Contact administrator",
  headingLevel = 2
}: PermissionDeniedProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <LockIcon className="text-destructive size-8" aria-hidden="true" />
          </div>
          <CardTitle role="heading" aria-level={headingLevel} className="text-2xl">
            {title}
          </CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-muted text-muted-foreground flex items-center justify-center gap-2 rounded-lg p-3">
            <AlertCircleIcon className="size-5" aria-hidden="true" />
            <p className="text-sm">{supportDescription}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          {showBackButton && (
            <Button variant="outline" className="w-full" asChild>
              <Link href={backHref}>
                <ArrowLeftIcon className="me-2 size-4" aria-hidden="true" />
                {backText}
              </Link>
            </Button>
          )}
          {contactEmail && (
            <Button className="w-full" asChild>
              <a href={`mailto:${contactEmail}`}>{contactText}</a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
