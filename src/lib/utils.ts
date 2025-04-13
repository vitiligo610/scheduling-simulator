import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MlfqState, Process, ProcessStatus } from "@/lib/definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TICK_DURATION = 500;

export const getMlfqReadyProcesses = (
  processes: Readonly<Process[]>,
  mlfqState: Readonly<MlfqState>,
  currentTime: number,
): Process[] => {

  const orderedReadyList: Process[] = [];

  const processMap = new Map(processes.map(p => [p.id, p]));

  for (let queueId = 0; queueId < mlfqState.numQueues; queueId++) {
    const processIdsInQueue = mlfqState.queueContents[queueId];

    if (!processIdsInQueue || processIdsInQueue.length === 0) {
      continue;
    }

    for (const processId of processIdsInQueue) {
      const process = processMap.get(processId);

      if (
        process &&
        process.arrivalTime <= currentTime &&
        process.status !== ProcessStatus.COMPLETED &&
        process.status !== ProcessStatus.RUNNING
      ) {
        orderedReadyList.push(process);
      } else if (!process) {
        console.warn(`getMlfgReadyProcessesOrdered: Process ID ${processId} found in MLFQ Queue ${queueId} but not in the main process list.`);
      }
    }
  }

  return orderedReadyList;
};