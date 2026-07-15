"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Command,
  MoreHorizontal,
  Settings
} from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarIndicator
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

export function FoundationDemos() {
  const t = useTranslations("ComponentDemo");
  const [lastAction, setLastAction] = useState("");

  const accountInitial = t("samples.labels.account").slice(0, 1).toLocaleUpperCase();
  const nameInitial = t("samples.labels.name").slice(0, 1).toLocaleUpperCase();

  return (
    <DemoCategorySection category="foundations">
      <DemoFrame title="AspectRatio" source="components/ui/aspect-ratio.tsx">
        <AspectRatio className="bg-muted overflow-hidden border" ratio={16 / 9}>
          <div className="from-primary/20 via-primary/5 to-background flex size-full flex-col justify-end bg-gradient-to-br p-4">
            <p className="font-medium">{t("samples.content.title")}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("samples.content.shortDescription")}
            </p>
          </div>
        </AspectRatio>
      </DemoFrame>

      <DemoFrame title="Avatar" source="components/ui/avatar.tsx">
        <div className="flex flex-wrap items-center gap-6">
          <Avatar aria-label={t("samples.labels.account")} size="lg">
            <AvatarFallback>{accountInitial}</AvatarFallback>
            <AvatarBadge aria-hidden="true">
              <Check />
            </AvatarBadge>
          </Avatar>

          <Avatar aria-label={t("samples.labels.name")} size="sm">
            <AvatarFallback>{nameInitial}</AvatarFallback>
            <AvatarIndicator aria-hidden="true" position="top-end" variant="success" />
          </Avatar>

          <AvatarGroup aria-label={t("samples.labels.account")} role="group">
            <Avatar>
              <AvatarFallback>{accountInitial}</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>{nameInitial}</AvatarFallback>
            </Avatar>
            <AvatarGroupCount aria-label={t("samples.content.shortDescription")}>
              +3
            </AvatarGroupCount>
          </AvatarGroup>
        </div>
      </DemoFrame>

      <DemoFrame title="Badge" source="components/ui/badge.tsx">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{t("samples.states.default")}</Badge>
          <Badge variant="secondary">{t("samples.states.secondary")}</Badge>
          <Badge variant="outline">{t("samples.states.outline")}</Badge>
          <Badge variant="destructive">{t("samples.states.destructive")}</Badge>
          <Badge variant="ghost">{t("samples.states.ghost")}</Badge>
          <Badge variant="link">{t("samples.actions.learnMore")}</Badge>
        </div>
      </DemoFrame>

      <DemoFrame title="ButtonGroup" source="components/ui/button-group.tsx">
        <div className="space-y-3">
          <ButtonGroup aria-label={t("samples.content.title")}>
            <Button
              aria-label={t("samples.actions.previous")}
              data-qa="component-demo.button-group.previous"
              onClick={() => setLastAction(t("samples.actions.previous"))}
              size="icon"
              variant="outline">
              <ChevronLeft aria-hidden="true" />
            </Button>
            <ButtonGroupText>{t("samples.content.title")}</ButtonGroupText>
            <ButtonGroupSeparator />
            <Button
              aria-label={t("samples.actions.next")}
              data-qa="component-demo.button-group.next"
              onClick={() => setLastAction(t("samples.actions.next"))}
              size="icon"
              variant="outline">
              <ChevronRight aria-hidden="true" />
            </Button>
          </ButtonGroup>
          <p aria-live="polite" className="text-muted-foreground min-h-4 text-xs">
            {lastAction}
          </p>
        </div>
      </DemoFrame>

      <DemoFrame title="Button" source="components/ui/button.tsx">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            aria-label={t("samples.actions.continue")}
            data-qa="component-demo.button.default"
            onClick={() => setLastAction(t("samples.actions.continue"))}>
            {t("samples.states.default")}
          </Button>
          <Button
            aria-label={t("samples.states.secondary")}
            data-qa="component-demo.button.secondary"
            onClick={() => setLastAction(t("samples.states.secondary"))}
            variant="secondary">
            {t("samples.states.secondary")}
          </Button>
          <Button
            aria-label={t("samples.states.outline")}
            data-qa="component-demo.button.outline"
            onClick={() => setLastAction(t("samples.states.outline"))}
            variant="outline">
            {t("samples.states.outline")}
          </Button>
          <Button
            aria-label={t("samples.states.destructive")}
            data-qa="component-demo.button.destructive"
            onClick={() => setLastAction(t("samples.states.destructive"))}
            variant="destructive">
            {t("samples.states.destructive")}
          </Button>
          <Button
            aria-label={t("samples.actions.settings")}
            data-qa="component-demo.button.icon"
            onClick={() => setLastAction(t("samples.actions.settings"))}
            size="icon"
            variant="ghost">
            <Settings aria-hidden="true" />
          </Button>
          <Button
            aria-label={t("samples.states.disabled")}
            data-qa="component-demo.button.disabled"
            disabled>
            {t("samples.states.disabled")}
          </Button>
        </div>
      </DemoFrame>

      <DemoFrame title="Card" source="components/ui/card.tsx">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{t("samples.content.title")}</CardTitle>
            <CardDescription>{t("samples.content.description")}</CardDescription>
            <CardAction>
              <Button
                aria-label={t("samples.actions.settings")}
                data-qa="component-demo.card.settings"
                onClick={() => setLastAction(t("samples.actions.settings"))}
                size="icon-sm"
                variant="ghost">
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Badge variant="secondary">{t("samples.options.active")}</Badge>
            <span className="text-muted-foreground">{t("samples.content.shortDescription")}</span>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              aria-label={t("samples.actions.cancel")}
              data-qa="component-demo.card.cancel"
              onClick={() => setLastAction(t("samples.actions.cancel"))}
              variant="ghost">
              {t("samples.actions.cancel")}
            </Button>
            <Button
              aria-label={t("samples.actions.save")}
              data-qa="component-demo.card.save"
              onClick={() => setLastAction(t("samples.actions.save"))}>
              {t("samples.actions.save")}
            </Button>
          </CardFooter>
        </Card>
      </DemoFrame>

      <DemoFrame title="Item" source="components/ui/item.tsx">
        <ItemGroup>
          <Item variant="outline">
            <ItemHeader>
              <Badge variant="outline">{t("samples.options.active")}</Badge>
              <span className="text-muted-foreground">{t("samples.labels.status")}</span>
            </ItemHeader>
            <ItemMedia variant="icon">
              <CircleUserRound aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{t("samples.labels.account")}</ItemTitle>
              <ItemDescription>{t("samples.content.description")}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                aria-label={t("samples.actions.edit")}
                data-qa="component-demo.item.edit"
                onClick={() => setLastAction(t("samples.actions.edit"))}
                size="sm"
                variant="outline">
                {t("samples.actions.edit")}
              </Button>
            </ItemActions>
            <ItemFooter>
              <span className="text-muted-foreground">{t("samples.content.shortDescription")}</span>
              <Bell aria-hidden="true" className="text-muted-foreground size-4" />
            </ItemFooter>
          </Item>
          <ItemSeparator />
          <Item size="xs" variant="muted">
            <ItemContent>
              <ItemTitle>{t("samples.options.viewer")}</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </DemoFrame>

      <DemoFrame title="Kbd" source="components/ui/kbd.tsx">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>{t("samples.actions.search")}</span>
          <KbdGroup aria-label={t("samples.actions.search")}>
            <Kbd aria-label={t("samples.actions.search")}>
              <Command aria-hidden="true" />
            </Kbd>
            <span aria-hidden="true">+</span>
            <Kbd>K</Kbd>
          </KbdGroup>
          <span className="text-muted-foreground">{t("samples.content.shortDescription")}</span>
          <Kbd>/</Kbd>
        </div>
      </DemoFrame>

      <DemoFrame title="Separator" source="components/ui/separator.tsx">
        <div className="space-y-4">
          <div>
            <p className="font-medium">{t("samples.content.title")}</p>
            <p className="text-muted-foreground text-xs">{t("samples.content.shortDescription")}</p>
          </div>
          <Separator />
          <div className="flex h-8 items-center gap-3">
            <span>{t("samples.actions.previous")}</span>
            <Separator orientation="vertical" />
            <span>{t("samples.actions.next")}</span>
          </div>
        </div>
      </DemoFrame>

      <DemoFrame title="Skeleton" source="components/ui/skeleton.tsx">
        <div
          aria-label={t("samples.content.loading")}
          className="flex items-center gap-3"
          role="status">
          <Skeleton aria-hidden="true" className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton aria-hidden="true" className="h-3 w-2/5" />
            <Skeleton aria-hidden="true" className="h-3 w-4/5" />
            <Skeleton aria-hidden="true" className="h-3 w-3/5" />
          </div>
        </div>
      </DemoFrame>

      <DemoFrame title="Spinner" source="components/ui/spinner.tsx">
        <div className="flex flex-wrap items-center gap-4">
          <Spinner aria-label={t("samples.content.loading")} data-qa="component-demo.spinner.sm" />
          <Spinner
            aria-label={t("samples.content.loading")}
            className="size-6"
            data-qa="component-demo.spinner.default"
          />
          <Button
            aria-label={t("samples.states.loading")}
            data-qa="component-demo.spinner.button"
            disabled>
            <Spinner aria-hidden="true" />
            {t("samples.states.loading")}
          </Button>
        </div>
      </DemoFrame>
    </DemoCategorySection>
  );
}
