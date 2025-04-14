"use client";

import { useAppSelector } from "@/lib/hooks";
import { ProcessStatus } from "@/lib/definitions";
import ProcessGanttChart from "@/components/process-gantt-chart";
import { cn } from "@/lib/utils";

const GanttChart = ({ className }: { className?: string }) => {
  const { processes } = useAppSelector(state => state.processes);
  const filteredProcesses = processes.filter(p => p.status === ProcessStatus.COMPLETED || p.status === ProcessStatus.RUNNING);

  return (
    <div className={cn("space-y-2 px-4", className)}>
      <h4 className="text-md font-medium">Gantt Chart</h4>
      {filteredProcesses.length === 0
        ? (
          <div
            className="h-28 border border-dashed rounded-md flex items-center justify-center bg-muted/20">
            <p className="text-muted-foreground text-sm">No processes to visualize</p>
          </div>
        )
        : <ProcessGanttChart />
      }
    </div>
  );
};

export default GanttChart;
