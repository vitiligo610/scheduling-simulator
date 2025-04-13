import { Process, ProcessStatus, SchedulingAlgorithm } from "@/lib/definitions";

export const getReadyQueue = (algorithm: SchedulingAlgorithm, currentTime: number, queue: Process[]): Process[] => {
  const availableProcesses = queue.filter((p) =>
    p.arrivalTime <= currentTime && p.status !== ProcessStatus.COMPLETED,
  );
  switch (algorithm) {
    case SchedulingAlgorithm.FCFS:
      return availableProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
    case SchedulingAlgorithm.SJF:
      return availableProcesses.sort((a, b) => {
        if (a.remainingTime !== b.remainingTime) {
          return a.remainingTime - b.remainingTime;
        }
        return a.arrivalTime - b.arrivalTime;
      });
    case SchedulingAlgorithm.PRIORITY:
      return availableProcesses.sort((a, b) => {
        const priorityA = a.priority ?? Infinity;
        const priorityB = b.priority ?? Infinity;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        return a.arrivalTime - b.arrivalTime;
      });
    default:
      return availableProcesses;
  }
};

export const fcfsScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  if (queue.length === 0) return null;
  return getReadyQueue(SchedulingAlgorithm.FCFS, currentTime, queue)[0];
};

export const sjfScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  if (queue.length === 0) return null;
  return getReadyQueue(SchedulingAlgorithm.SJF, currentTime, queue)[0];
};

export const priorityScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  if (queue.length === 0) return null;
  return getReadyQueue(SchedulingAlgorithm.PRIORITY, currentTime, queue)[0];
};

export const rrScheduler = (
  currentTime: number,
  queue: Process[],
  lastExecutedIndex: number = 0, // Needs state management outside
  quantum: number,
): Process | null => {
  console.warn("RR Scheduler needs proper implementation for non-preemptive tick", lastExecutedIndex, quantum);
  // Basic placeholder - selects next ready process cyclically
  const readyQueue = getReadyQueue(SchedulingAlgorithm.RR, currentTime, queue);
  if (readyQueue.length === 0) return null;
  // This simple logic doesn't handle quantum correctly for non-preemptive tick-by-tick
  // It just picks the next one in arrival order for now
  return readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
};

export const mlfqScheduler = (
  currentTime: number,
  queues: Process[][], // Needs state management outside
): Process | null => {
  console.warn("MLFQ Scheduler needs implementation");
  // Basic placeholder - picks from highest priority queue
  for (const q of queues) {
    const readyQueue = getReadyQueue(SchedulingAlgorithm.MLFQ, currentTime, q);
    if (readyQueue.length > 0) {
      // Typically RR within the highest queue, FCFS in lower ones
      return readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
    }
  }
  return null;
};