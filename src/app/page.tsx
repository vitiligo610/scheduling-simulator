"use client";

import Navbar from "@/components/navbar";
import ProcessManagement from "@/components/process-management";
import Visualization from "@/components/visualization";
import PerformanceFeedback from "@/components/performance-feedback";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { simulationTick } from "@/lib/thunks";

const SimulatorPage = () => {
  const dispatch = useAppDispatch();
  const isRunning = useAppSelector(state => state.scheduler.isRunning);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationSpeedMs = 500;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch(simulationTick());
      }, simulationSpeedMs);
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
    };

  }, [isRunning, dispatch, simulationSpeedMs]);

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
