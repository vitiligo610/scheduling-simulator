"use client";

import { useAppSelector } from "@/lib/hooks";
import { ProcessStatus } from "@/lib/definitions";
import { Progress } from "@/components/ui/progress";
import React from "react";

const ProcessProgress = () => {
  const { processes } = useAppSelector(state => state.processes);

  if (!processes || processes.length === 0) {
    return (
      <div className="space-y-2 px-4">
        <h4 className="text-md font-medium">Process Progress</h4>
        <div
          className="h-28 border border-dashed rounded-md flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground text-sm">No processes to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4">
      <h4 className="text-md font-medium">Process Progress</h4>
      <div className="space-y-4 pr-2 minimal-scrollbar">
        {processes.map((process) => {
          const progressPercentage = Math.max(
            0,
            Math.min(100, Math.round(((process.burstTime - process.remainingTime) / process.burstTime) * 100)),
          );

          const statusStyles = {
            [ProcessStatus.RUNNING]: "animate-pulse text-emerald-400",
            [ProcessStatus.READY]: "text-blue-400",
            [ProcessStatus.WAITING]: "text-amber-400",
            [ProcessStatus.COMPLETED]: "text-slate-400",
          };

          return (
            <div key={process.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{process.name}</span>
                  <span className={`text-xs ${statusStyles[process.status]}`}>
                    {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
                  </span>
                </div>
                <span className="text-sm">{progressPercentage}%</span>
              </div>

              <div className="relative">
                <Progress
                  value={progressPercentage}
                  className="h-2"
                  style={
                    {
                      "--progress-foreground": process.color,
                    } as React.CSSProperties
                  }
                  aria-label={`${process.name} progress: ${progressPercentage}%`}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Burst: {process.burstTime}s</span>
                <span>Remaining: {process.remainingTime}s</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessProgress;
