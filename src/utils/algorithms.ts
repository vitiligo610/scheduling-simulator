import { Process } from "@/lib/definitions";

export const fcfsScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  const readyQueue = queue.filter(
    (p) => !p.completed && p.arrivalTime <= currentTime,
  );
  if (readyQueue.length === 0) return null;
  return readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
};

export const sjfScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  const readyQueue = queue.filter(
    (p) => !p.completed && p.arrivalTime <= currentTime,
  );
  if (readyQueue.length === 0) return null;
  return readyQueue.sort((a, b) => a.burstTime - b.burstTime)[0];
};

export const rrScheduler = (
  currentTime: number,
  queue: Process[],
  lastExecutedIndex: number = 0,
): Process | null => {
  const readyQueue = queue.filter(
    (p) => !p.completed && p.arrivalTime <= currentTime,
  );
  if (readyQueue.length === 0) return null;
  const index = (lastExecutedIndex + 1) % readyQueue.length;
  return readyQueue[index];
};

export const priorityScheduler = (
  currentTime: number,
  queue: Process[],
): Process | null => {
  const readyQueue = queue.filter(
    (p) => !p.completed && p.arrivalTime <= currentTime,
  );
  if (readyQueue.length === 0) return null;
  return readyQueue.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))[0];
};

export const mlfqScheduler = (
  currentTime: number,
  queues: Process[][],
): Process | null => {
  for (const q of queues) {
    const readyQueue = q.filter(
      (p) => !p.completed && p.arrivalTime <= currentTime,
    );
    if (readyQueue.length > 0) return readyQueue[0];
  }
  return null;
};
