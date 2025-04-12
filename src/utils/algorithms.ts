import { Process, ProcessStatus } from "@/lib/definitions";

const getReadyQueue = (currentTime: number, queue: Process[]): Process[] => {
  return queue.filter(
    (p) =>
      p.status !== ProcessStatus.COMPLETED && p.arrivalTime <= currentTime,
  );
};

export const fcfsScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  const readyQueue = getReadyQueue(currentTime, queue);
  if (readyQueue.length === 0) return null;
  return readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
};

export const sjfScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  const readyQueue = getReadyQueue(currentTime, queue);
  if (readyQueue.length === 0) return null;
  return readyQueue.sort((a, b) => {
    if (a.remainingTime !== b.remainingTime) {
      return a.remainingTime - b.remainingTime;
    }
    return a.arrivalTime - b.arrivalTime;
  })[0];
};

export const priorityScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  const readyQueue = getReadyQueue(currentTime, queue);
  if (readyQueue.length === 0) return null;
  return readyQueue.sort((a, b) => {
    const priorityA = a.priority ?? Infinity;
    const priorityB = b.priority ?? Infinity;
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return a.arrivalTime - b.arrivalTime;
  })[0];
};

export const rrScheduler = (
  currentTime: number,
  queue: Process[],
  lastExecutedIndex: number = 0, // Needs state management outside
  quantum: number,
): Process | null => {
  console.warn("RR Scheduler needs proper implementation for non-preemptive tick");
  // Basic placeholder - selects next ready process cyclically
  const readyQueue = getReadyQueue(currentTime, queue);
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
    const readyQueue = getReadyQueue(currentTime, q);
    if (readyQueue.length > 0) {
      // Typically RR within the highest queue, FCFS in lower ones
      return readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
    }
  }
  return null;
};