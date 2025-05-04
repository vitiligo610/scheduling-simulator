"use client";

import { useMemo } from "react";
import { ChartPie } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAppSelector } from "@/lib/hooks";

interface ChartDatatype {
  process: string;
  duration: number;
  fill: string;
}

const ProcessPieChart = () => {
  const { processes } = useAppSelector(state => state.processes);
  const totalCpuTime = useAppSelector(state => state.scheduler.currentTime);

  const chartData: ChartDatatype[] = useMemo(() => {
    const processSlices = processes.map((process) => ({
      process: `P${process.id}`,
      duration: process.burstTime,
      fill: process.color,
    }));

    const totalBurstTime = processSlices.reduce((acc, curr) => acc + curr.duration, 0);

    if (totalCpuTime > totalBurstTime) {
      processSlices.push({
        process: "Idle",
        duration: totalCpuTime - totalBurstTime,
        fill: "hsl(44,84%,67%)",
      });
    }

    return processSlices;
  }, [processes, totalCpuTime]);

  const totalDuration = chartData.reduce((acc, curr) => acc + curr.duration, 0);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};

    chartData.forEach((item) => {
      config[item.process] = {
        label: item.process,
        color: item.fill,
      };
    });

    return config;
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>CPU Process Time</CardTitle>
        <CardDescription>Distribution of Burst Times</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="duration"
              nameKey="process"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalDuration.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          CPU Time
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          CPU utilized across processes <ChartPie className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on scheduler&#39;s computed burst times
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProcessPieChart;