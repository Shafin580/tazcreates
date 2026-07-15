"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Edit3, MoreHorizontal, Save, Share2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiErrorCard } from "@/components/ui/custom/ApiErrorCard";
import { CardSkeleton } from "@/components/ui/custom/CardSkeleton";
import { CustomDrawer } from "@/components/ui/custom/CustomDrawer";
import { CustomSelect } from "@/components/ui/custom/CustomSelect";
import { DetailSkeleton } from "@/components/ui/custom/DetailSkeleton";
import { EntityCard, type EntityCardData } from "@/components/ui/custom/EntityCard";
import {
  EntityPickerCommand,
  EntityPickerPopover
} from "@/components/ui/custom/EntityPickerCommand";
import {
  FacetedFilterPopover,
  type FilterSection
} from "@/components/ui/custom/FacetedFilterPopover";
import { FormSkeleton } from "@/components/ui/custom/FormSkeleton";
import { IconTooltipButton } from "@/components/ui/custom/IconTooltipButton";
import { IconTooltipDropdownTrigger } from "@/components/ui/custom/IconTooltipDropdownTrigger";
import { PageHeader } from "@/components/ui/custom/PageHeader";
import { PageLoader } from "@/components/ui/custom/PageLoader";
import { PageSkeleton } from "@/components/ui/custom/PageSkeleton";
import { DEFAULT_PAGE_SIZE, PaginationFooter } from "@/components/ui/custom/PaginationFooter";
import { TableSelectionCounter } from "@/components/ui/custom/TableSelectionCounter";
import { TableSkeleton } from "@/components/ui/custom/TableSkeleton";
import { CountAnimation } from "@/components/ui/custom/count-animation";
import UserAvatar from "@/components/ui/custom/user-avatar";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useQaId } from "@/hooks/use-qa-id";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

const PAGE_LOADER_VARIANTS = ["settings-list", "settings-form", "detail-tabs"] as const;

const API_LABELS = {
  entityPickerCommand: "EntityPickerCommand",
  entityPickerPopover: "EntityPickerPopover",
  oneColumn: "columns={1}",
  twoColumns: "columns={2}",
  showAvatar: "showAvatar",
  showHeader: "showHeader",
  hideHeader: "showHeader={false}",
  showToolbar: "showToolbar"
} as const;

type DemoEntity = {
  id: number;
  title: string;
  role: string;
  code: string;
  active: boolean;
};

export function CustomDemos() {
  const t = useTranslations("ComponentDemo");
  const customSelect = useQaId("component-demo.custom.select");
  const [retrySucceeded, setRetrySucceeded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("engineering");
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(1);
  const [entityCommandVisible, setEntityCommandVisible] = useState(false);
  const [entityPopoverOpen, setEntityPopoverOpen] = useState(false);
  const [roleIds, setRoleIds] = useState<number[]>([1]);
  const [statusIds, setStatusIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive">("active");
  const [currentPage, setCurrentPage] = useState(2);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectionCount, setSelectionCount] = useState(2);

  const selectOptions = [
    { value: "engineering", label: t("samples.options.engineering") },
    { value: "design", label: t("samples.options.design") },
    { value: "marketing", label: t("samples.options.marketing") }
  ];

  const entities: DemoEntity[] = [
    {
      id: 1,
      title: t("samples.content.title"),
      role: t("samples.options.admin"),
      code: "EX-01",
      active: true
    },
    {
      id: 2,
      title: t("samples.labels.account"),
      role: t("samples.options.editor"),
      code: "EX-02",
      active: true
    },
    {
      id: 3,
      title: t("samples.labels.notifications"),
      role: t("samples.options.viewer"),
      code: "EX-03",
      active: false
    }
  ];

  const toEntityCard = (entity: DemoEntity): EntityCardData => ({
    title: entity.title,
    subtitle: entity.role,
    code: entity.code,
    description: t("samples.content.shortDescription"),
    badges: [
      {
        id: entity.id,
        name: entity.active ? t("samples.options.active") : t("samples.options.inactive")
      }
    ],
    active: entity.active
  });

  const filterSections: FilterSection[] = [
    {
      key: "role",
      label: t("samples.labels.role"),
      items: [
        { id: 1, name: t("samples.options.admin"), count: 4 },
        { id: 2, name: t("samples.options.editor"), count: 3 },
        { id: 3, name: t("samples.options.viewer"), count: 1 }
      ],
      selectedIds: roleIds,
      onChange: setRoleIds,
      placeholder: t("samples.labels.search")
    },
    {
      key: "status",
      label: t("samples.labels.status"),
      items: [
        { id: 1, name: t("samples.options.active"), count: 6 },
        { id: 2, name: t("samples.options.inactive"), count: 2 }
      ],
      selectedIds: statusIds,
      onChange: setStatusIds,
      searchable: false
    }
  ];

  const filteredCount = 418;
  const totalPages = Math.ceil(filteredCount / pageSize);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredCount);

  return (
    <DemoCategorySection category="custom">
      <DemoFrame title="ApiErrorCard" source="components/ui/custom/ApiErrorCard.tsx">
        <div data-qa="component-demo.custom.api-error-card">
          <ApiErrorCard
            title={t("samples.content.errorTitle")}
            error={{ status: 503, message: t("samples.content.errorDescription") }}
            onRetry={() => setRetrySucceeded(true)}
          />
          <span aria-live="polite" className="sr-only">
            {retrySucceeded ? t("samples.states.success") : null}
          </span>
        </div>
      </DemoFrame>

      <DemoFrame title="CardSkeleton" source="components/ui/custom/CardSkeleton.tsx">
        <CardSkeleton />
      </DemoFrame>

      <DemoFrame title="CustomDrawer" source="components/ui/custom/CustomDrawer.tsx">
        <Button
          aria-expanded={drawerOpen}
          aria-haspopup="dialog"
          data-qa="component-demo.custom.drawer.open"
          onClick={() => setDrawerOpen(true)}
          type="button">
          {t("samples.actions.open")}
        </Button>
        <CustomDrawer
          drawerTitle={t("samples.content.dialogTitle")}
          isOpenState={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          size="w-full max-w-md">
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              {t("samples.content.drawerDescription")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                data-qa="component-demo.custom.drawer.save"
                onClick={() => setDrawerOpen(false)}
                type="button">
                {t("samples.actions.save")}
              </Button>
              <Button
                data-qa="component-demo.custom.drawer.cancel"
                onClick={() => setDrawerOpen(false)}
                type="button"
                variant="outline">
                {t("samples.actions.cancel")}
              </Button>
            </div>
          </div>
        </CustomDrawer>
      </DemoFrame>

      <DemoFrame title="CustomSelect" source="components/ui/custom/CustomSelect.tsx">
        <div className="max-w-sm">
          <CustomSelect
            data-qa={customSelect["data-qa"]}
            id={customSelect.id}
            onValueChange={(option) => setSelectValue(option?.value ?? "")}
            options={selectOptions}
            placeholder={t("samples.actions.select")}
            value={selectValue}
          />
        </div>
      </DemoFrame>

      <DemoFrame title="DetailSkeleton" source="components/ui/custom/DetailSkeleton.tsx" wide>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.showAvatar}</code>
            <DetailSkeleton rows={3} showAvatar />
          </div>
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.hideHeader}</code>
            <DetailSkeleton rows={3} showHeader={false} />
          </div>
        </div>
      </DemoFrame>

      <DemoFrame title="EntityCard" source="components/ui/custom/EntityCard.tsx">
        <EntityCard className="w-full p-0" entity={toEntityCard(entities[0])} />
      </DemoFrame>

      <DemoFrame
        title="EntityPickerCommand"
        source="components/ui/custom/EntityPickerCommand.tsx"
        wide>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.entityPickerCommand}</code>
            {entityCommandVisible ? (
              <EntityPickerCommand
                emptyText={t("samples.content.emptyTitle")}
                getId={(entity) => entity.id}
                inline
                items={entities}
                maxListHeight="max-h-52"
                onSelect={(entity) => setSelectedEntityId(entity.id)}
                searchPlaceholder={t("samples.labels.search")}
                selectedId={selectedEntityId}
                showCheckmark
                showFilter={false}
                toCard={toEntityCard}
              />
            ) : (
              <Button
                data-qa="component-demo.custom.entity-picker-command.show"
                onClick={() => setEntityCommandVisible(true)}
                type="button"
                variant="outline">
                {t("samples.actions.open")} {API_LABELS.entityPickerCommand}
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.entityPickerPopover}</code>
            <EntityPickerPopover
              emptyText={t("samples.content.emptyTitle")}
              getId={(entity) => entity.id}
              items={entities}
              onOpenChange={setEntityPopoverOpen}
              onSelect={(entity) => {
                setSelectedEntityId(entity.id);
                setEntityPopoverOpen(false);
              }}
              open={entityPopoverOpen}
              popoverWidthClass="w-[min(22rem,calc(100vw-2rem))]"
              searchPlaceholder={t("samples.labels.search")}
              selectedId={selectedEntityId}
              showCheckmark
              showFilter={false}
              toCard={toEntityCard}
              trigger={
                <Button
                  aria-label={t("samples.actions.select")}
                  data-qa="component-demo.custom.entity-picker.open"
                  type="button"
                  variant="outline">
                  {t("samples.actions.select")}
                </Button>
              }
            />
          </div>
        </div>
      </DemoFrame>

      <DemoFrame
        title="FacetedFilterPopover"
        source="components/ui/custom/FacetedFilterPopover.tsx"
        wide>
        <FacetedFilterPopover
          align="start"
          matchTotal={Math.max(0, 8 - roleIds.length - statusIds.length)}
          onStatusChange={setFilterStatus}
          qaPrefix="component-demo.custom.filters"
          sections={filterSections}
          status={filterStatus}
          triggerLabel={t("samples.actions.filter")}
        />
      </DemoFrame>

      <DemoFrame title="FormSkeleton" source="components/ui/custom/FormSkeleton.tsx" wide>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.oneColumn}</code>
            <FormSkeleton fields={2} showActions={false} />
          </div>
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.twoColumns}</code>
            <FormSkeleton columns={2} fields={4} />
          </div>
        </div>
      </DemoFrame>

      <DemoFrame title="IconTooltipButton" source="components/ui/custom/IconTooltipButton.tsx">
        <div className="flex flex-wrap items-center gap-3">
          <IconTooltipButton
            aria-label={t("samples.actions.save")}
            data-qa="component-demo.custom.icon-tooltip.save"
            icon={<Save />}
            iconSize="sm"
            tooltip={t("samples.actions.save")}
          />
          <IconTooltipButton
            aria-label={t("samples.states.disabled")}
            data-qa="component-demo.custom.icon-tooltip.disabled"
            disabled
            icon={<Save />}
            tooltip={t("samples.states.disabled")}
          />
        </div>
      </DemoFrame>

      <DemoFrame
        title="IconTooltipDropdownTrigger"
        source="components/ui/custom/IconTooltipDropdownTrigger.tsx">
        <IconTooltipDropdownTrigger
          aria-label={t("samples.content.menuDescription")}
          data-qa="component-demo.custom.icon-dropdown.open"
          icon={<MoreHorizontal />}
          tooltip={t("samples.content.menuDescription")}>
          <DropdownMenuItem data-qa="component-demo.custom.icon-dropdown.edit">
            <Edit3 aria-hidden="true" />
            {t("samples.actions.edit")}
          </DropdownMenuItem>
          <DropdownMenuItem data-qa="component-demo.custom.icon-dropdown.share">
            <Share2 aria-hidden="true" />
            {t("samples.actions.share")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            data-qa="component-demo.custom.icon-dropdown.delete"
            variant="destructive">
            <Trash2 aria-hidden="true" />
            {t("samples.actions.delete")}
          </DropdownMenuItem>
        </IconTooltipDropdownTrigger>
      </DemoFrame>

      <DemoFrame title="PageHeader" source="components/ui/custom/PageHeader.tsx" wide>
        <PageHeader
          breadcrumbs={[
            { title: t("samples.labels.account"), href: "/" },
            { title: t("samples.content.title") }
          ]}
          headingLevel={4}
          subtitle={t("samples.content.shortDescription")}
          title={t("samples.content.title")}>
          <Button data-qa="component-demo.custom.page-header.save" type="button">
            {t("samples.actions.save")}
          </Button>
        </PageHeader>
      </DemoFrame>

      <DemoFrame title="PageLoader" source="components/ui/custom/PageLoader.tsx" wide>
        <div className="grid gap-6 xl:grid-cols-3">
          {PAGE_LOADER_VARIANTS.map((variant) => (
            <div className="min-w-0 space-y-2" key={variant}>
              <code className="text-muted-foreground text-xs">{variant}</code>
              <PageLoader columns={2} rows={2} variant={variant} />
            </div>
          ))}
        </div>
      </DemoFrame>

      <DemoFrame title="PageSkeleton" source="components/ui/custom/PageSkeleton.tsx" wide>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.showToolbar}</code>
            <PageSkeleton className="max-w-full" showToolbar />
          </div>
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.hideHeader}</code>
            <PageSkeleton className="max-w-full" showHeader={false} showToolbar />
          </div>
        </div>
      </DemoFrame>

      <DemoFrame
        title="PaginationFooter"
        source="components/ui/custom/PaginationFooter.tsx"
        previewClassName="p-0 sm:p-0"
        wide>
        <PaginationFooter
          currentPage={safeCurrentPage}
          endIndex={endIndex}
          filteredCount={filteredCount}
          hasActiveFilter
          onPageChange={setCurrentPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setCurrentPage(1);
          }}
          pageSize={pageSize}
          startIndex={startIndex}
          totalPages={totalPages}
          unfilteredCount={620}
        />
      </DemoFrame>

      <DemoFrame
        title="TableSelectionCounter"
        source="components/ui/custom/TableSelectionCounter.tsx">
        <div className="flex flex-wrap items-center gap-3">
          <TableSelectionCounter
            count={selectionCount}
            data-qa="component-demo.custom.selection-counter"
          />
          <Button
            data-qa="component-demo.custom.selection-counter.select"
            onClick={() => setSelectionCount((count) => count + 1)}
            size="sm"
            type="button"
            variant="outline">
            {t("samples.actions.select")}
          </Button>
          <Button
            data-qa="component-demo.custom.selection-counter.clear"
            onClick={() => setSelectionCount(0)}
            size="sm"
            type="button"
            variant="ghost">
            {t("samples.actions.clear")}
          </Button>
        </div>
      </DemoFrame>

      <DemoFrame title="TableSkeleton" source="components/ui/custom/TableSkeleton.tsx" wide>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.showHeader}</code>
            <TableSkeleton cellHeight={32} columns={3} rows={2} />
          </div>
          <div className="space-y-2">
            <code className="text-muted-foreground text-xs">{API_LABELS.hideHeader}</code>
            <TableSkeleton cellHeight={32} columns={3} rows={3} showHeader={false} />
          </div>
        </div>
      </DemoFrame>

      <DemoFrame title="CountAnimation" source="components/ui/custom/count-animation.tsx">
        <CountAnimation
          ariaLabel={t("page.showing", { visible: 42, total: 42 })}
          className="text-primary text-4xl font-semibold tabular-nums"
          number={42}
        />
      </DemoFrame>

      <DemoFrame title="UserAvatar" source="components/ui/custom/user-avatar.tsx">
        <div aria-label={t("samples.labels.status")} className="flex flex-wrap gap-6" role="group">
          <figure className="space-y-2 text-center">
            <UserAvatar fallback={t("samples.options.admin")} indicator="success" />
            <figcaption className="text-muted-foreground text-xs">
              {t("samples.states.success")}
            </figcaption>
          </figure>
          <figure className="space-y-2 text-center">
            <UserAvatar fallback={t("samples.options.editor")} indicator="warning" />
            <figcaption className="text-muted-foreground text-xs">
              {t("samples.states.warning")}
            </figcaption>
          </figure>
          <figure className="space-y-2 text-center">
            <UserAvatar fallback={t("samples.options.viewer")} indicator="danger" />
            <figcaption className="text-muted-foreground text-xs">
              {t("samples.states.destructive")}
            </figcaption>
          </figure>
        </div>
      </DemoFrame>
    </DemoCategorySection>
  );
}
