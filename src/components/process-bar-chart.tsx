"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAppSelector } from "@/lib/hooks";
import { useMemo } from "react";

interface ChartDataType {
  process: string;
  turnaround: number;
  waiting: number;
}

const chartConfig = {
  turnaround: {
    label: "Turnaround Time ",
    color: "#2563eb",
  },
  waiting: {
    label: "Waiting Time",
    color: "#5ea5f6",
  },
} satisfies ChartConfig;

const ProcessBarChart = () => {
  const { processes } = useAppSelector(state => state.processes);

  const chartData: ChartDataType[] = useMemo(() => {
    return processes.map(process => ({
      process: `P${process.id}`,
      turnaround: process.endTime! - process.arrivalTime,
      waiting: (process.endTime! - process.arrivalTime) - process.burstTime,
    }));
  }, [processes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processes Bar Chart</CardTitle>
        <CardDescription>Turnaround Time & Waiting Time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 0, left: -35, right: 0, bottom: 0 }}>
            <CartesianGrid vertical />
            <XAxis
              dataKey="process"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={{ strokeOpacity: 0.2, strokeWidth: 1 }}
              axisLine={{ strokeOpacity: 0.2, strokeWidth: 1 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Legend />
            <Bar dataKey="turnaround" fill="var(--color-turnaround)" radius={4} />
            <Bar dataKey="waiting" fill="var(--color-waiting)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Comparison of turnaround and waiting times for all scheduled processes
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProcessBarChart;