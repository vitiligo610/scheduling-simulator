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
  priority: number;
  startTime: number | undefined;
  endTime: number | undefined;
  color: string;
  startedAt: number[];
  stoppedAt: number[];
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
  totalBusyTime: number;
  totalIdleTime: number;
  isRunning: boolean;
  selectedAlgorithm: SchedulingAlgorithm;
  quantum: number;
  activeProcessId?: number | null;
  status: SimulationStatus;
  preemptive: boolean;
  currentQuantumUsed: number;
  rrQueue: number[];
}

export interface MetricsState {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  cpuUtilization: number;
  throughput: number;
  completionOrder: number[];
  lastCalculationTime: number;
}

export interface PerformanceMetrics {
  avgTurnaroundTime: number;
  avgWaitingTime: number;
  avgResponseTime: number;
  cpuUsage: number;
  throughput: number;
}