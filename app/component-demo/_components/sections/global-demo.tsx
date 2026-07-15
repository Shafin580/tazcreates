"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MonitorCheck } from "lucide-react";

import { BackNavigation } from "@/components/global/BackNavigation/BackNavigation";
import { ConfirmModal } from "@/components/global/ConfirmModal";
import { DashboardErrorContent } from "@/components/global/DashboardErrorContent";
import { DeviceCheck } from "@/components/global/DeviceCheck";
import { Error500Content } from "@/components/global/Error500Content";
import ErrorText from "@/components/global/ErrorText";
import { LoadingProvider, useLoading } from "@/components/global/Loader/Loader-Context";
import { LoadingOverlay } from "@/components/global/Loader/LoadingOverlay";
import { Spinner as LoaderSpinner } from "@/components/global/Loader/Spinner";
import { NoDataFound } from "@/components/global/NoDataFound";
import { NotFoundContent } from "@/components/global/NotFoundContent";
import { PermissionDenied } from "@/components/global/PermissionDenied";
import PhoneNumberInputField from "@/components/global/PhoneNumberInputField";
import Preview from "@/components/global/Preview";
import { SessionExpiredModal } from "@/components/global/SessionExpiredModal";
import { ThemeSwitch } from "@/components/global/ThemeSwitch";
import { WorkInProgressCard } from "@/components/global/WorkInProgressCard";
import { LiveTime } from "@/components/global/live-time";
import { PhotoEnlarge } from "@/components/global/photo-enlarge";
import { useUnsavedChanges } from "@/components/global/use-unsaved-changes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQaId } from "@/hooks/use-qa-id";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

const DASHBOARD_ERROR_NAME = "DashboardErrorContent";

function FullScreenStatePreview({
  name,
  qa,
  children
}: {
  name: string;
  qa: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("ComponentDemo.samples");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button data-qa={qa} type="button">
          {t("actions.open")} {name}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-w-[95vw] overflow-auto p-0 sm:max-w-[95vw]">
        <DialogHeader className="sr-only">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{t("content.dialogDescription")}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function ConfirmModalExample() {
  const t = useTranslations("ComponentDemo.samples");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        data-qa="component-demo.global.confirm-modal.open"
        onClick={() => setOpen(true)}
        type="button">
        {t("actions.open")}
      </Button>
      <ConfirmModal
        cancelText={t("actions.cancel")}
        confirmText={t("actions.confirm")}
        description={t("content.alertDescription")}
        destructive
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title={t("content.alertTitle")}
      />
    </>
  );
}

function DashboardErrorExample() {
  const t = useTranslations("ComponentDemo.samples");
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button data-qa="component-demo.global.dashboard-error.open" type="button">
          {t("actions.open")} {DASHBOARD_ERROR_NAME}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-w-[95vw] overflow-auto p-4 sm:max-w-[95vw]">
        <DialogHeader className="sr-only">
          <DialogTitle>{DASHBOARD_ERROR_NAME}</DialogTitle>
          <DialogDescription>{t("content.errorDescription")}</DialogDescription>
        </DialogHeader>
        <DashboardErrorContent
          error={new Error(t("content.errorDescription"))}
          reset={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function LoadingProviderControl() {
  const t = useTranslations("ComponentDemo.samples");
  const { setLoading } = useLoading();

  const showLoading = () => {
    setLoading(true, t("content.loading"));
    window.setTimeout(() => setLoading(false), 900);
  };

  return (
    <Button
      data-qa="component-demo.global.loading-provider.show"
      onClick={showLoading}
      type="button">
      {t("states.loading")}
    </Button>
  );
}

function LoadingOverlayExample() {
  const t = useTranslations("ComponentDemo.samples");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timeout = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timeout);
  }, [loading]);

  return (
    <>
      <Button
        data-qa="component-demo.global.loading-overlay.show"
        onClick={() => setLoading(true)}
        type="button">
        {t("states.loading")}
      </Button>
      <LoadingOverlay isLoading={loading} loaderText={t("content.loading")} />
    </>
  );
}

