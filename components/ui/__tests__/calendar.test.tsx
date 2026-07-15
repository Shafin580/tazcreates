import * as React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import type { DateRange } from "react-day-picker";

import {
  DatePicker,
  DateRangePicker,
  type DatePickerLabels,
  type DatePickerProps,
  type DateRangePickerLabels,
  type DateRangePickerProps
} from "../calendar";

const mockUseIsMobile = jest.fn(() => false);

jest.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => mockUseIsMobile()
}));

beforeEach(() => {
  mockUseIsMobile.mockReturnValue(false);
});

const singleLabels: DatePickerLabels = {
  date: "Date",
  dateFormat: "DD/MM/YYYY",
  invalidDate: "Enter a valid date.",
  selectDate: "Select a date"
};

const rangeLabels: DateRangePickerLabels = {
  dateFormat: "DD/MM/YYYY",
  endDate: "End date",
  invalidDate: "Enter a valid date.",
  invalidRange: "End date must be on or after the start date.",
  selectRange: "Select a date range",
  startDate: "Start date"
};

const july = (day: number) => new Date(2026, 6, day);

type SingleHarnessProps = {
  disabledDates?: DatePickerProps["disabledDates"];
  initialDate?: Date;
  onChange?: (date: Date | undefined) => void;
};

function SingleHarness({ disabledDates, initialDate, onChange }: SingleHarnessProps) {
  const [selected, setSelected] = React.useState(initialDate);

  return (
    <DatePicker
      calendarProps={{ defaultMonth: july(1) }}
      disabledDates={disabledDates}
      displayLocale="en-US"
      labels={singleLabels}
      onSelect={(nextDate) => {
        onChange?.(nextDate);
        setSelected(nextDate);
      }}
      qaPrefix="calendar-test.single"
      selected={selected}
    />
  );
}

type RangeHarnessProps = {
  calendarProps?: DateRangePickerProps["calendarProps"];
  initialRange?: DateRange;
};

function RangeHarness({
  calendarProps = { defaultMonth: july(1), numberOfMonths: 1 },
  initialRange
}: RangeHarnessProps) {
  const [selected, setSelected] = React.useState<DateRange | undefined>(initialRange);

  return (
    <DateRangePicker
      calendarProps={calendarProps}
      displayLocale="en-US"
      labels={rangeLabels}
      onSelect={setSelected}
      qaPrefix="calendar-test.range"
      selected={selected}
    />
  );
}

function getByQa(qa: string) {
  const element = document.querySelector<HTMLElement>(`[data-qa="${qa}"]`);
  expect(element).not.toBeNull();
  return element as HTMLElement;
}

