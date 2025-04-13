import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import {
  incrementIdleTime,
  incrementQuantumUsed,
  incrementTime,
  pauseSimulation,
  popFromRRQueue,
  pushToRRQueue,
  resetQuantumUsed,
  setActiveProcess,
  setSimulationStatus,
} from "@/lib/features/scheduler/schedulerSlice";
import { MetricsState, Process, ProcessStatus, SchedulingAlgorithm, SimulationStatus } from "@/lib/definitions";
import { updateProcess } from "@/lib/features/process/processSlice";
import { fcfsScheduler } from "@/utils/algorithms";
import { initialState as initialMetricsState } from "@/lib/features/metrics/metricsSlice";
import {
  cycleQueue,
  incrementQueueQuantumUsed,
  initializeProcessInMlfq,
  moveProcess,
  removeFromMlfqQueueFront,
  removeProcessFromMlfq,
  resetQueueQuantumUsed,
} from "@/lib/features/mlfq/mlfqSlice";

export const simulationTick = createAsyncThunk<void, void, {
  state: RootState
}>("scheduler/simulationTick", async (_, { dispatch, getState }) => {
  // --- Get Initial State ---
  const initialTimestamp = Date.now();
  const state = getState();
  // Destructure all relevant states
  const { scheduler, processes: processState, mlfq: mlfqState } = state;
  const {
    currentTime,
    activeProcessId,
    selectedAlgorithm,
    preemptive,
    currentQuantumUsed: globalRrQuantumUsed,
    quantum: globalRrQuantum,
  } = scheduler;
  const processes = processState.processes;
  console.log(`--- Tick Start: ${currentTime}, Algorithm: ${selectedAlgorithm}, Active: ${activeProcessId ?? "None"} ---`);

  // --- Step 1: Handle New Arrivals for MLFQ ---
  if (selectedAlgorithm === SchedulingAlgorithm.MLFQ) {
    // Find processes arriving now that aren't yet tracked by MLFQ
    const newlyArrivedProcesses = processes.filter(p =>
      p.arrivalTime === currentTime &&
      mlfqState.processQueueMap[p.id] === undefined,
    );
    if (newlyArrivedProcesses.length > 0) {
      console.log(`MLFQ: Initializing newly arrived: [${newlyArrivedProcesses.map(p => p.id).join(",")}]`);
      newlyArrivedProcesses.forEach(p => {
        // Only add if not completed (edge case: arrives and completes instantly?)
        if (p.status !== ProcessStatus.COMPLETED) {
          dispatch(initializeProcessInMlfq({ processId: p.id }));
        }
      });
    }
  }
  // --- End Step 1 ---


  let currentProcess: Process | undefined = undefined;
  if (activeProcessId !== null) {
    currentProcess = processes.find((p) => p.id === activeProcessId);
  }

  let cpuWasIdleThisTick: boolean;
  let preemptionOccurredSJF_Prio = false;
  let rrPreemptionOccurred = false; // Standard RR preemption
  let mlfqQuantumExpired = false;   // MLFQ quantum preemption
  let nextActiveProcessId: number | null = activeProcessId ?? null;

  // --- Step 2: Handle Active Process Execution ---
  if (currentProcess && currentProcess.status !== ProcessStatus.COMPLETED) {
    console.log(`Tick ${currentTime}: Active process = ${currentProcess.id} (${currentProcess.name})`);
    cpuWasIdleThisTick = false;
    const updatedProcess = { ...currentProcess }; // Work on a copy

    // --- 2a: SJF/Priority Preemption Check ---
    // *** Only run if NOT MLFQ ***
    if (preemptive && selectedAlgorithm !== SchedulingAlgorithm.FCFS && selectedAlgorithm !== SchedulingAlgorithm.RR && selectedAlgorithm !== SchedulingAlgorithm.MLFQ) {
      let availableProcess: Process | null = null;
      if (selectedAlgorithm === SchedulingAlgorithm.SJF) {
        availableProcess = processes.find(p => p.arrivalTime === currentTime && p.burstTime < updatedProcess.burstTime) ?? null;
      } else if (selectedAlgorithm === SchedulingAlgorithm.PRIORITY) {
        availableProcess = processes.find(p => p.arrivalTime === currentTime && (p.priority ?? Infinity) < (updatedProcess.priority ?? Infinity)) ?? null; // Check priority correctly
      }
      if (availableProcess) {
        console.log(`SJF/Priority Preemption Check: Found potential preemptor ${availableProcess.id}`);
        preemptionOccurredSJF_Prio = true;
        nextActiveProcessId = availableProcess.id; // Preempt!
        // Update preempted process
        updatedProcess.status = ProcessStatus.READY;
        updatedProcess.remainingTime--; // Don't decrement time if preempted before running
        updatedProcess.stoppedAt = [...(updatedProcess.stoppedAt ?? []), currentTime]; // Record stop time
        dispatch(updateProcess(updatedProcess));
        // Update new process
        const updatedAvailableProcess = {
          ...availableProcess,
          status: ProcessStatus.RUNNING,
          startTime: availableProcess.startTime ?? currentTime, // Use existing startTime if resuming
          startedAt: [...(availableProcess.startedAt ?? []), currentTime], // Record start/resume time
        };
        dispatch(updateProcess(updatedAvailableProcess));
        dispatch(setActiveProcess(availableProcess.id)); // Set new active process
        console.log(`Time ${currentTime}: Process ${updatedProcess.id} PREEMPTED by Process ${availableProcess.id}`);
      }
    }

    // --- 2b: Execute Tick (if not preempted by SJF/Priority) ---
    if (!preemptionOccurredSJF_Prio) {
      // *** DECREMENT TIME FIRST ***
      updatedProcess.remainingTime--;
      console.log(`Tick ${currentTime}: Decremented ${updatedProcess.id}. Remaining: ${updatedProcess.remainingTime}`);

      let processCompleted = false;

      // *** Algorithm-Specific Checks (Quantum, etc.) ***
      if (selectedAlgorithm === SchedulingAlgorithm.RR) {
        dispatch(incrementQuantumUsed()); // Increment global RR counter
        const quantumUsedAfterTick = globalRrQuantumUsed + 1;
        console.log(`Tick ${currentTime}: RR Quantum for ${updatedProcess.id}. Used: ${quantumUsedAfterTick}/${globalRrQuantum}`);
        if (updatedProcess.remainingTime <= 0) {
          processCompleted = true;
        } else if (quantumUsedAfterTick >= globalRrQuantum) {
          console.log(`Tick ${currentTime}: RR Quantum EXPIRED for ${updatedProcess.id}.`);
          rrPreemptionOccurred = true; // Mark RR preemption
          nextActiveProcessId = null;
          updatedProcess.status = ProcessStatus.READY;
          updatedProcess.stoppedAt = [...(updatedProcess.stoppedAt ?? []), currentTime];
          dispatch(pushToRRQueue(updatedProcess.id)); // Add back to end of RR queue
          dispatch(resetQuantumUsed()); // Reset global counter
        }
      } else if (selectedAlgorithm === SchedulingAlgorithm.MLFQ) {
        const currentProcessQueueId = mlfqState.processQueueMap[updatedProcess.id];
        const queueConfig = mlfqState.queuesConfig[currentProcessQueueId];
        if (currentProcessQueueId !== undefined && queueConfig) {
          dispatch(incrementQueueQuantumUsed({ processId: updatedProcess.id }));
          // Read state again after dispatch to get the truly updated value
          const quantumUsedInQueue = getState().mlfq.currentQueueQuantumUsed[updatedProcess.id];
          console.log(`Tick ${currentTime}: MLFQ Quantum for ${updatedProcess.id} in Q${currentProcessQueueId}. Used: ${quantumUsedInQueue}/${queueConfig.quantum}`);
          if (updatedProcess.remainingTime <= 0) {
            processCompleted = true;
          } else if (quantumUsedInQueue >= queueConfig.quantum) {
            console.log(`Tick ${currentTime}: MLFQ Quantum EXPIRED for ${updatedProcess.id} in Q${currentProcessQueueId}.`);
            mlfqQuantumExpired = true; // Mark MLFQ preemption
            nextActiveProcessId = null;
            // Handle Demotion/Cycling
            const nextQueueId = currentProcessQueueId + 1;
            if (nextQueueId < mlfqState.numQueues) {
              console.log(`MLFQ: Demoting ${updatedProcess.id} from Q${currentProcessQueueId} to Q${nextQueueId}`);
              dispatch(moveProcess({ processId: updatedProcess.id, targetQueueId: nextQueueId }));
            } else {
              console.log(`MLFQ: Cycling ${updatedProcess.id} in lowest Q${currentProcessQueueId}`);
              dispatch(cycleQueue({ queueId: currentProcessQueueId }));
              dispatch(resetQueueQuantumUsed({ processId: updatedProcess.id }));
            }
            updatedProcess.status = ProcessStatus.READY;
            updatedProcess.stoppedAt = [...(updatedProcess.stoppedAt ?? []), currentTime];
          }
        } else {
          console.error(`MLFQ Error: Process ${updatedProcess.id} active but state invalid! QID: ${currentProcessQueueId}`);
          // Process might complete or continue without proper quantum tracking
          if (updatedProcess.remainingTime <= 0) processCompleted = true;
        }
      } else { // FCFS, Non-preemptive SJF/Priority
        if (updatedProcess.remainingTime <= 0) {
          processCompleted = true;
        }
      }

      // *** Handle Completion OR Dispatch Update ***
      if (processCompleted) {
        console.log(`Tick ${currentTime}: Process ${updatedProcess.id} COMPLETED.`);
        updatedProcess.status = ProcessStatus.COMPLETED;
        updatedProcess.endTime = currentTime; // End of this tick
        updatedProcess.remainingTime = 0;
        updatedProcess.stoppedAt = [...(updatedProcess.stoppedAt ?? []), currentTime]; // Mark final stop
        nextActiveProcessId = null; // Free CPU
        dispatch(updateProcess(updatedProcess));
        dispatch(setActiveProcess(null)); // Free CPU state

        // --- MLFQ Cleanup on Completion ---
        if (selectedAlgorithm === SchedulingAlgorithm.MLFQ) {
          const queueId = mlfqState.processQueueMap[updatedProcess.id]; // Get queue ID before removing from map
          console.log(`MLFQ: Removing completed process ${updatedProcess.id} from state (was in Q${queueId}).`);
          dispatch(removeProcessFromMlfq({ processId: updatedProcess.id }));
        }
        // --- End MLFQ Cleanup ---

      } else if (rrPreemptionOccurred || mlfqQuantumExpired) {
        // Process was preempted by quantum expiry
        dispatch(updateProcess(updatedProcess)); // Update status/stoppedAt
        dispatch(setActiveProcess(null)); // Free CPU state

      } else {
        // Process continues running (not completed, not preempted by quantum)
        dispatch(updateProcess(updatedProcess)); // Update remaining time
        console.log(`Tick ${currentTime}: Process ${updatedProcess.id} continues running.`);
      }
    } // End if (!preemptionOccurredSJF_Prio)
  } else {
    // CPU was idle initially OR active process was already completed
    console.log(`Tick ${currentTime}: CPU Idle or process already completed.`);
    nextActiveProcessId = null;
    cpuWasIdleThisTick = true;
    // Reset necessary quanta if CPU is unexpectedly idle
    if (selectedAlgorithm === SchedulingAlgorithm.RR && globalRrQuantumUsed > 0) dispatch(resetQuantumUsed());
    // Can't reset MLFQ quantum easily without knowing which process *was* running
  }
  // --- End Step 2 ---


  // --- Step 3: Select New Process (if CPU became free THIS tick) ---
  // Check activeProcessId from the *updated* state
  const currentActiveProcessId = getState().scheduler.activeProcessId;
  if (currentActiveProcessId === null) {
    let nextProcessToSchedule: Process | null = null;
    const latestProcesses = getState().processes.processes;
    const latestMlfqState = getState().mlfq; // Get latest MLFQ state if needed

    console.log(`Tick ${currentTime}: CPU is free. Selecting next process using ${selectedAlgorithm}.`);

    // --- 3a: MLFQ Scheduling Logic ---
    if (selectedAlgorithm === SchedulingAlgorithm.MLFQ) {
      for (let i = 0; i < latestMlfqState.numQueues; i++) {
        const queueContent = latestMlfqState.queueContents[i];
        if (queueContent && queueContent.length > 0) {
          // Iterate through the queue in case the first isn't ready
          let foundInQueue = false;
          for (let j = 0; j < queueContent.length; j++) {
            const processId = queueContent[j];
            const potentialProcess = latestProcesses.find(p => p.id === processId);

            if (potentialProcess && potentialProcess.status !== ProcessStatus.COMPLETED && potentialProcess.arrivalTime <= currentTime) {
              console.log(`MLFQ: Found ready candidate ${processId} in Q${i}.`);
              nextProcessToSchedule = potentialProcess;
              // Remove from front of queue dispatch
              dispatch(removeFromMlfqQueueFront({ queueId: i })); // Assumes it was at the front
              foundInQueue = true;
              break; // Found highest priority ready process in this queue
            }
            // Implicitly skips non-ready processes at the front. If one is found later,
            // the earlier non-ready ones remain for now. A cleanup might be needed elsewhere.
          }
          if (foundInQueue) break; // Break outer loop if found in this queue level
        }
      }
      if (!nextProcessToSchedule) {
        console.log(`MLFQ: All queues checked, no ready process found.`);
      }
      // --- 3b: Other Algorithm Scheduling Logic ---
    } else {
      const readyProcesses = latestProcesses.filter(p => p.arrivalTime <= currentTime && p.status !== ProcessStatus.COMPLETED && p.status !== ProcessStatus.RUNNING);
      console.log(`Tick ${currentTime}: ${selectedAlgorithm} Ready Processes: [${readyProcesses.map(p => p.id).join(",")}]`);
      if (readyProcesses.length > 0) {
        switch (selectedAlgorithm) {
          case SchedulingAlgorithm.FCFS:
            nextProcessToSchedule = fcfsScheduler(currentTime, readyProcesses); // Pass only ready
            break;
          case SchedulingAlgorithm.SJF:
            // Pass only ready processes to SJF scheduler
            if (preemptive) {
              const sortedSRTF = [...readyProcesses].sort((a, b) => a.remainingTime - b.remainingTime);
              nextProcessToSchedule = sortedSRTF[0] ?? null;
            } else {
              const sortedSJF = [...readyProcesses].sort((a, b) => a.burstTime - b.burstTime);
              nextProcessToSchedule = sortedSJF[0] ?? null;
            }
            break;
          case SchedulingAlgorithm.PRIORITY:
            // Pass only ready processes to Priority scheduler
            const sortedPriority = [...readyProcesses].sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));
            nextProcessToSchedule = sortedPriority[0] ?? null;
            break;
          case SchedulingAlgorithm.RR:
            const nextRRId = getState().scheduler.rrQueue[0]; // Get from RR state queue
            if (nextRRId) {
              // Ensure the process from rrQueue is actually in the ready list
              const potentialProcess = readyProcesses.find(p => p.id === nextRRId);
              if (potentialProcess) {
                nextProcessToSchedule = potentialProcess;
              } else {
                console.warn(`RR: Process ${nextRRId} from rrQueue not found in ready list. Skipping.`);
                // Might need logic to remove invalid ID from rrQueue here
                dispatch(popFromRRQueue()); // Assume removal if invalid
              }
            }
            break;
          default:
            console.warn("Using FCFS for unhandled/placeholder algorithm");
            nextProcessToSchedule = fcfsScheduler(currentTime, readyProcesses);
        }
      }
    }

    // --- 3c: Start the Chosen Process ---
    if (nextProcessToSchedule) {
      console.log(`Tick ${currentTime}: SCHEDULING Process ${nextProcessToSchedule.id} (${selectedAlgorithm})`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      nextActiveProcessId = nextProcessToSchedule.id; // Update local variable for logic below
      dispatch(setActiveProcess(nextProcessToSchedule.id)); // Update global state

      // Reset relevant quantum counter
      if (selectedAlgorithm === SchedulingAlgorithm.MLFQ) {
        dispatch(resetQueueQuantumUsed({ processId: nextProcessToSchedule.id }));
      } else if (selectedAlgorithm === SchedulingAlgorithm.RR) {
        dispatch(resetQuantumUsed()); // Reset global RR counter
        // Ensure process is removed from RR queue state AFTER being selected
        if (getState().scheduler.rrQueue[0] === nextProcessToSchedule.id) {
          dispatch(popFromRRQueue());
        } else {
          console.warn(`RR: Selected process ${nextProcessToSchedule.id} wasn't at the front of rrQueue?`);
        }
      }

      // Update process status to RUNNING, set startTime/startedAt
      // Use find on latestProcesses to ensure we have the most recent version
      const processToStartData = latestProcesses.find(p => p.id === nextProcessToSchedule!.id);
      if (processToStartData) {
        const processToStartUpdate = { ...processToStartData, status: ProcessStatus.RUNNING };
        processToStartUpdate.startedAt = [...(processToStartUpdate.startedAt ?? []), currentTime];
        if (processToStartUpdate.startTime === undefined) {
          processToStartUpdate.startTime = currentTime;
          console.log(`Tick ${currentTime}: Process ${processToStartUpdate.id} FIRST START.`);
        } else {
          console.log(`Tick ${currentTime}: Process ${processToStartUpdate.id} RESUMED.`);
        }
        dispatch(updateProcess(processToStartUpdate));
      } else {
        console.error(`Error: Selected process ${nextProcessToSchedule.id} not found in latest process list!`);
      }

      cpuWasIdleThisTick = false; // CPU will be busy next tick

    } else {
      // No process was scheduled
      console.log(`Tick ${currentTime}: No process scheduled. CPU remains idle.`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cpuWasIdleThisTick = true;
      // Ensure activeProcessId is null if none were selected
      if (getState().scheduler.activeProcessId !== null) {
        dispatch(setActiveProcess(null));
      }
    }
  } // End of selecting new process
  // --- End Step 3 ---


  // --- Step 4: Update Idle Time & Status ---
  // Check the definitive active ID *after* scheduling attempts
  let finalProcesses = getState().processes.processes;
  let allCompleted = finalProcesses.length > 0 && finalProcesses.every(p => p.status === ProcessStatus.COMPLETED);
  const finalActiveId = getState().scheduler.activeProcessId;
  if (finalActiveId === null && !allCompleted) { // Added !allCompleted check
    console.log(`Tick ${currentTime}: CPU determined to be Idle.`);
    dispatch(incrementIdleTime());
    if (getState().scheduler.status !== SimulationStatus.COMPLETED) {
      dispatch(setSimulationStatus(SimulationStatus.IDLE));
    }
  } else if (finalActiveId !== null) {
    dispatch(setSimulationStatus(SimulationStatus.RUNNING));
  }
  // --- End Step 4 ---


  // --- Step 5: Update Metrics ---
  await dispatch(calculateAndUpdateMetrics());
  // --- End Step 5 ---


  // --- Step 6: Check for Termination ---
  finalProcesses = getState().processes.processes;
  allCompleted = finalProcesses.length > 0 && finalProcesses.every(p => p.status === ProcessStatus.COMPLETED);

  if (allCompleted) {
    console.log(`Simulation Complete at time ${currentTime}`); // Completion happens at end of tick
    dispatch(pauseSimulation());
    dispatch(setSimulationStatus(SimulationStatus.COMPLETED)); // Use COMPLETED status
  } else {
    // --- Step 7: Advance Time (Only if not completed) ---
    dispatch(incrementTime());
  }
  // --- End Steps 6 & 7 ---

  const duration = Date.now() - initialTimestamp;
  console.log(`--- Tick End: ${currentTime} (Took ${duration}ms). Next Time: ${getState().scheduler.currentTime}. Status: ${getState().scheduler.status} ---`);
});

export const calculateAndUpdateMetrics = createAsyncThunk<
  MetricsState,
  void,
  { state: RootState }
>(
  "metrics/calculateAndUpdate",
  async (_, { getState }) => {
    const state = getState();
    const processes = state.processes.processes;
    const { currentTime, totalIdleTime } = state.scheduler;

    const completedProcesses = processes.filter(p => p.status === ProcessStatus.COMPLETED && p.endTime !== undefined);
    const numCompleted = completedProcesses.length;

    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let completionOrder: number[] = [];

    if (numCompleted > 0) {
      completedProcesses.forEach(p => {
        const turnaroundTime = p.endTime! - p.arrivalTime;
        const waitingTime = turnaroundTime - p.burstTime;

        totalTurnaroundTime += turnaroundTime;
        totalWaitingTime += Math.max(0, waitingTime);
      });

      const averageTurnaroundTime = totalTurnaroundTime / numCompleted;
      const averageWaitingTime = totalWaitingTime / numCompleted;

      completionOrder = [...completedProcesses]
        .sort((a, b) => a.endTime! - b.endTime!)
        .map(p => p.id);

      const cpuBusyTime = currentTime - totalIdleTime;
      const cpuUtilization = currentTime > 0 ? (cpuBusyTime / currentTime) * 100 : 0;

      const throughput = currentTime > 0 ? numCompleted / currentTime : 0;

      return {
        averageWaitingTime: averageWaitingTime,
        averageTurnaroundTime: averageTurnaroundTime,
        cpuUtilization: Math.max(0, Math.min(100, cpuUtilization)),
        throughput: throughput,
        completionOrder: completionOrder,
        lastCalculationTime: currentTime,
      };

    } else {
      const cpuBusyTime = currentTime - totalIdleTime;
      const cpuUtilization = currentTime > 0 ? (cpuBusyTime / currentTime) * 100 : 0;
      return {
        ...initialMetricsState,
        cpuUtilization: Math.max(0, Math.min(100, cpuUtilization)),
        lastCalculationTime: currentTime,
      };
    }
  },
);