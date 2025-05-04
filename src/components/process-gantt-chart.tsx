"use client";

import { Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { ProcessStatus, SchedulingAlgorithm } from "@/lib/definitions";

interface ChartItems {
  [key: string]: {
    id: number;
    name: string;
    color: string;
    priority: number;
    segments: number[][];
  };
}

interface GraphMapType {
  [key: string]: string[];
}

interface GraphDataItem {
  id: number;

  [key: `yAxis${number}`]: number[];

  fill: string;
  label: string;
  duration: number;
  priority?: number;
}

const BAR_HEIGHT = 50;
const yAxisPrefix = "yAxis";

const initialData = {
  yAxes: [],
  bars: [],
  graphData: [],
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label, className, dataLoaded }: any) => {
  if (
    !active ||
    !payload ||
    payload.length === 0 ||
    !dataLoaded ||
    label === "" || // Hide for spacers
    payload[0].payload?.color === "transparent"
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-md border bg-popover px-3 py-2 text-sm shadow-md",
        className,
      )}
    >
      <div className="font-medium">{label}</div>
      <div className="text-muted-foreground">
        Duration: <span className="font-semibold">{payload[0]?.payload?.duration} units</span><br />
        {payload[0]?.payload?.priority && <>Priority: <span
          className="font-semibold">{payload[0]?.payload?.priority}</span></>}
      </div>
    </div>
  );
};

export default function GanttChartCard() {
  const [dataAvailable, setDataAvailable] = useState(false);
  const [chartData, setChartData] = useState<ChartItems>({});
  const [maxOverlap, setMaxOverlap] = useState(0);
  const [yAxes, setYAxes] = useState<{ component: React.ReactNode; id: string }[]>(initialData.yAxes);
  const [bars, setBars] = useState<{ component: React.ReactNode; id: string }[]>(initialData.bars);
  const [graphMap, setGraphMap] = useState<GraphMapType>({});
  const [graphData, setGraphData] = useState<GraphDataItem[]>(initialData.graphData);

  const scheduler = useAppSelector(state => state.scheduler);
  const { processes } = useAppSelector(state => state.processes);

  useEffect(() => {
    const interval = setInterval(() => {
      const filteredProcesses = processes.filter(p => p.status === ProcessStatus.COMPLETED || p.status === ProcessStatus.RUNNING);
      if (filteredProcesses.length > 0) setDataAvailable(true);
      else {
        setChartData({});
        setDataAvailable(false);
        setYAxes(initialData.yAxes);
        setBars(initialData.bars);
        setGraphMap({});
        setGraphData(initialData.graphData);
        return;
      }

      const updated = filteredProcesses.reduce((acc, current) => {
        const key = `P${current.id}`;
        if (!acc[key]) {
          acc[key] = {
            id: current.id,
            name: key,
            color: current.color,
            priority: current.priority,
            segments: [],
          };
          acc[key].segments = current.startedAt.map((_, i) => [current.startedAt[i], current.stoppedAt[i] ?? scheduler.currentTime]);
        }
        return acc;
      }, {} as ChartItems);
      setChartData(updated);

      setMaxOverlap(Math.max(
        ...Object.keys(chartData).map((key) => chartData[key].segments.length),
      ));

      Array.from({ length: maxOverlap }, (_, i) => i).forEach((i) => {
        const id = `${yAxisPrefix}${i}`;
        const yaxis = {
          component: <YAxis key={`yaxis-${id}`} yAxisId={id} type="category" hide={i !== 0} dataKey="label"
                            tick={{ fontSize: 14 }}
                            tickLine={{ strokeOpacity: 0.2, strokeWidth: 1 }}
                            axisLine={{ strokeOpacity: 0.2, strokeWidth: 1 }} />,
          id: `yaxis-${id}`,
        };
        setYAxes(prev => [...prev.filter(p => p.id !== `yaxis-${id}`), yaxis]);

        const bar = {
          component: <Bar key={`yaxis-${id}`} yAxisId={id} dataKey={id} radius={[10, 10, 10, 10]}
                          isAnimationActive={true} />,
          id: `yaxis-${id}`,
        };
        setBars(prev => [...prev.filter(p => p.id !== `yaxis-${id}`), bar]);
      });

      Object.keys(chartData).forEach((key) => {
        const obj: GraphDataItem = {
          id: chartData[key].id, fill: "", label: "", duration: 0, priority: undefined,
        };
        const updatedGraphMap = { ...graphMap };
        updatedGraphMap[key] = [];

        obj.duration = 0;
        chartData[key].segments.forEach((entry, i) => {
          obj[`${yAxisPrefix}${i}`] = entry;
          obj.fill = chartData[key].color;
          obj.label = chartData[key].name;
          obj.priority = scheduler.selectedAlgorithm === SchedulingAlgorithm.PRIORITY ? chartData[key].priority : undefined;
          obj.duration += (entry[1] - entry[0]);
          updatedGraphMap[key].push(`${yAxisPrefix}${i}`);
        });

        setGraphMap(updatedGraphMap);
        setGraphData(prev => [...prev.filter(p => p.id !== obj.id), obj]);
      });
    }, 1);

    return () => clearInterval(interval);
  }, [bars, chartData, graphMap, maxOverlap, processes, scheduler.currentTime, scheduler.selectedAlgorithm, yAxes, scheduler.preemptive]);

  return (
    <div style={{ height: (dataAvailable ? Object.keys(chartData).length + 0.5 : 2) * BAR_HEIGHT }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={graphData}
          layout="vertical"
          margin={{ top: 5, right: 0, left: dataAvailable ? -35 : 0, bottom: 5 }}
          className="rounded-md"
          barCategoryGap={20}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="0 0" strokeOpacity={0.2} />
          <XAxis
            type="number"
            domain={[0, "dataMax + 1"]}
            scale="linear"
            tickLine={false}
            axisLine={false}
          />
          {yAxes.map(y => y.component)}
          <Tooltip
            content={<CustomTooltip dataLoaded={dataAvailable} />}
            cursor={false}
          />
          {bars.map(b => b.component)}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
