"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

export function OverlayDemos() {
  const t = useTranslations("ComponentDemo");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownNotifications, setDropdownNotifications] = useState(true);
  const [hoverCardOpen, setHoverCardOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <DemoCategorySection category="overlays">
      <DemoFrame title="AlertDialog" source="components/ui/alert-dialog.tsx">
        <AlertDialog onOpenChange={setAlertDialogOpen} open={alertDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              aria-haspopup="dialog"
              data-qa="component-demo.overlays.alert-dialog.trigger"
              variant="destructive">
              {t("samples.actions.delete")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("samples.content.alertTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("samples.content.alertDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-qa="component-demo.overlays.alert-dialog.cancel">
                {t("samples.actions.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                data-qa="component-demo.overlays.alert-dialog.confirm"
                variant="destructive">
                {t("samples.actions.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DemoFrame>

      <DemoFrame title="Command" source="components/ui/command.tsx">
        <Button
          aria-haspopup="dialog"
          data-qa="component-demo.overlays.command.trigger"
          onClick={() => setCommandOpen(true)}
          variant="outline">
          {t("samples.actions.search")}
        </Button>
        <CommandDialog
          description={t("samples.content.dialogDescription")}
          onOpenChange={setCommandOpen}
          open={commandOpen}
          title={t("samples.actions.search")}>
          <Command>
            <CommandInput
              aria-label={t("samples.labels.search")}
              data-qa="component-demo.overlays.command.input"
              placeholder={t("samples.labels.search")}
            />
            <CommandList>
              <CommandEmpty>{t("samples.content.emptyTitle")}</CommandEmpty>
              <CommandGroup heading={t("samples.actions.select")}>
                <CommandItem
                  data-qa="component-demo.overlays.command.option-one"
                  onSelect={() => setCommandOpen(false)}>
                  {t("samples.options.optionOne")}
                </CommandItem>
                <CommandItem
                  data-qa="component-demo.overlays.command.option-two"
                  onSelect={() => setCommandOpen(false)}>
                  {t("samples.options.optionTwo")}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </DemoFrame>

      <DemoFrame title="ContextMenu" source="components/ui/context-menu.tsx">
        <ContextMenu onOpenChange={setContextMenuOpen} open={contextMenuOpen}>
          <ContextMenuTrigger asChild>
            <button
              aria-haspopup="menu"
              className="bg-muted hover:bg-muted/80 focus-visible:ring-ring flex min-h-24 w-full items-center justify-center border p-4 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
              data-qa="component-demo.overlays.context-menu.trigger"
              type="button">
              {t("samples.actions.open")}
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>{t("samples.content.menuDescription")}</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem data-qa="component-demo.overlays.context-menu.edit">
              {t("samples.actions.edit")}
            </ContextMenuItem>
            <ContextMenuItem data-qa="component-demo.overlays.context-menu.share">
              {t("samples.actions.share")}
            </ContextMenuItem>
            <ContextMenuItem
              data-qa="component-demo.overlays.context-menu.delete"
              variant="destructive">
              {t("samples.actions.delete")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </DemoFrame>

      <DemoFrame title="Dialog" source="components/ui/dialog.tsx">
        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogTrigger asChild>
            <Button
              aria-haspopup="dialog"
              data-qa="component-demo.overlays.dialog.trigger"
              variant="outline">
              {t("samples.actions.open")}
            </Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{t("samples.content.dialogTitle")}</DialogTitle>
              <DialogDescription>{t("samples.content.dialogDescription")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button data-qa="component-demo.overlays.dialog.close" variant="outline">
                  {t("samples.actions.close")}
                </Button>
              </DialogClose>
              <Button
                data-qa="component-demo.overlays.dialog.save"
                onClick={() => setDialogOpen(false)}>
                {t("samples.actions.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoFrame>

      <DemoFrame title="Drawer" source="components/ui/drawer.tsx">
        <Drawer onOpenChange={setDrawerOpen} open={drawerOpen}>
          <DrawerTrigger asChild>
            <Button
              aria-haspopup="dialog"
              data-qa="component-demo.overlays.drawer.trigger"
              variant="outline">
              {t("samples.actions.open")}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t("samples.content.title")}</DrawerTitle>
              <DrawerDescription>{t("samples.content.drawerDescription")}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                data-qa="component-demo.overlays.drawer.continue"
                onClick={() => setDrawerOpen(false)}>
                {t("samples.actions.continue")}
              </Button>
              <DrawerClose asChild>
                <Button data-qa="component-demo.overlays.drawer.close" variant="outline">
                  {t("samples.actions.close")}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </DemoFrame>

      <DemoFrame title="DropdownMenu" source="components/ui/dropdown-menu.tsx">
        <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="menu"
              data-qa="component-demo.overlays.dropdown-menu.trigger"
              variant="outline">
              {t("samples.actions.select")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t("samples.content.menuDescription")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={dropdownNotifications}
              data-qa="component-demo.overlays.dropdown-menu.notifications"
              onCheckedChange={(checked) => setDropdownNotifications(checked === true)}>
              {t("samples.labels.notifications")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuItem data-qa="component-demo.overlays.dropdown-menu.edit">
              {t("samples.actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              data-qa="component-demo.overlays.dropdown-menu.delete"
              variant="destructive">
              {t("samples.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DemoFrame>

      <DemoFrame title="HoverCard" source="components/ui/hover-card.tsx">
        <HoverCard onOpenChange={setHoverCardOpen} open={hoverCardOpen}>
          <HoverCardTrigger asChild>
            <Button data-qa="component-demo.overlays.hover-card.trigger" variant="link">
              {t("samples.actions.learnMore")}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="font-medium">{t("samples.content.title")}</p>
            <p className="text-muted-foreground mt-1">{t("samples.content.hoverDescription")}</p>
          </HoverCardContent>
        </HoverCard>
      </DemoFrame>

      <DemoFrame title="Popover" source="components/ui/popover.tsx">
        <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
          <PopoverTrigger asChild>
            <Button
              aria-haspopup="dialog"
              data-qa="component-demo.overlays.popover.trigger"
              variant="outline">
              {t("samples.actions.settings")}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>{t("samples.actions.settings")}</PopoverTitle>
              <PopoverDescription>{t("samples.content.popoverDescription")}</PopoverDescription>
            </PopoverHeader>
            <Button
              data-qa="component-demo.overlays.popover.close"
              onClick={() => setPopoverOpen(false)}
              size="sm">
              {t("samples.actions.continue")}
            </Button>
          </PopoverContent>
        </Popover>
      </DemoFrame>

      <DemoFrame title="Sheet" source="components/ui/sheet.tsx">
        <Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
          <SheetTrigger asChild>
            <Button
              aria-haspopup="dialog"
              data-qa="component-demo.overlays.sheet.trigger"
              variant="outline">
              {t("samples.actions.open")}
            </Button>
          </SheetTrigger>
          <SheetContent showCloseButton={false} side="right">
            <SheetHeader>
              <SheetTitle>{t("samples.content.title")}</SheetTitle>
              <SheetDescription>{t("samples.content.sheetDescription")}</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button
                data-qa="component-demo.overlays.sheet.save"
                onClick={() => setSheetOpen(false)}>
                {t("samples.actions.save")}
              </Button>
              <SheetClose asChild>
                <Button data-qa="component-demo.overlays.sheet.close" variant="outline">
                  {t("samples.actions.close")}
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </DemoFrame>

      <DemoFrame title="Tooltip" source="components/ui/tooltip.tsx">
        <Tooltip onOpenChange={setTooltipOpen} open={tooltipOpen}>
          <TooltipTrigger asChild>
            <Button data-qa="component-demo.overlays.tooltip.trigger" variant="outline">
              {t("samples.actions.learnMore")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("samples.content.tooltip")}</TooltipContent>
        </Tooltip>
      </DemoFrame>
    </DemoCategorySection>
  );
}
