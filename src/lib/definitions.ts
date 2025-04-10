export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  priority?: number;
  startTime?: number;
  endTime?: number;
  completed: boolean;
}

export enum SchedulingAlgorithm {
  FCFS = "FCFS",
  SJF = "SJF",
  RR = "RR",
  PRIORITY = "Priority",
  MLFQ = "MLFQ",
}

export interface SimulationState {
  currentTime: number;
  isRunning: boolean;
  selectedAlgorithm: SchedulingAlgorithm;
  quantum?: number;
  activeProcessId?: string | null;
}
