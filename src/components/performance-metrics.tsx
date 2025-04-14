"use client";

import { useAppSelector } from "@/lib/hooks";

const PerformanceMetrics = ({ summaryView = false }: { summaryView?: boolean; }) => {
  const metrics = useAppSelector(state => state.metrics);

  return (
    <div className="rounded-md border flex flex-col flex-shrink-0">
      <div className="px-4 py-3 border-b">
        <h3 className="text-md font-medium">Performance Metrics</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <div>
          <div className="text-sm text-muted-foreground">Avg. Waiting Time</div>
          <div className="text-lg font-semibold">{metrics.averageWaitingTime.toFixed(2)} s</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Avg. Turnaround Time</div>
          <div className="text-lg font-semibold">{metrics.averageTurnaroundTime.toFixed(2)} s</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">CPU Utilization</div>
          <div className="text-lg font-semibold">{metrics.cpuUtilization.toFixed(2)} %</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Throughput</div>
          <div className="text-lg font-semibold">{metrics.throughput.toFixed(2)} p/s</div>
        </div>
      </div>
      {summaryView && <div className="p-4 pt-0">
        <div className="text-sm text-muted-foreground">Completion Order</div>
        <p className="text-sm font-mono break-all">
          {metrics.completionOrder.length > 0 ? metrics.completionOrder.map(p => `P${p}`).join(" → ") : "N/A"}
        </p>
      </div>}
    </div>
  );
};
export default PerformanceMetrics;