function PhoneInputExample() {
  const t = useTranslations("ComponentDemo.samples");
  const [phone, setPhone] = useState("");

  return (
    <PhoneNumberInputField
      label={t("labels.phone")}
      onChange={(value) => setPhone(value)}
      placeholder={t("labels.phone")}
      qaNamespace="component-demo.global.phone"
      value={phone}
    />
  );
}

function SessionExpiredExample() {
  const t = useTranslations("ComponentDemo.samples");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        data-qa="component-demo.global.session-expired.open"
        onClick={() => setOpen(true)}
        type="button">
        {t("actions.open")}
      </Button>
      <SessionExpiredModal
        description={t("content.dialogDescription")}
        loginCta={t("actions.continue")}
        onLoginClick={() => setOpen(false)}
        open={open}
        qaPrefix="component-demo.global.session-expired"
        title={t("content.dialogTitle")}
      />
    </>
  );
}

function UnsavedChangesExample() {
  const t = useTranslations("ComponentDemo.samples");
  const dirtyToggle = useQaId("component-demo.global.unsaved-changes.dirty");
  const scopeRef = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(false);
  const { allowNavigation, modal } = useUnsavedChanges(dirty, t("content.dialogDescription"), {
    cancelText: t("actions.cancel"),
    confirmText: t("actions.continue"),
    guardBeforeUnload: false,
    qaPrefix: "component-demo.global.unsaved-changes",
    scopeRef,
    title: t("content.dialogTitle")
  });

  return (
    <div className="space-y-4" ref={scopeRef}>
      <div className="flex items-center gap-3">
        <Switch {...dirtyToggle} checked={dirty} onCheckedChange={setDirty} />
        <Label htmlFor={dirtyToggle.id}>{t("actions.edit")}</Label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link
            data-qa="component-demo.global.unsaved-changes.navigate"
            href="/component-demo?navigation-preview=1">
            {t("actions.continue")}
          </Link>
        </Button>
        <Button
          data-qa="component-demo.global.unsaved-changes.allow"
          onClick={() => {
            allowNavigation();
            setDirty(false);
          }}
          type="button"
          variant="secondary">
          {t("actions.save")}
        </Button>
      </div>
      {modal}
    </div>
  );
}

export function GlobalDemos() {
  const t = useTranslations("ComponentDemo.samples");

  return (
    <DemoCategorySection category="global">
      <DemoFrame
        source="components/global/BackNavigation/BackNavigation.tsx"
        title="BackNavigation">
        <BackNavigation routes={["/"]} />
      </DemoFrame>

      <DemoFrame source="components/global/ConfirmModal.tsx" title="ConfirmModal">
        <ConfirmModalExample />
      </DemoFrame>

      <DemoFrame source="components/global/DashboardErrorContent.tsx" title="DashboardErrorContent">
        <DashboardErrorExample />
      </DemoFrame>

      <DemoFrame source="components/global/DeviceCheck.tsx" title="DeviceCheck">
        <DeviceCheck
          fallbackMode="inline"
          headingLevel={4}
          unsupportedDescription={t("content.shortDescription")}
          unsupportedTitle={t("content.errorTitle")}>
          <div className="bg-muted flex items-center gap-3 border p-4 text-sm">
            <MonitorCheck aria-hidden="true" className="text-primary size-5" />
            {t("content.description")}
          </div>
        </DeviceCheck>
      </DemoFrame>

      <DemoFrame source="components/global/Error500Content.tsx" title="Error500Content">
        <FullScreenStatePreview name="Error500Content" qa="component-demo.global.error-500.open">
          <Error500Content
            description={t("content.errorDescription")}
            title={t("content.errorTitle")}
          />
        </FullScreenStatePreview>
      </DemoFrame>

      <DemoFrame source="components/global/ErrorText.tsx" title="ErrorText">
        <ErrorText text={t("content.errorDescription")} />
      </DemoFrame>

      <DemoFrame source="components/global/Loader/Loader-Context.tsx" title="LoadingProvider">
        <LoadingProvider>
          <LoadingProviderControl />
        </LoadingProvider>
      </DemoFrame>

      <DemoFrame source="components/global/Loader/LoadingOverlay.tsx" title="LoadingOverlay">
        <LoadingOverlayExample />
      </DemoFrame>

      <DemoFrame source="components/global/Loader/Spinner.tsx" title="Loader Spinner">
        <div aria-label={t("content.loading")} className="flex items-center gap-3" role="status">
          <LoaderSpinner size={28} />
          <span className="text-muted-foreground text-sm">{t("content.loading")}</span>
        </div>
      </DemoFrame>

      <DemoFrame source="components/global/NoDataFound/index.tsx" title="NoDataFound" wide>
        <NoDataFound
          description={t("content.emptyDescription")}
          icon="database"
          title={t("content.emptyTitle")}>
          <Button data-qa="component-demo.global.no-data.retry" type="button" variant="outline">
            {t("actions.retry")}
          </Button>
        </NoDataFound>
      </DemoFrame>

      <DemoFrame source="components/global/NotFoundContent.tsx" title="NotFoundContent">
        <FullScreenStatePreview name="NotFoundContent" qa="component-demo.global.not-found.open">
          <NotFoundContent
            contactHref="mailto:support@example.com"
            contactText={t("actions.contact")}
            description={t("content.emptyDescription")}
            homeHref="/component-demo"
            homeText={t("actions.previous")}
            title={t("content.emptyTitle")}
          />
        </FullScreenStatePreview>
      </DemoFrame>

      <DemoFrame
        source="components/global/PermissionDenied/index.tsx"
        title="PermissionDenied"
        wide>
        <PermissionDenied
          description={t("content.errorDescription")}
          headingLevel={4}
          supportDescription={t("content.shortDescription")}
          title={t("content.errorTitle")}
        />
      </DemoFrame>

      <DemoFrame source="components/global/PhoneNumberInputField.tsx" title="PhoneNumberInputField">
        <PhoneInputExample />
      </DemoFrame>

      <DemoFrame
        previewClassName="relative h-48"
        source="components/global/Preview.tsx"
        title="Preview">
        <Preview
          className="inset-0 h-40 w-full"
          enlargeLabel={t("actions.open")}
          enlargeSize="small"
          previewText={t("actions.open")}
          qaPrefix="component-demo.global.preview"
          smallPreview={
            <div className="bg-muted flex size-full items-center justify-center">
              {t("content.title")}
            </div>
          }>
          <div className="bg-card flex size-full items-center justify-center p-8 text-center">
            {t("content.description")}
          </div>
        </Preview>
      </DemoFrame>

      <DemoFrame source="components/global/SessionExpiredModal.tsx" title="SessionExpiredModal">
        <SessionExpiredExample />
      </DemoFrame>

      <DemoFrame source="components/global/ThemeSwitch.tsx" title="ThemeSwitch">
        <ThemeSwitch />
      </DemoFrame>

      <DemoFrame
        source="components/global/WorkInProgressCard/index.tsx"
        title="WorkInProgressCard"
        wide>
        <WorkInProgressCard className="min-h-72" text={{ value: t("content.workInProgress") }} />
      </DemoFrame>

      <DemoFrame source="components/global/live-time.tsx" title="LiveTime">
        <LiveTime dataQa="component-demo.global.live-time" />
      </DemoFrame>

      <DemoFrame source="components/global/photo-enlarge.tsx" title="PhotoEnlarge">
        <PhotoEnlarge
          alt={t("content.title")}
          className="bg-muted h-28 w-40 object-contain p-4"
          height={112}
          src="/globe.svg"
          thumbnailClassName="block"
          width={160}
        />
      </DemoFrame>

      <DemoFrame source="components/global/use-unsaved-changes.tsx" title="useUnsavedChanges" wide>
        <UnsavedChangesExample />
      </DemoFrame>
    </DemoCategorySection>
  );
}
