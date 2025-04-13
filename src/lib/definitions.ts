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
  COMPLETED = "completed",
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

export interface MlfqQueueConfig {
  id: number;
  priority: number;
  algorithm: SchedulingAlgorithm.RR;
  quantum: number;
}

export interface MlfqState {
  numQueues: number;
  queuesConfig: MlfqQueueConfig[];
  queueContents: number[][];
  processQueueMap: Record<number, number>;
  currentQueueQuantumUsed: Record<number, number>;
}

export interface AlgorithmSuggestion {
  suggestedAlgorithm: SchedulingAlgorithm;
  currentAlgorithm: SchedulingAlgorithm;
  reason: string;
  estimatedBenefit: string;
}

export interface ParameterSuggestion {
  parameter: string;
  suggestedValue: number | string;
  reasoning: string;
}

export type PerformanceRating = "low" | "medium" | "high" | "very_high" | "very_low" | "n/a";

export interface AlgorithmPerformancePrediction {
  algorithm: SchedulingAlgorithm;
  workloadType: string;
  waitingTime: PerformanceRating;
  turnaroundTime: PerformanceRating;
  responseTime: PerformanceRating;
  throughput: PerformanceRating;
  cpuUtilization: PerformanceRating;
  fairness: PerformanceRating;
  contextSwitches?: PerformanceRating;
  confidence: PerformanceRating;
}

export interface FeedbackState {
  algorithmSuggestion: AlgorithmSuggestion | null;
  analyzedWorkloadType: string | null;
  detectedPattern: string | null;
  anomalies: string[];
  parameterSuggestion: ParameterSuggestion | null;
  performancePredictions: {
    current: AlgorithmPerformancePrediction | null;
    recommended: AlgorithmPerformancePrediction | null;
  } | null;
  lastAnalyzedTime: number;
}

export type FeedbackReport = Omit<FeedbackState, "lastAnalyzedTime">;