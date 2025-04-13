"use client";

import SimulationStatusBadge from "@/components/simulation-status-badge";
import { useAppSelector } from "@/lib/hooks";

const SimulationStatus = () => {
  const scheduler = useAppSelector((state) => state.scheduler);

  return (
    <div className="flex items-center text-sm rounded-md py-2 px-4">
      <div className="flex flex-col items-start justify-center w-[90px]">
        <span className="font-medium text-muted-foreground text-xs">Time</span>
        <span className="font-semibold tabular-nums">{scheduler.currentTime}</span>
      </div>
      <div className="flex flex-col items-start justify-center w-[120px]">
        <span className="font-medium text-muted-foreground text-xs">Active Process</span>
        <span className="font-semibold">{scheduler.activeProcessId ? `P${scheduler.activeProcessId}` : "None"}</span>
      </div>
      <div className="flex flex-col items-start justify-center w-[120px] gap-1">
        <SimulationStatusBadge />
      </div>
    </div>
  );
};

export default SimulationStatus;
