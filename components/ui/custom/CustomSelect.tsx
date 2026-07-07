"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
  misc?: any;
}

interface CustomSelectProps {
  options: Option[];
  /** Controlled selection. When provided, the rendered value tracks this prop
   *  and internal state is bypassed. Takes precedence over defaultValue. */
  value?: string;
  /** Uncontrolled initial/seed value. Re-syncs internal state when it changes.
   *  Ignored when `value` is set. */
  defaultValue?: string;
  onValueChange: (option: Option | null) => void;
  placeholder?: string;
  disabled?: boolean;
  showClear?: boolean;
  id?: string;
  "data-qa"?: string;
}

export function CustomSelect({
  options,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  placeholder,
  disabled = false,
  showClear = true,
  id,
  "data-qa": dataQa
}: CustomSelectProps) {
  const t = useTranslations("Common");
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  React.useEffect(() => {
    // Only the uncontrolled path re-seeds from defaultValue; controlled callers
    // own the value entirely.
    if (!isControlled) setInternalValue(defaultValue);
  }, [defaultValue, isControlled]);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  const handleSelect = (selectedValue: string) => {
    const newValue = value === selectedValue ? "" : selectedValue;
    if (!isControlled) setInternalValue(newValue);
    const selectedOption = options.find((option) => option.value === newValue);
    onValueChange(selectedOption || null);
    setOpen(false);
  };

  return (
    <div className="relative flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            data-qa={dataQa}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={selectedLabel ?? (placeholder ?? t("select.placeholder"))}
            className={cn("w-full justify-between", value && showClear && "pr-16")}
            disabled={disabled}>
            <span className="truncate">{selectedLabel ?? (placeholder ?? t("select.placeholder"))}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <Command>
            <CommandInput placeholder={t("select.searchPlaceholder")} />
            <CommandEmpty>{t("select.noOptions")}</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  value={option.value}
                  keywords={[option.label]}
                  onSelect={() => handleSelect(option.value)}>
                  <Check
                    className={cn("mr-2 size-4", value === option.value ? "opacity-100" : "opacity-0")}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {value && showClear && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={t("select.clearSelection")}
          className="absolute right-10 p-0"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!isControlled) setInternalValue("");
            onValueChange(null);
            setOpen(false);
          }}>
          <X className="size-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
