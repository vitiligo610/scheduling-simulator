"use client";

import Navbar from "@/components/navbar";
import ProcessManagement from "@/components/process-management";
import Visualization from "@/components/visualization";
import PerformanceFeedback from "@/components/performance-feedback";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useRef } from "react";
import { incrementTime, setActiveProcess, setSimulationStatus } from "@/lib/features/scheduler/schedulerSlice";
import { Process, ProcessStatus, SchedulingAlgorithm, SimulationStatus } from "@/lib/definitions";
import { updateProcess } from "@/lib/features/process/processSlice";
import { fcfsScheduler } from "@/utils/algorithms";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const SimulatorPage = () => {
  const dispatch = useAppDispatch();
  const {
    currentTime,
    isRunning,
    selectedAlgorithm,
    activeProcessId,
    quantum,
  } = useAppSelector(state => state.scheduler);
  const processes = useAppSelector(state => state.processes);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // --- Simulation Tick Logic ---
        dispatch(incrementTime());

        // Clone processes for modification checks if needed, or work with IDs
        const currentProcesses = [...processes.processes];
        console.log("current processes are ", currentProcesses);
        if (currentProcesses.length !== 0 && !activeProcessId) {
          setActiveProcess(currentProcesses[0].id);
        }

        if (currentProcesses.length === 0 || currentProcesses.every(p => p.status === ProcessStatus.COMPLETED)) {
          setSimulationStatus(SimulationStatus.IDLE);
        }

        const activeProcess = currentProcesses.find(p => p.id === activeProcessId);

        let nextActiveProcessId = activeProcessId;
        let processCompletedThisTick = false;
        let processStartedThisTick = false;

        // 1. Handle currently active process (if any)
        if (activeProcess && activeProcess.status !== ProcessStatus.COMPLETED) {
          setSimulationStatus(SimulationStatus.RUNNING);
          const updatedProcess: Process = { ...activeProcess };
          updatedProcess.remainingTime -= 1;

          // Check for completion
          if (updatedProcess.remainingTime <= 0) {
            updatedProcess.remainingTime = 0;
            updatedProcess.status = ProcessStatus.COMPLETED;
            updatedProcess.endTime = currentTime + 1; // Completed at the END of this time unit
            dispatch(updateProcess(updatedProcess));
            dispatch(setActiveProcess(null)); // Free the CPU
            nextActiveProcessId = null; // Mark CPU as free for scheduler check
            processCompletedThisTick = true;
          } else {
            // Update remaining time in store for non-completed process
            dispatch(updateProcess(updatedProcess));
            // Keep CPU busy - In non-preemptive, no need to check scheduler here
            nextActiveProcessId = activeProcess.id;
          }
        } else {
          // No active process OR active process just completed
          nextActiveProcessId = null; // Ensure CPU is marked as free
        }

        // 2. Select NEW process *only if CPU is free* (Non-Preemptive Logic)
        if (nextActiveProcessId === null) {
          const readyQueue = currentProcesses.filter(p =>
            p.status !== "completed" && p.arrivalTime <= currentTime + 1, // Arrived by the start of the *next* time unit
          );

          if (readyQueue.length > 0) {
            let chosenProcess: Process | null = null;
            switch (selectedAlgorithm) {
              case SchedulingAlgorithm.FCFS:
                chosenProcess = fcfsScheduler(currentTime + 1, readyQueue); // Pass ready queue
                break;
              case SchedulingAlgorithm.SJF:
                // Non-preemptive: Sort by INITIAL burst time
                const sortedSJF = [...readyQueue].sort((a, b) => a.burstTime - b.burstTime);
                chosenProcess = sortedSJF[0] ?? null;
                break;
              case SchedulingAlgorithm.PRIORITY:
                // Non-preemptive: Sort by priority
                const sortedPriority = [...readyQueue].sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));
                chosenProcess = sortedPriority[0] ?? null;
                break;
              case SchedulingAlgorithm.RR:
                // Basic FCFS-like selection for now if RR is chosen
                // Real RR logic will come later with preemption
                chosenProcess = fcfsScheduler(currentTime + 1, readyQueue);
                break;
              case SchedulingAlgorithm.MLFQ:
                // Basic FCFS-like selection for now
                chosenProcess = fcfsScheduler(currentTime + 1, readyQueue);
                break;
              default:
                chosenProcess = null;
            }

            if (chosenProcess) {
              dispatch(setActiveProcess(chosenProcess.id));
              nextActiveProcessId = chosenProcess.id;
              // Set start time *only if* it hasn't started before
              if (chosenProcess.startTime === undefined) {
                const startedProcess = { ...chosenProcess, startTime: currentTime + 1 };
                dispatch(updateProcess(startedProcess));
                processStartedThisTick = true;
              }
            }
          }
        }

        // 3. Termination Condition (Example: stop when all processes are done)
        const allCompleted = currentProcesses.length > 0 && currentProcesses.every(p => p.status === ProcessStatus.COMPLETED);
        if (allCompleted) {
          // dispatch(pauseSimulation()); // Stop the simulation
        }

        // --- End Simulation Tick Logic ---

      }, 500); // Run every 1 second (adjust speed as needed)

    } else {
      // Clear interval if simulation is paused or stopped
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function for useEffect
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // Dependencies: Include everything from Redux or props that the effect uses
  }, [isRunning, dispatch, currentTime, processes, selectedAlgorithm, activeProcessId]);

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
      {/*<div className="flex flex-1 overflow-hidden">*/}
      {/*  <div className="w-1/4 border-r p-4">*/}
      {/*    <ProcessManagement />*/}
      {/*  </div>*/}
      {/*  <div className="w-2/4 border-r p-4 overflow-y-auto">*/}
      {/*    <Visualization />*/}
      {/*  </div>*/}
      {/*  <div className="w-1/4 p-4 overflow-y-auto">*/}
      {/*    <PerformanceFeedback />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default SimulatorPage;
