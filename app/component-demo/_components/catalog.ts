export const demoCategoryOrder = [
  "foundations",
  "forms",
  "navigation",
  "overlays",
  "dataDisplay",
  "layoutFeedback",
  "custom",
  "global",
  "theme"
] as const;

export type DemoCategory = (typeof demoCategoryOrder)[number];

export type DemoCatalogEntry = {
  name: string;
  source: `components/${string}.tsx`;
  category: DemoCategory;
};

export function getDemoId(source: string) {
  return `demo-${source
    .replace(/^components\//, "")
    .replace(/\/index\.tsx$/, "")
    .replace(/\.tsx$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()}`;
}

export const demoCatalog = [
  { name: "Accordion", source: "components/ui/accordion.tsx", category: "navigation" },
  { name: "AlertDialog", source: "components/ui/alert-dialog.tsx", category: "overlays" },
  { name: "Alert", source: "components/ui/alert.tsx", category: "dataDisplay" },
  { name: "AspectRatio", source: "components/ui/aspect-ratio.tsx", category: "foundations" },
  { name: "Avatar", source: "components/ui/avatar.tsx", category: "foundations" },
  { name: "Badge", source: "components/ui/badge.tsx", category: "foundations" },
  { name: "Breadcrumb", source: "components/ui/breadcrumb.tsx", category: "navigation" },
  { name: "ButtonGroup", source: "components/ui/button-group.tsx", category: "foundations" },
  { name: "Button", source: "components/ui/button.tsx", category: "foundations" },
  { name: "Calendar", source: "components/ui/calendar.tsx", category: "forms" },
  { name: "Card", source: "components/ui/card.tsx", category: "foundations" },
  { name: "Carousel", source: "components/ui/carousel.tsx", category: "navigation" },
  { name: "Chart", source: "components/ui/chart.tsx", category: "dataDisplay" },
  { name: "Checkbox", source: "components/ui/checkbox.tsx", category: "forms" },
  { name: "Collapsible", source: "components/ui/collapsible.tsx", category: "navigation" },
  { name: "Combobox", source: "components/ui/combobox.tsx", category: "forms" },
  { name: "Command", source: "components/ui/command.tsx", category: "overlays" },
  { name: "ContextMenu", source: "components/ui/context-menu.tsx", category: "overlays" },
  { name: "Dialog", source: "components/ui/dialog.tsx", category: "overlays" },
  { name: "DirectionProvider", source: "components/ui/direction.tsx", category: "layoutFeedback" },
  { name: "Drawer", source: "components/ui/drawer.tsx", category: "overlays" },
  { name: "DropdownMenu", source: "components/ui/dropdown-menu.tsx", category: "overlays" },
  { name: "Empty", source: "components/ui/empty.tsx", category: "dataDisplay" },
  { name: "Field", source: "components/ui/field.tsx", category: "forms" },
  { name: "HoverCard", source: "components/ui/hover-card.tsx", category: "overlays" },
  { name: "InputGroup", source: "components/ui/input-group.tsx", category: "forms" },
  { name: "InputOTP", source: "components/ui/input-otp.tsx", category: "forms" },
  { name: "Input", source: "components/ui/input.tsx", category: "forms" },
  { name: "Item", source: "components/ui/item.tsx", category: "foundations" },
  { name: "Kbd", source: "components/ui/kbd.tsx", category: "foundations" },
  { name: "Label", source: "components/ui/label.tsx", category: "forms" },
  { name: "Menubar", source: "components/ui/menubar.tsx", category: "navigation" },
  { name: "NativeSelect", source: "components/ui/native-select.tsx", category: "forms" },
  { name: "NavigationMenu", source: "components/ui/navigation-menu.tsx", category: "navigation" },
  { name: "Pagination", source: "components/ui/pagination.tsx", category: "navigation" },
  { name: "Popover", source: "components/ui/popover.tsx", category: "overlays" },
  { name: "Progress", source: "components/ui/progress.tsx", category: "dataDisplay" },
  { name: "RadioGroup", source: "components/ui/radio-group.tsx", category: "forms" },
  { name: "Resizable", source: "components/ui/resizable.tsx", category: "layoutFeedback" },
  { name: "ScrollArea", source: "components/ui/scroll-area.tsx", category: "layoutFeedback" },
  { name: "Select", source: "components/ui/select.tsx", category: "forms" },
  { name: "Separator", source: "components/ui/separator.tsx", category: "foundations" },
  { name: "Sheet", source: "components/ui/sheet.tsx", category: "overlays" },
  { name: "Sidebar", source: "components/ui/sidebar.tsx", category: "layoutFeedback" },
  { name: "Skeleton", source: "components/ui/skeleton.tsx", category: "foundations" },
  { name: "Slider", source: "components/ui/slider.tsx", category: "forms" },
  { name: "Sonner", source: "components/ui/sonner.tsx", category: "layoutFeedback" },
  { name: "Spinner", source: "components/ui/spinner.tsx", category: "foundations" },
  { name: "Switch", source: "components/ui/switch.tsx", category: "forms" },
  { name: "Table", source: "components/ui/table.tsx", category: "dataDisplay" },
  { name: "Tabs", source: "components/ui/tabs.tsx", category: "navigation" },
  { name: "Textarea", source: "components/ui/textarea.tsx", category: "forms" },
  { name: "ToggleGroup", source: "components/ui/toggle-group.tsx", category: "forms" },
  { name: "Toggle", source: "components/ui/toggle.tsx", category: "forms" },
  { name: "Tooltip", source: "components/ui/tooltip.tsx", category: "overlays" },
  { name: "ApiErrorCard", source: "components/ui/custom/ApiErrorCard.tsx", category: "custom" },
  { name: "CardSkeleton", source: "components/ui/custom/CardSkeleton.tsx", category: "custom" },
  { name: "CustomDrawer", source: "components/ui/custom/CustomDrawer.tsx", category: "custom" },
  { name: "CustomSelect", source: "components/ui/custom/CustomSelect.tsx", category: "custom" },
  { name: "DetailSkeleton", source: "components/ui/custom/DetailSkeleton.tsx", category: "custom" },
  { name: "EntityCard", source: "components/ui/custom/EntityCard.tsx", category: "custom" },
  {
    name: "EntityPickerCommand",
    source: "components/ui/custom/EntityPickerCommand.tsx",
    category: "custom"
  },
  {
    name: "FacetedFilterPopover",
    source: "components/ui/custom/FacetedFilterPopover.tsx",
    category: "custom"
  },
  { name: "FormSkeleton", source: "components/ui/custom/FormSkeleton.tsx", category: "custom" },
  {
    name: "IconTooltipButton",
    source: "components/ui/custom/IconTooltipButton.tsx",
    category: "custom"
  },
  {
    name: "IconTooltipDropdownTrigger",
    source: "components/ui/custom/IconTooltipDropdownTrigger.tsx",
    category: "custom"
  },
  { name: "PageHeader", source: "components/ui/custom/PageHeader.tsx", category: "custom" },
  { name: "PageLoader", source: "components/ui/custom/PageLoader.tsx", category: "custom" },
  { name: "PageSkeleton", source: "components/ui/custom/PageSkeleton.tsx", category: "custom" },
  {
    name: "PaginationFooter",
    source: "components/ui/custom/PaginationFooter.tsx",
    category: "custom"
  },
  {
    name: "TableSelectionCounter",
    source: "components/ui/custom/TableSelectionCounter.tsx",
    category: "custom"
  },
  { name: "TableSkeleton", source: "components/ui/custom/TableSkeleton.tsx", category: "custom" },
  {
    name: "CountAnimation",
    source: "components/ui/custom/count-animation.tsx",
    category: "custom"
  },
  { name: "UserAvatar", source: "components/ui/custom/user-avatar.tsx", category: "custom" },
  {
    name: "BackNavigation",
    source: "components/global/BackNavigation/BackNavigation.tsx",
    category: "global"
  },
  { name: "ConfirmModal", source: "components/global/ConfirmModal.tsx", category: "global" },
  {
    name: "DashboardErrorContent",
    source: "components/global/DashboardErrorContent.tsx",
    category: "global"
  },
  { name: "DeviceCheck", source: "components/global/DeviceCheck.tsx", category: "global" },
  { name: "Error500Content", source: "components/global/Error500Content.tsx", category: "global" },
  { name: "ErrorText", source: "components/global/ErrorText.tsx", category: "global" },
  {
    name: "LoadingProvider",
    source: "components/global/Loader/Loader-Context.tsx",
    category: "global"
  },
  {
    name: "LoadingOverlay",
    source: "components/global/Loader/LoadingOverlay.tsx",
    category: "global"
  },
  { name: "Loader Spinner", source: "components/global/Loader/Spinner.tsx", category: "global" },
  { name: "NoDataFound", source: "components/global/NoDataFound/index.tsx", category: "global" },
  { name: "NotFoundContent", source: "components/global/NotFoundContent.tsx", category: "global" },
  {
    name: "PermissionDenied",
    source: "components/global/PermissionDenied/index.tsx",
    category: "global"
  },
  {
    name: "PhoneNumberInputField",
    source: "components/global/PhoneNumberInputField.tsx",
    category: "global"
  },
  { name: "Preview", source: "components/global/Preview.tsx", category: "global" },
  {
    name: "SessionExpiredModal",
    source: "components/global/SessionExpiredModal.tsx",
    category: "global"
  },
  { name: "ThemeSwitch", source: "components/global/ThemeSwitch.tsx", category: "global" },
  {
    name: "WorkInProgressCard",
    source: "components/global/WorkInProgressCard/index.tsx",
    category: "global"
  },
  { name: "LiveTime", source: "components/global/live-time.tsx", category: "global" },
  { name: "PhotoEnlarge", source: "components/global/photo-enlarge.tsx", category: "global" },
  {
    name: "useUnsavedChanges",
    source: "components/global/use-unsaved-changes.tsx",
    category: "global"
  },
  {
    name: "ChartPresetSelector",
    source: "components/theme-customizer/chart-preset-selector.tsx",
    category: "theme"
  },
  {
    name: "ColorModeSelector",
    source: "components/theme-customizer/color-mode-selector.tsx",
    category: "theme"
  },
  {
    name: "ContentLayoutSelector",
    source: "components/theme-customizer/content-layout-selector.tsx",
    category: "theme"
  },
  {
    name: "FontSelector",
    source: "components/theme-customizer/font-selector.tsx",
    category: "theme"
  },
  {
    name: "ThemeCustomizerPanel",
    source: "components/theme-customizer/panel.tsx",
    category: "theme"
  },
  {
    name: "PresetSelector",
    source: "components/theme-customizer/preset-selector.tsx",
    category: "theme"
  },
  {
    name: "ThemeRadiusSelector",
    source: "components/theme-customizer/radius-selector.tsx",
    category: "theme"
  },
  {
    name: "ResetThemeButton",
    source: "components/theme-customizer/reset-theme.tsx",
    category: "theme"
  },
  {
    name: "ThemeScaleSelector",
    source: "components/theme-customizer/scale-selector.tsx",
    category: "theme"
  },
  {
    name: "SidebarModeSelector",
    source: "components/theme-customizer/sidebar-mode-selector.tsx",
    category: "theme"
  },
  { name: "ActiveThemeProvider", source: "components/active-theme.tsx", category: "theme" }
] as const satisfies readonly DemoCatalogEntry[];