describe("DatePicker", () => {
  it("renders a closed trigger by default, then opens a labeled text field", async () => {
    const user = userEvent.setup();
    render(<SingleHarness />);

    const trigger = screen.getByRole("button", { name: "Date: Select a date" });
    expect(trigger).toHaveAttribute("data-qa", "calendar-test.single.trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Select a date" });
    const input = screen.getByLabelText("Date");
    expect(dialog).toHaveAttribute("data-qa", "calendar-test.single.popover");
    expect(input).toHaveAttribute("data-qa", "calendar-test.single.input");
    expect(input).toHaveAttribute("placeholder", "DD/MM/YYYY");
    expect(input).toHaveFocus();
    expect(getByQa("calendar-test.single.grid")).toBeInTheDocument();
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it("selects a calendar day without committing the focused input on blur", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SingleHarness onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Date: Select a date" }));
    const input = screen.getByLabelText("Date");
    await user.type(input, "16072026");
    expect(input).toHaveValue("16072026");

    await user.click(getByQa("calendar-test.single.month.2026-07.day.2026-07-15"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(july(15));
    const trigger = screen.getByRole("button", { name: "Date: Jul 15, 2026" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("accepts and normalizes a valid typed date", async () => {
    const user = userEvent.setup();
    render(<SingleHarness />);

    await user.click(screen.getByRole("button", { name: "Date: Select a date" }));
    await user.type(screen.getByLabelText("Date"), "16072026{Enter}");

    const trigger = screen.getByRole("button", { name: "Date: Jul 16, 2026" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(screen.getByLabelText("Date")).toHaveValue("16/07/2026");
  });

  it("keeps the prior selection and announces an invalid typed date", async () => {
    const user = userEvent.setup();
    render(<SingleHarness initialDate={july(15)} />);

    const trigger = screen.getByRole("button", { name: "Date: Jul 15, 2026" });
    await user.click(trigger);
    const input = screen.getByLabelText("Date");
    await user.clear(input);
    await user.type(input, "31022026{Enter}");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid date.");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveTextContent("Jul 15, 2026");
  });

  it("rejects a typed disabled date without changing the prior selection", async () => {
    const user = userEvent.setup();
    render(<SingleHarness disabledDates={july(20)} initialDate={july(15)} />);

    const trigger = screen.getByRole("button", { name: "Date: Jul 15, 2026" });
    await user.click(trigger);
    const input = screen.getByLabelText("Date");
    await user.clear(input);
    await user.type(input, "20072026{Enter}");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid date.");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveTextContent("Jul 15, 2026");
  });

  it("announces junk text without clearing the selected date", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SingleHarness initialDate={july(15)} onChange={onChange} />);

    const trigger = screen.getByRole("button", { name: "Date: Jul 15, 2026" });
    await user.click(trigger);
    const input = screen.getByLabelText("Date");
    await user.clear(input);
    await user.type(input, "notadate{Enter}");

    expect(input).toHaveValue("notadate");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid date.");
    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveTextContent("Jul 15, 2026");
  });

  it("preserves a focused draft across external updates and resynchronizes after editing", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const picker = (selected: Date) => (
      <DatePicker
        calendarProps={{ defaultMonth: july(1) }}
        displayLocale="en-US"
        labels={singleLabels}
        onSelect={onSelect}
        qaPrefix="calendar-test.external"
        selected={selected}
      />
    );
    const { rerender } = render(picker(july(10)));

    await user.click(screen.getByRole("button", { name: "Date: Jul 10, 2026" }));
    const input = screen.getByLabelText("Date");
    await user.clear(input);
    await user.type(input, "active");
    expect(input).toHaveFocus();

    rerender(picker(july(15)));
    expect(input).toHaveFocus();
    expect(input).toHaveValue("active");
    expect(screen.getByRole("button", { name: "Date: Jul 15, 2026" })).toBeInTheDocument();

    await user.tab();
    await waitFor(() => expect(input).toHaveValue("15/07/2026"));
    rerender(picker(july(20)));
    await waitFor(() => expect(input).toHaveValue("20/07/2026"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it.each([
    ["single", "default open", { defaultOpen: true }],
    ["single", "controlled open", { open: true }],
    ["range", "default open", { defaultOpen: true }],
    ["range", "controlled open", { open: true }]
  ] as const)(
    "does not render a %s dialog when disabled with %s",
    (pickerKind, _openKind, openProps) => {
      render(
        pickerKind === "single" ? (
          <DatePicker
            {...openProps}
            disabled
            displayLocale="en-US"
            labels={singleLabels}
            onSelect={jest.fn()}
            qaPrefix="calendar-test.disabled-single"
          />
        ) : (
          <DateRangePicker
            {...openProps}
            disabled
            displayLocale="en-US"
            labels={rangeLabels}
            onSelect={jest.fn()}
            qaPrefix="calendar-test.disabled-range"
          />
        )
      );

      const trigger = screen.getByRole("button", {
        name: pickerKind === "single" ? "Date: Select a date" : "Select a date range"
      });
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    }
  );

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<SingleHarness />);

    const trigger = screen.getByRole("button", { name: "Date: Select a date" });
    await user.click(trigger);
    expect(screen.getByLabelText("Date")).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});

describe("DateRangePicker", () => {
  it("opens with two labeled fields and completes a range through calendar clicks", async () => {
    const user = userEvent.setup();
    render(<RangeHarness />);

    const trigger = screen.getByRole("button", { name: "Select a date range" });
    expect(trigger).toHaveAttribute("data-qa", "calendar-test.range.trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const startInput = screen.getByLabelText("Start date");
    const endInput = screen.getByLabelText("End date");
    expect(startInput).toHaveAttribute("data-qa", "calendar-test.range.start-input");
    expect(endInput).toHaveAttribute("data-qa", "calendar-test.range.end-input");
    expect(startInput).toHaveFocus();

    await user.click(getByQa("calendar-test.range.month.2026-07.day.2026-07-10"));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveTextContent("Jul 10, 2026");

    await user.click(getByQa("calendar-test.range.month.2026-07.day.2026-07-15"));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Jul 10, 2026 – Jul 15, 2026");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("rejects and announces an end date earlier than the start date", async () => {
    const user = userEvent.setup();
    render(<RangeHarness initialRange={{ from: july(10), to: july(15) }} />);

    const trigger = screen.getByRole("button", {
      name: "Select a date range: Jul 10, 2026 – Jul 15, 2026"
    });
    await user.click(trigger);
    const endInput = screen.getByLabelText("End date");
    await user.clear(endInput);
    await user.type(endInput, "09072026{Enter}");

    expect(endInput).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "End date must be on or after the start date."
    );
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveTextContent("Jul 10, 2026 – Jul 15, 2026");
  });

  it("clears and resynchronizes the end when a new start is after it", async () => {
    const user = userEvent.setup();
    render(<RangeHarness initialRange={{ from: july(10), to: july(15) }} />);

    const trigger = screen.getByRole("button", {
      name: "Select a date range: Jul 10, 2026 – Jul 15, 2026"
    });
    await user.click(trigger);
    const startInput = screen.getByLabelText("Start date");
    await user.clear(startInput);
    await user.type(startInput, "20072026{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveTextContent("Jul 20, 2026");
    expect(screen.getByLabelText("Start date")).toHaveValue("20/07/2026");
    expect(screen.getByLabelText("End date")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("normalizes a valid typed end date and closes the popover", async () => {
    const user = userEvent.setup();
    render(<RangeHarness initialRange={{ from: july(10), to: undefined }} />);

    const trigger = screen.getByRole("button", {
      name: "Select a date range: Jul 10, 2026"
    });
    await user.click(trigger);
    await user.type(screen.getByLabelText("End date"), "15072026{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Jul 10, 2026 – Jul 15, 2026");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByLabelText("End date")).toHaveValue("15/07/2026");
  });

  it("renders two desktop month grids and one mobile month grid", async () => {
    const user = userEvent.setup();
    const calendarProps = { defaultMonth: july(1) };
    const { rerender } = render(<RangeHarness calendarProps={calendarProps} />);

    await user.click(screen.getByRole("button", { name: "Select a date range" }));
    const calendar = getByQa("calendar-test.range.grid");
    expect(within(calendar).getAllByRole("grid")).toHaveLength(2);

    mockUseIsMobile.mockReturnValue(true);
    rerender(<RangeHarness calendarProps={calendarProps} />);
    await waitFor(() =>
      expect(within(getByQa("calendar-test.range.grid")).getAllByRole("grid")).toHaveLength(1)
    );
  });

  it("has no detectable accessibility violations while open", async () => {
    const user = userEvent.setup();
    render(<RangeHarness initialRange={{ from: july(10), to: july(15) }} />);

    await user.click(
      screen.getByRole("button", {
        name: "Select a date range: Jul 10, 2026 – Jul 15, 2026"
      })
    );

    expect(screen.getByRole("dialog", { name: "Select a date range" })).toBeInTheDocument();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
