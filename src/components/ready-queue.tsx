"use client";

import { useAppSelector } from "@/lib/hooks";
import { SchedulingAlgorithm } from "@/lib/definitions";
import React from "react";
import { getReadyQueue } from "@/utils/algorithms";

const ReadyQueue = () => {
  const { processes: processesState } = useAppSelector(state => state.processes);
  const scheduler = useAppSelector(state => state.scheduler);

  const processes = getReadyQueue(scheduler.selectedAlgorithm, scheduler.currentTime, processesState);

  let sortByText: string;

  switch (scheduler.selectedAlgorithm) {
    case SchedulingAlgorithm.FCFS:
      sortByText = "Arrival Time";
      break;
    case SchedulingAlgorithm.SJF:
      sortByText = "Burst Time";
      break;
    case SchedulingAlgorithm.PRIORITY:
      sortByText = "Priority";
      break;
    case SchedulingAlgorithm.RR:
      sortByText = "Arrival Time (Round Robin)";
      break;
    default:
      sortByText = "Arrival Time";
  }

  if (!processes || processes.length === 0) {
    return (
      <div className="space-y-2 px-4">
        <h4 className="text-md font-medium">Ready queue</h4>
        <div
          className="h-28 border border-dashed rounded-md flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground text-sm">No processes in ready queue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 mt-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">Ready Queue</h4>
        <span className="text-xs text-muted-foreground">Count: {processes.length}</span>
      </div>

      <div className="overflow-x-auto pb-2 minimal-scrollbar">
        <div className="flex gap-2 min-w-min">
          {/* Queue start indicator */}
          <div className="flex items-center">
            <div className="h-10 w-4 border-t-2 border-b-2 border-l-2 rounded-l-md"></div>
          </div>

          {processes.map((process) => (
            <div
              key={process.id}
              className="flex-shrink-0 h-10 w-12 flex items-center justify-center rounded-md font-medium text-sm text-white"
              style={{ backgroundColor: process.color }}
              title={`${process.name} (Priority: ${process.priority}, Burst: ${process.burstTime}, Remaining: ${process.remainingTime})`}
            >
              P{process.id}
            </div>
          ))}

          <div className="flex items-center">
            <div className="h-10 w-4 border-t-2 border-b-2 border-r-2 rounded-r-md"></div>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <span>Sorted by: </span>
        <span className="font-medium">{sortByText}</span>
      </div>
    </div>
  );
};

export default ReadyQueue;
