"use client";

import { memo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, generateAvatarFallback } from "@/lib/utils";

export interface EntityCardData {
  title: string;
  subtitle?: string;
  code?: string;
  description?: string;
  imageUrl?: string | null;
  badges?: Array<{ id: number | string; name: string }>;
  active?: boolean;
}

export interface EntityCardProps {
  entity: EntityCardData | null;
  className?: string;
}

const EntityCardInner = memo(function EntityCardInner({
  entity,
  className = "w-80 p-0"
}: {
  entity: EntityCardData;
  className?: string;
}) {
  const { title, subtitle, code, description, imageUrl, badges = [], active } = entity;
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Card className={cn(className, "border-transparent bg-transparent")}>
      <CardContent className="flex items-center gap-3 px-2 py-0.5">
        <div className="relative flex-shrink-0">
          {imageUrl && !imgFailed ? (
            <img
              src={imageUrl}
              alt={`${title} avatar`}
              onError={() => setImgFailed(true)}
              className="ring-accent border-border size-8 rounded-full border-2 object-cover shadow-md ring-2"
            />
          ) : (
            <div className="ring-accent border-border bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold shadow-md ring-2">
              {generateAvatarFallback(title)}
            </div>
          )}
          {active !== undefined && (
            <div
              className={cn(
                "border-background absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border shadow-sm",
                active ? "bg-emerald-500" : "bg-muted-foreground/40"
              )}
            />
          )}
        </div>

        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="flex items-baseline gap-1.5 truncate text-xs leading-none font-semibold">
            <span className="truncate">{title}</span>
            {code && (
              <span className="text-muted-foreground shrink-0 font-mono text-xs font-medium">{code}</span>
            )}
          </div>
          {subtitle && <p className="text-muted-foreground truncate text-xs">{subtitle}</p>}
          {description && <p className="text-muted-foreground truncate text-xs">{description}</p>}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {badges.map((badge) => (
                <Badge
                  key={badge.id}
                  variant="outline"
                  className="border-primary/20 bg-primary/10 text-primary px-2 py-0.5 text-xs">
                  {badge.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export function EntityCard({ entity, className }: EntityCardProps) {
  if (!entity) return null;
  return <EntityCardInner entity={entity} className={className} />;
}
