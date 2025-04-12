export enum ProcessStatus {
  READY = "ready",
  RUNNING = "running",
  WAITING = "waiting",
  COMPLETED = "completed",
}

export interface Process {
  id: number;
  name: string;
  status: ProcessStatus;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  priority?: number;
  startTime: number | undefined;
  endTime: number | undefined;
}

export enum SchedulingAlgorithm {
  FCFS = "fcfs",
  SJF = "sjf",
  RR = "rr",
  PRIORITY = "priority",
  MLFQ = "mlfq",
}

export enum SimulationStatus {
  RUNNING = "running",
  IDLE = "idle",
  PAUSED = "paused",
}

export interface SimulationState {
  currentTime: number;
  isRunning: boolean;
  selectedAlgorithm: SchedulingAlgorithm;
  quantum?: number;
  activeProcessId?: number | null;
  status: SimulationStatus;
}
