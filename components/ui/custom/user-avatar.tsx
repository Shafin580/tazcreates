import { Avatar, AvatarFallback, AvatarImage, AvatarIndicator } from "@/components/ui/avatar";
import type { AvatarIndicatorProps } from "@/components/ui/avatar";
import { cn, generateAvatarFallback } from "@/lib/utils";

type AvatarProps = {
  image?: string;
  indicator?: AvatarIndicatorProps["variant"];
  fallback?: string;
  className?: string;
};

export default function UserAvatar({ image, indicator, fallback = "AB", className }: AvatarProps) {
  return (
    <Avatar className={cn("size-12 border", className)}>
      <AvatarImage src={image} alt="avatar image" />
      <AvatarIndicator variant={indicator} />
      <AvatarFallback>{generateAvatarFallback(fallback)}</AvatarFallback>
    </Avatar>
  );
}
