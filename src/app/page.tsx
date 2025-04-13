"use client";

import Navbar from "@/components/navbar";
import ProcessManagement from "@/components/process-management";
import Visualization from "@/components/visualization";
import PerformanceFeedback from "@/components/performance-feedback";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { simulationTick, updateFeedbackSuggestion } from "@/lib/thunks";
import { TICK_DURATION } from "@/lib/utils";
import { throttle } from "lodash";

const SimulatorPage = () => {
  const dispatch = useAppDispatch();
  const scheduler = useAppSelector(state => state.scheduler);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationSpeedMs = 500;

  const throttledAnalysis = useRef(
    throttle(() => {
      console.log("Running throttled feedback analysis...");
      dispatch(updateFeedbackSuggestion());
    }, 500, { leading: false, trailing: true }),
  ).current;

  useEffect(() => {
    if (scheduler.isRunning) {
      if (scheduler.currentTime > 0) {
        throttledAnalysis();
      }
      intervalRef.current = setInterval(() => {
        dispatch(simulationTick());
      }, TICK_DURATION);
      console.log("Simulation Interval Started");

    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("Simulation Interval Cleared");
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("Simulation Interval Cleared (Cleanup)");
      }
      throttledAnalysis.cancel();
    };

  }, [scheduler.isRunning, dispatch, simulationSpeedMs, scheduler.selectedAlgorithm, throttledAnalysis, scheduler.currentTime]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="p-4" defaultSize={32}>
          <ProcessManagement />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-4" defaultSize={41}>
          <Visualization />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-4" defaultSize={27}>
          <PerformanceFeedback />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SimulatorPage;
