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
import { fcfsScheduler, priorityScheduler, sjfScheduler } from "@/utils/algorithms";
import { initialState as initialMetricsState } from "@/lib/features/metrics/metricsSlice";

export const simulationTick = createAsyncThunk<void, void, {
  state: RootState
}>("scheduler/simulationTick", async (_, { dispatch, getState }) => {
  const state = getState();
  const { scheduler, processes: processState } = state;
  const {
    currentTime,
    activeProcessId,
    selectedAlgorithm,
    preemptive,
    rrQueue,
    currentQuantumUsed,
    quantum,
  } = scheduler;
  const processes = processState.processes;

  let currentProcess: Process | null | undefined = null;
  if (activeProcessId !== null) currentProcess = processes.find((p) => p.id === activeProcessId);

  let cpuWasIdleThisTick = false;
  let preemptionOccurred = false;
  let rrPreemptionOccurred = false;
  let nextActiveProcessId: number | null | undefined = activeProcessId;

  if (currentProcess && currentProcess.status !== ProcessStatus.COMPLETED) {
    const updatedProcess = { ...currentProcess };
    if (preemptive && selectedAlgorithm !== SchedulingAlgorithm.FCFS && selectedAlgorithm !== SchedulingAlgorithm.RR) {
      let availableProcess: Process | null = null;
      if (selectedAlgorithm === SchedulingAlgorithm.SJF) {
        availableProcess = processes.find(p => p.arrivalTime === currentTime && p.burstTime < updatedProcess.burstTime) ?? null;
      } else if (selectedAlgorithm === SchedulingAlgorithm.PRIORITY) {
        availableProcess = processes.find(p => p.arrivalTime === currentTime && p.priority < updatedProcess.priority) ?? null;
      }
      if (availableProcess) {
        preemptionOccurred = true;
        nextActiveProcessId = availableProcess.id;
        dispatch(setActiveProcess(availableProcess.id));
        updatedProcess.status = ProcessStatus.READY;
        updatedProcess.remainingTime--;
        updatedProcess.stoppedAt = [...updatedProcess.stoppedAt, currentTime];
        dispatch(updateProcess(updatedProcess));
        const updatedAvailableProcess = {
          ...availableProcess,
          status: ProcessStatus.RUNNING,
          startTime: currentTime,
          startedAt: [...availableProcess.startedAt, currentTime],
        };
        dispatch(updateProcess(updatedAvailableProcess));
        console.log(`Time ${currentTime}: Process ${updatedProcess.id} PREEMPTED by Process ${availableProcess.id}`);
        console.log("updated process is ", getState().processes.processes.find(p => p.id === updatedProcess.id));
      }
    }

    // handle preemption for round-robin here
    rrPreemptionOccurred = false;
    if (selectedAlgorithm === SchedulingAlgorithm.RR) {
      if (currentQuantumUsed >= quantum) {
        console.log("somebody is here at time ", currentTime, "quantum", currentQuantumUsed, "/", quantum);
        rrPreemptionOccurred = true;

        let nextRRProcess: Process | null | undefined = null;

        console.log("inside loop, rr queue is ", rrQueue);
        const nextRRProcessId = rrQueue[0];
        if (nextRRProcessId) {
          nextRRProcess = processes.find(p => p.id === nextRRProcessId);
          dispatch(popFromRRQueue());
          console.log("nextRRProcessId is ", " process ", nextRRProcess);
        }
        dispatch(resetQuantumUsed());
        updatedProcess.remainingTime--;
        updatedProcess.stoppedAt = [...updatedProcess.stoppedAt, currentTime];
        if (updatedProcess.remainingTime <= 0) {
          updatedProcess.status = ProcessStatus.COMPLETED;
          updatedProcess.endTime = currentTime;
        } else {
          updatedProcess.status = ProcessStatus.READY;
          dispatch(pushToRRQueue(updatedProcess.id));
        }
        dispatch(updateProcess(updatedProcess));
        console.log("next rr process is ", nextRRProcess);
        console.log("rr queue is ", rrQueue);
        if (nextRRProcess) {
          dispatch(setActiveProcess(nextRRProcess.id));
          const updatedAvailableProcess = {
            ...nextRRProcess,
            status: ProcessStatus.RUNNING,
            startTime: nextRRProcess.startTime ?? currentTime,
            startedAt: [...nextRRProcess.startedAt, currentTime],
          };
          dispatch(updateProcess(updatedAvailableProcess));
        }
      }
    }

    if (!preemptionOccurred && !rrPreemptionOccurred) {
      updatedProcess.remainingTime--;
      console.log(`Time ${currentTime}: time subtracted for process ${updatedProcess.id} (${updatedProcess.remainingTime} left)`);
    }

    if (!preemptionOccurred && !rrPreemptionOccurred && updatedProcess.remainingTime <= 0) {
      updatedProcess.status = ProcessStatus.COMPLETED;
      updatedProcess.endTime = currentTime;
      updatedProcess.remainingTime = 0;
      updatedProcess.stoppedAt = [...updatedProcess.stoppedAt, currentTime];
      nextActiveProcessId = null;
      dispatch(updateProcess(updatedProcess));
      dispatch(setActiveProcess(null));
      console.log(`Time ${currentTime}: Process ${updatedProcess.id} COMPLETED`);
    } else if (!preemptionOccurred) {
      dispatch(updateProcess(updatedProcess));
      console.log(`Time ${currentTime}: Process ${updatedProcess.id} RUNNING (${updatedProcess.remainingTime} left)`);
    }
  } else {
    nextActiveProcessId = null;
    cpuWasIdleThisTick = true;
  }

  if (nextActiveProcessId === null) {
    let nextProcess: Process | null = null;
    const currentProcesses = getState().processes.processes;

    if (currentProcesses.length > 0) {
      switch (selectedAlgorithm) {
        case SchedulingAlgorithm.FCFS:
          nextProcess = fcfsScheduler(currentTime, currentProcesses);
          break;
        case SchedulingAlgorithm.SJF:
          nextProcess = sjfScheduler(currentTime, currentProcesses);
          break;
        case SchedulingAlgorithm.PRIORITY:
          nextProcess = priorityScheduler(currentTime, currentProcesses);
          break;
        case SchedulingAlgorithm.RR:
          const nextProcessId = rrQueue[0];
          if (nextProcessId) {
            nextProcess = currentProcesses.find(p => p.id === nextProcessId) ?? null;
          }
          break;
        default:
          console.warn("Using FCFS for unhandled/placeholder algorithm");
          nextProcess = fcfsScheduler(currentTime, currentProcesses);
      }

      if (nextProcess) {
        console.log(`Time ${currentTime}: Selecting Process ${nextProcess.id} (${selectedAlgorithm})`);
        nextActiveProcessId = nextProcess.id;
        dispatch(setActiveProcess(nextProcess.id));

        const processInStore = getState().processes.processes.find(p => p.id === nextProcess!.id);
        if (processInStore && processInStore.startTime === undefined) {
          const startedProcess = {
            ...processInStore,
            startTime: currentTime,
            status: ProcessStatus.RUNNING,
            startedAt: [currentTime],
          };
          dispatch(updateProcess(startedProcess));
          console.log(`Time ${currentTime}: Process ${startedProcess.id} STARTED (${startedProcess.remainingTime} left)`);
        } else if (processInStore && processInStore.status !== ProcessStatus.RUNNING) {
          const resumedProcess = {
            ...processInStore,
            status: ProcessStatus.RUNNING,
            startedAt: [...processInStore.startedAt, currentTime],
          };
          dispatch(updateProcess(resumedProcess));
          console.log(`Time ${currentTime}: Process ${resumedProcess.id} RESUMED (${resumedProcess.remainingTime} left)`);
        }

        if (selectedAlgorithm === SchedulingAlgorithm.RR) {
          console.log("on selection, before queue ", rrQueue);
          dispatch(popFromRRQueue());
          console.log("on selection, after queue ", getState().scheduler.rrQueue);
        }

        cpuWasIdleThisTick = false;

      } else {
        console.log(`Time ${currentTime}: Ready processes exist, but none chosen?`);
      }
    } else {
      console.log(`Time ${currentTime}: No ready processes to run.`);
    }
  }

  if (cpuWasIdleThisTick && nextActiveProcessId === null) {
    dispatch(incrementIdleTime());
    dispatch(setSimulationStatus(SimulationStatus.IDLE));
    console.log(`Time ${currentTime}: CPU Idle`);
  } else if (nextActiveProcessId !== null) {
    dispatch(setSimulationStatus(SimulationStatus.RUNNING));
  }

  await dispatch(calculateAndUpdateMetrics());

  const allProcesses = getState().processes.processes; // Get potentially updated list
  const allCompleted = allProcesses.length > 0 && allProcesses.every(p => p.status === ProcessStatus.COMPLETED);

  if (allCompleted) {
    console.log(`Simulation Complete at time ${currentTime}`);
    dispatch(pauseSimulation()); // Stop the simulation interval
    dispatch(setSimulationStatus(SimulationStatus.PAUSED)); // Set final status
  } else {
    dispatch(incrementTime());
    if (selectedAlgorithm === SchedulingAlgorithm.RR) {
      console.log("quantum before ", currentQuantumUsed);
      dispatch(incrementQuantumUsed());
      console.log("quntum after ", getState().scheduler.currentQuantumUsed);
    }
  }

  console.log(`End of Tick ${currentTime}. Next Time: ${getState().scheduler.currentTime}. Status: ${getState().scheduler.status}`);
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