"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
type IconSize = "sm" | "md" | "lg";

const sizeMap: Record<IconSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6"
};

type IconTooltipButtonProps = {
  tooltip?: string | React.ReactNode;
  icon: React.ReactNode;
  iconSize?: IconSize;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  tooltipClassName?: string;
  disabled?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  "data-qa"?: string;
} & Pick<React.AriaAttributes, "aria-label" | "aria-expanded" | "aria-pressed" | "aria-controls">;

export function IconTooltipButton({
  tooltip,
  icon,
  iconSize = "md",
  onClick,
  className = "",
  tooltipClassName = "",
  disabled = false,
  side = "bottom",
  "data-qa": dataQa,
  ...ariaProps
}: IconTooltipButtonProps) {
  const t = useTranslations("Common");
  const button = (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-qa={dataQa}
      {...ariaProps}>
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any, any>, {
            className:
              `${sizeMap[iconSize]} ${(icon as React.ReactElement<any, any>).props.className ?? ""}`.trim()
          })
        : icon}
    </Button>
  );

  if (disabled) {
    return button;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={side} className={tooltipClassName}>
          {tooltip ?? t("fieldDefaults.actionTooltip")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
