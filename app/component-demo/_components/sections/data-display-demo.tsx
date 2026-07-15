"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, Inbox, Search } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { DemoCategorySection, DemoFrame } from "../demo-frame";

export function DataDisplayDemos() {
  const t = useTranslations("ComponentDemo");
  const locale = useLocale();
  const [alertAction, setAlertAction] = useState("");
  const [emptyAction, setEmptyAction] = useState("");
  const [progress, setProgress] = useState(64);

  const chartConfig = {
    amount: {
      color: "var(--chart-1)",
      label: t("samples.labels.amount")
    }
  } satisfies ChartConfig;

  const chartData = [
    { amount: 42, label: t("samples.options.design") },
    { amount: 76, label: t("samples.options.engineering") },
    { amount: 54, label: t("samples.options.marketing") }
  ];

  const tableRows = [
    {
      amount: 1280,
      name: t("samples.labels.account"),
      role: t("samples.options.admin"),
      status: t("samples.options.active")
    },
    {
      amount: 860,
      name: t("samples.content.title"),
      role: t("samples.options.editor"),
      status: t("samples.options.active")
    },
    {
      amount: 420,
      name: t("samples.labels.notifications"),
      role: t("samples.options.viewer"),
      status: t("samples.options.inactive")
    }
  ];

  const numberFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });

  return (
    <DemoCategorySection category="dataDisplay">
      <DemoFrame title="Alert" source="components/ui/alert.tsx" wide>
        <div className="grid gap-3 lg:grid-cols-2">
          <Alert>
            <CheckCircle2 aria-hidden="true" />
            <AlertTitle>{t("samples.content.alertTitle")}</AlertTitle>
            <AlertDescription>{t("samples.content.alertDescription")}</AlertDescription>
            <AlertAction>
              <Button
                aria-label={t("samples.actions.confirm")}
                data-qa="component-demo.alert.confirm"
                onClick={() => setAlertAction(t("samples.actions.confirm"))}
                size="xs"
                variant="outline">
                {t("samples.actions.confirm")}
              </Button>
            </AlertAction>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle aria-hidden="true" />
            <AlertTitle>{t("samples.content.errorTitle")}</AlertTitle>
            <AlertDescription>{t("samples.content.errorDescription")}</AlertDescription>
          </Alert>
          <p aria-live="polite" className="text-muted-foreground min-h-4 text-xs lg:col-span-2">
            {alertAction}
          </p>
        </div>
      </DemoFrame>

      <DemoFrame title="Chart" source="components/ui/chart.tsx" wide>
        <ChartContainer
          aria-label={t("samples.labels.amount")}
          className="min-h-56 w-full"
          config={chartConfig}
          data-qa="component-demo.chart.amount"
          role="img">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey="label" tickLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={0} />
          </BarChart>
        </ChartContainer>
      </DemoFrame>

      <DemoFrame title="Empty" source="components/ui/empty.tsx">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{t("samples.content.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("samples.content.emptyDescription")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              aria-label={t("samples.actions.search")}
              data-qa="component-demo.empty.search"
              onClick={() => setEmptyAction(t("samples.actions.search"))}
              variant="outline">
              <Search aria-hidden="true" data-icon="inline-start" />
              {t("samples.actions.search")}
            </Button>
            <span aria-live="polite" className="text-muted-foreground min-h-4 text-xs">
              {emptyAction}
            </span>
          </EmptyContent>
        </Empty>
      </DemoFrame>

      <DemoFrame title="Progress" source="components/ui/progress.tsx">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span>{t("samples.labels.progress")}</span>
            <output aria-live="polite">{progress}%</output>
          </div>
          <Progress
            aria-label={t("samples.labels.progress")}
            data-qa="component-demo.progress.default"
            value={progress}
          />
          <div className="flex gap-2">
            <Button
              aria-label={t("samples.actions.previous")}
              data-qa="component-demo.progress.previous"
              onClick={() => setProgress((value) => Math.max(0, value - 10))}
              size="sm"
              variant="outline">
              {t("samples.actions.previous")}
            </Button>
            <Button
              aria-label={t("samples.actions.next")}
              data-qa="component-demo.progress.next"
              onClick={() => setProgress((value) => Math.min(100, value + 10))}
              size="sm">
              {t("samples.actions.next")}
            </Button>
          </div>
        </div>
      </DemoFrame>

      <DemoFrame title="Table" source="components/ui/table.tsx" wide>
        <Table>
          <TableCaption>{t("samples.content.shortDescription")}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("samples.labels.name")}</TableHead>
              <TableHead>{t("samples.labels.role")}</TableHead>
              <TableHead>{t("samples.labels.status")}</TableHead>
              <TableHead className="text-end">{t("samples.labels.amount")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row) => (
              <TableRow key={`${row.name}-${row.role}`}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <Badge
                    variant={row.status === t("samples.options.active") ? "secondary" : "outline"}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-end tabular-nums">
                  {numberFormatter.format(row.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>{t("samples.labels.amount")}</TableCell>
              <TableCell className="text-end tabular-nums">
                {numberFormatter.format(tableRows.reduce((sum, row) => sum + row.amount, 0))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </DemoFrame>
    </DemoCategorySection>
  );
}
