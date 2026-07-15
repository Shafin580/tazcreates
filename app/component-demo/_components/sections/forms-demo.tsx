"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AtSign, Bell, Bold, Italic, Search, Underline } from "lucide-react";
import type { DateRange } from "react-day-picker";

import {
  DatePicker,
  DateRangePicker,
  type DatePickerLabels,
  type DateRangePickerLabels
} from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from "@/components/ui/combobox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption
} from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQaId } from "@/hooks/use-qa-id";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

const DEMO_DATE = new Date(2026, 6, 15);
const DEMO_DATE_RANGE: DateRange = {
  from: new Date(2026, 6, 10),
  to: new Date(2026, 6, 15)
};

export function FormDemos() {
  const t = useTranslations("ComponentDemo");
  const datePickerT = useTranslations("Common.datePicker");
  const locale = useLocale();
  const checkbox = useQaId("component-demo.checkbox.terms");
  const combobox = useQaId("component-demo.combobox.role");
  const field = useQaId("component-demo.field.email");
  const groupedInput = useQaId("component-demo.input-group.search");
  const otp = useQaId("component-demo.input-otp.code");
  const input = useQaId("component-demo.input.email");
  const labeledInput = useQaId("component-demo.label.name");
  const nativeSelect = useQaId("component-demo.native-select.role");
  const radioAdmin = useQaId("component-demo.radio.admin");
  const radioEditor = useQaId("component-demo.radio.editor");
  const radioViewer = useQaId("component-demo.radio.viewer");
  const select = useQaId("component-demo.select.department");
  const switchControl = useQaId("component-demo.switch.notifications");
  const textarea = useQaId("component-demo.textarea.message");

  const [date, setDate] = useState<Date | undefined>(DEMO_DATE);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(DEMO_DATE_RANGE);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [role, setRole] = useState(t("samples.options.editor"));
  const [fieldValue, setFieldValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [nativeRole, setNativeRole] = useState("editor");
  const [radioRole, setRadioRole] = useState("editor");
  const [department, setDepartment] = useState("engineering");
  const [volume, setVolume] = useState([45]);
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState("");
  const [format, setFormat] = useState("bold");
  const [pressed, setPressed] = useState(false);

  const fieldInvalid = fieldValue.length > 0 && !fieldValue.includes("@");
  const roles = [
    t("samples.options.admin"),
    t("samples.options.editor"),
    t("samples.options.viewer")
  ];
  const datePickerLabels: DatePickerLabels = {
    date: datePickerT("date"),
    dateFormat: datePickerT("dateFormat"),
    invalidDate: datePickerT("invalidDate"),
    selectDate: datePickerT("selectDate")
  };
  const dateRangePickerLabels: DateRangePickerLabels = {
    dateFormat: datePickerT("dateFormat"),
    endDate: datePickerT("endDate"),
    invalidDate: datePickerT("invalidDate"),
    invalidRange: datePickerT("invalidRange"),
    selectRange: datePickerT("selectRange"),
    startDate: datePickerT("startDate")
  };

  return (
    <DemoCategorySection category="forms">
      <DemoFrame
        previewClassName="grid w-full max-w-2xl gap-4 sm:grid-cols-2"
        title="Calendar"
        source="components/ui/calendar.tsx"
        wide>
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium">{datePickerT("date")}</p>
          <DatePicker
            calendarProps={{ defaultMonth: DEMO_DATE }}
            displayLocale={locale}
            labels={datePickerLabels}
            onSelect={setDate}
            qaPrefix="component-demo.calendar.single"
            selected={date}
          />
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium">{datePickerT("selectRange")}</p>
          <DateRangePicker
            calendarProps={{ defaultMonth: DEMO_DATE_RANGE.from }}
            displayLocale={locale}
            labels={dateRangePickerLabels}
            onSelect={setDateRange}
            qaPrefix="component-demo.calendar.range"
            selected={dateRange}
          />
        </div>
      </DemoFrame>

      <DemoFrame title="Checkbox" source="components/ui/checkbox.tsx">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              {...checkbox}
              aria-label={t("samples.labels.terms")}
              checked={termsAccepted}
              onCheckedChange={(value) => setTermsAccepted(Boolean(value))}
            />
            <Label htmlFor={checkbox.id}>{t("samples.labels.terms")}</Label>
          </div>
          <div className="flex items-center gap-2 opacity-70">
            <Checkbox
              aria-label={t("samples.states.disabled")}
              data-qa="component-demo.checkbox.disabled"
              disabled
            />
            <Label>{t("samples.states.disabled")}</Label>
          </div>
          <p aria-live="polite" className="text-muted-foreground text-xs">
            {termsAccepted ? t("samples.states.checked") : t("samples.states.default")}
          </p>
        </div>
      </DemoFrame>

      <DemoFrame title="Combobox" source="components/ui/combobox.tsx">
        <div className="max-w-sm space-y-2">
          <Label htmlFor={combobox.id}>{t("samples.labels.role")}</Label>
          <Combobox items={roles} onValueChange={(value) => setRole(value ?? "")} value={role}>
            <ComboboxInput
              {...combobox}
              aria-label={t("samples.labels.role")}
              placeholder={t("samples.actions.search")}
              showTrigger={false}>
              <InputGroupAddon align="inline-end">
                <ComboboxTrigger
                  aria-label={t("samples.actions.open")}
                  className="p-1"
                  data-qa="component-demo.combobox.open"
                />
              </InputGroupAddon>
            </ComboboxInput>
            <ComboboxContent>
              <ComboboxEmpty>{t("samples.content.emptyTitle")}</ComboboxEmpty>
              <ComboboxList>
                {roles.map((option, index) => (
                  <ComboboxItem
                    aria-label={option}
                    data-qa={`component-demo.combobox.option.${index + 1}`}
                    key={option}
                    value={option}>
                    {option}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <p aria-live="polite" className="text-muted-foreground min-h-4 text-xs">
            {role}
          </p>
        </div>
      </DemoFrame>

      <DemoFrame title="Field" source="components/ui/field.tsx">
        <FieldSet>
          <FieldLegend>{t("samples.content.title")}</FieldLegend>
          <FieldGroup>
            <Field data-invalid={fieldInvalid}>
              <FieldLabel htmlFor={field.id}>{t("samples.labels.email")}</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  aria-invalid={fieldInvalid}
                  aria-label={t("samples.labels.email")}
                  onChange={(event) => setFieldValue(event.target.value)}
                  placeholder={t("samples.labels.email")}
                  type="email"
                  value={fieldValue}
                />
                <FieldDescription>{t("samples.content.shortDescription")}</FieldDescription>
                <FieldError>
                  {fieldInvalid ? t("samples.content.errorDescription") : null}
                </FieldError>
              </FieldContent>
            </Field>
            <FieldSeparator>{t("samples.content.shortDescription")}</FieldSeparator>
            <Field orientation="horizontal">
              <Checkbox
                aria-label={t("samples.labels.notifications")}
                data-qa="component-demo.field.notifications"
              />
              <FieldContent>
                <FieldTitle>{t("samples.labels.notifications")}</FieldTitle>
                <FieldDescription>{t("samples.content.description")}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </DemoFrame>

      <DemoFrame title="InputGroup" source="components/ui/input-group.tsx">
        <div className="max-w-sm space-y-2">
          <Label htmlFor={groupedInput.id}>{t("samples.labels.search")}</Label>
          <InputGroup>
            <InputGroupAddon>
              <AtSign aria-hidden="true" />
              <InputGroupText>{t("samples.labels.account")}</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              {...groupedInput}
              aria-label={t("samples.labels.search")}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={t("samples.labels.search")}
              value={searchValue}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label={t("samples.actions.search")}
                data-qa="component-demo.input-group.submit"
                onClick={() => setSearchValue("")}
                size="icon-xs">
                <Search aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </DemoFrame>

      <DemoFrame title="InputOTP" source="components/ui/input-otp.tsx">
        <div className="space-y-3">
          <Label htmlFor={otp.id}>{t("samples.labels.oneTimeCode")}</Label>
          <InputOTP
            {...otp}
            aria-label={t("samples.labels.oneTimeCode")}
            maxLength={6}
            onChange={setOtpValue}
            value={otpValue}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p aria-live="polite" className="text-muted-foreground min-h-4 font-mono text-xs">
            {otpValue}
          </p>
        </div>
      </DemoFrame>

      <DemoFrame title="Input" source="components/ui/input.tsx">
        <div className="max-w-sm space-y-2">
          <Label htmlFor={input.id}>{t("samples.labels.email")}</Label>
          <Input
            {...input}
            aria-label={t("samples.labels.email")}
            autoComplete="email"
            placeholder={t("samples.labels.email")}
            type="email"
          />
          <Input
            aria-label={t("samples.states.disabled")}
            data-qa="component-demo.input.disabled"
            disabled
            placeholder={t("samples.states.disabled")}
          />
        </div>
      </DemoFrame>

      <DemoFrame title="Label" source="components/ui/label.tsx">
        <div className="max-w-sm space-y-2">
          <Label htmlFor={labeledInput.id}>{t("samples.labels.name")}</Label>
          <Input
            {...labeledInput}
            aria-label={t("samples.labels.name")}
            placeholder={t("samples.labels.name")}
          />
          <Label className="text-muted-foreground">{t("samples.content.shortDescription")}</Label>
        </div>
      </DemoFrame>

      <DemoFrame title="NativeSelect" source="components/ui/native-select.tsx">
        <div className="space-y-2">
          <Label htmlFor={nativeSelect.id}>{t("samples.labels.role")}</Label>
          <NativeSelect
            {...nativeSelect}
            aria-label={t("samples.labels.role")}
            className="w-full max-w-sm"
            onChange={(event) => setNativeRole(event.target.value)}
            value={nativeRole}>
            <NativeSelectOptGroup label={t("samples.labels.role")}>
              <NativeSelectOption value="admin">{t("samples.options.admin")}</NativeSelectOption>
              <NativeSelectOption value="editor">{t("samples.options.editor")}</NativeSelectOption>
              <NativeSelectOption value="viewer">{t("samples.options.viewer")}</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </div>
      </DemoFrame>

      <DemoFrame title="RadioGroup" source="components/ui/radio-group.tsx">
        <RadioGroup
          aria-label={t("samples.labels.role")}
          data-qa="component-demo.radio-group.role"
          onValueChange={setRadioRole}
          value={radioRole}>
          <div className="flex items-center gap-2">
            <RadioGroupItem {...radioAdmin} aria-label={t("samples.options.admin")} value="admin" />
            <Label htmlFor={radioAdmin.id}>{t("samples.options.admin")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              {...radioEditor}
              aria-label={t("samples.options.editor")}
              value="editor"
            />
            <Label htmlFor={radioEditor.id}>{t("samples.options.editor")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              {...radioViewer}
              aria-label={t("samples.options.viewer")}
              value="viewer"
            />
            <Label htmlFor={radioViewer.id}>{t("samples.options.viewer")}</Label>
          </div>
        </RadioGroup>
      </DemoFrame>

      <DemoFrame title="Select" source="components/ui/select.tsx">
        <div className="max-w-sm space-y-2">
          <Label htmlFor={select.id}>{t("samples.options.engineering")}</Label>
          <Select onValueChange={setDepartment} value={department}>
            <SelectTrigger
              {...select}
              aria-label={t("samples.options.engineering")}
              className="w-full">
              <SelectValue placeholder={t("samples.actions.select")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("samples.labels.role")}</SelectLabel>
                <SelectItem
                  aria-label={t("samples.options.engineering")}
                  data-qa="component-demo.select.engineering"
                  value="engineering">
                  {t("samples.options.engineering")}
                </SelectItem>
                <SelectItem
                  aria-label={t("samples.options.design")}
                  data-qa="component-demo.select.design"
                  value="design">
                  {t("samples.options.design")}
                </SelectItem>
                <SelectSeparator />
                <SelectItem
                  aria-label={t("samples.options.marketing")}
                  data-qa="component-demo.select.marketing"
                  value="marketing">
                  {t("samples.options.marketing")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </DemoFrame>

      <DemoFrame title="Slider" source="components/ui/slider.tsx">
        <div className="max-w-sm space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Label>{t("samples.labels.volume")}</Label>
            <output className="text-muted-foreground text-xs">{volume[0]}</output>
          </div>
          <Slider
            aria-label={t("samples.labels.volume")}
            data-qa="component-demo.slider.volume"
            max={100}
            onValueChange={setVolume}
            step={5}
            value={volume}
          />
        </div>
      </DemoFrame>

      <DemoFrame title="Switch" source="components/ui/switch.tsx">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor={switchControl.id}>{t("samples.labels.notifications")}</Label>
            <Switch
              {...switchControl}
              aria-label={t("samples.labels.notifications")}
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <p aria-live="polite" className="text-muted-foreground text-xs">
            {notifications ? t("samples.options.active") : t("samples.options.inactive")}
          </p>
        </div>
      </DemoFrame>

      <DemoFrame title="Textarea" source="components/ui/textarea.tsx">
        <div className="max-w-sm space-y-2">
          <Label htmlFor={textarea.id}>{t("samples.labels.message")}</Label>
          <Textarea
            {...textarea}
            aria-label={t("samples.labels.message")}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t("samples.content.description")}
            value={message}
          />
          <p className="text-muted-foreground text-end text-xs">{message.length}</p>
        </div>
      </DemoFrame>

      <DemoFrame title="ToggleGroup" source="components/ui/toggle-group.tsx">
        <ToggleGroup
          aria-label={t("samples.content.title")}
          data-qa="component-demo.toggle-group.format"
          onValueChange={(value) => value && setFormat(value)}
          type="single"
          value={format}
          variant="outline">
          <ToggleGroupItem
            aria-label={t("samples.options.optionOne")}
            data-qa="component-demo.toggle-group.bold"
            value="bold">
            <Bold aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label={t("samples.options.optionTwo")}
            data-qa="component-demo.toggle-group.italic"
            value="italic">
            <Italic aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label={t("samples.options.optionThree")}
            data-qa="component-demo.toggle-group.underline"
            value="underline">
            <Underline aria-hidden="true" />
          </ToggleGroupItem>
        </ToggleGroup>
      </DemoFrame>

      <DemoFrame title="Toggle" source="components/ui/toggle.tsx">
        <div className="flex items-center gap-3">
          <Toggle
            aria-label={t("samples.labels.notifications")}
            data-qa="component-demo.toggle.notifications"
            onPressedChange={setPressed}
            pressed={pressed}
            variant="outline">
            <Bell aria-hidden="true" data-icon="inline-start" />
            {t("samples.labels.notifications")}
          </Toggle>
          <span aria-live="polite" className="text-muted-foreground text-xs">
            {pressed ? t("samples.states.checked") : t("samples.states.default")}
          </span>
        </div>
      </DemoFrame>
    </DemoCategorySection>
  );
}
