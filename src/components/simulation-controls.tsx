"use client";

import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  pauseSimulation,
  pushToRRQueue,
  resetSimulation,
  startSimulation,
} from "@/lib/features/scheduler/schedulerSlice";
import { resetProcesses } from "@/lib/features/process/processSlice";
import { resetMetrics } from "@/lib/features/metrics/metricsSlice";
import { SchedulingAlgorithm } from "@/lib/definitions";
import { getReadyQueue } from "@/utils/algorithms";
import * as React from "react";
import { clearSuggestion } from "@/lib/features/feedback/feedbackSlice";

const SimulationControls = () => {
  const dispatch = useAppDispatch();
  const scheduler = useAppSelector(state => state.scheduler);
  const { processes } = useAppSelector(state => state.processes);

  const reset = () => {
    dispatch(resetProcesses(0));
    dispatch(resetSimulation());
    dispatch(resetMetrics());
    dispatch(clearSuggestion());
    if (scheduler.selectedAlgorithm === SchedulingAlgorithm.RR) {
      getReadyQueue(SchedulingAlgorithm.RR, scheduler.currentTime, processes).forEach(p => dispatch(pushToRRQueue(p.id)));
    }
  };

  return (
    <>
      <NavigationMenuItem>
        <Button disabled={scheduler.isRunning} onClick={() => dispatch(startSimulation())}>
          <Play /> Start
        </Button>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Button variant="outline" onClick={() => dispatch(pauseSimulation())}>
          <Pause /> Pause
        </Button>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Button variant="destructive" onClick={reset}>
          <RotateCw /> Reset
        </Button>
      </NavigationMenuItem>
    </>
  );
};

export default SimulationControls;