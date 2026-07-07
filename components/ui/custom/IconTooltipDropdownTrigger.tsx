"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8"
};

type IconTooltipDropdownTriggerProps = {
  tooltip?: string;
  icon: React.ReactNode;
  iconSize?: IconSize;
  className?: string;
  disabled?: boolean;
  withTooltip?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  [key: string]: any;
};

export function IconTooltipDropdownTrigger({
  tooltip = "Open menu",
  icon,
  iconSize = "md",
  className = "",
  disabled = false,
  withTooltip = true,
  variant = "ghost",
  children,
  align = "end",
  ...props
}: IconTooltipDropdownTriggerProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Icon-only button must always have an accessible name. Fall back to the
  // tooltip text so consumers can omit `aria-label` when the tooltip already
  // describes the action.
  const accessibleName: string =
    typeof props["aria-label"] === "string" && props["aria-label"].length > 0
      ? props["aria-label"]
      : tooltip;
  const { "aria-label": _ignoredAriaLabel, ...restProps } = props;

  // Decorate the icon so it's not double-announced — the button itself carries
  // the accessible name.
  type IconElement = React.ReactElement<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
    focusable?: boolean | "true" | "false";
  }>;
  const iconEl = React.isValidElement(icon) ? (icon as IconElement) : null;
  const decoratedIcon = iconEl
    ? React.cloneElement(iconEl, {
        className: `${sizeMap[iconSize]} ${iconEl.props.className ?? ""}`.trim(),
        "aria-hidden": iconEl.props["aria-hidden"] ?? true,
        focusable: iconEl.props.focusable ?? false
      })
    : icon;

  const button = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`size-8 p-0 ${className}`}
      disabled={disabled}
      aria-label={accessibleName}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      {...restProps}>
      {decoratedIcon}
    </Button>
  );

  return (
    <DropdownMenu>
      {withTooltip ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip open={tooltipOpen}>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        align={align}
        onClick={() => setTooltipOpen(false)} // ensure it's hidden on dropdown action
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
