import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SchedulingAlgorithm, SimulationState, SimulationStatus } from "@/lib/definitions";

const initialState: SimulationState = {
  currentTime: 0,
  totalBusyTime: 0,
  totalIdleTime: 0,
  isRunning: false,
  selectedAlgorithm: SchedulingAlgorithm.FCFS,
  quantum: 4,
  activeProcessId: null,
  status: SimulationStatus.PAUSED,
  preemptive: false,
  currentQuantumUsed: 0,
  rrQueue: [],
};

const schedulerSlice = createSlice({
  name: "scheduler",
  initialState,
  reducers: {
    startSimulation(state) {
      state.status = SimulationStatus.RUNNING;
      state.isRunning = true;
    },
    pauseSimulation(state) {
      state.status = SimulationStatus.PAUSED;
      state.isRunning = false;
    },
    resetSimulation(state) {
      state.currentTime = 0;
      state.activeProcessId = null;
      state.isRunning = false;
      state.status = SimulationStatus.PAUSED;
      state.quantum = 4;
      state.currentQuantumUsed = 0;
      state.rrQueue = [];
    },
    incrementTime(state) {
      state.currentTime++;
    },
    incrementBusyTime(state) {
      state.totalBusyTime++;
    },
    incrementIdleTime(state) {
      state.totalIdleTime++;
    },
    incrementQuantumUsed(state) {
      state.currentQuantumUsed++;
    },
    resetQuantumUsed(state) {
      state.currentQuantumUsed = 0;
    },
    setSimulationStatus(state, action: PayloadAction<SimulationStatus>) {
      state.status = action.payload;
    },
    setAlgorithm(state, action: PayloadAction<SchedulingAlgorithm>) {
      state.selectedAlgorithm = action.payload;
      state.currentQuantumUsed = 0;
      if (action.payload === SchedulingAlgorithm.FCFS) state.preemptive = false;
      if (action.payload === SchedulingAlgorithm.RR) state.preemptive = true;
    },
    setQuantum(state, action: PayloadAction<number>) {
      state.quantum = action.payload <= 0 ? 1 : action.payload;
    },
    setActiveProcess(state, action: PayloadAction<number | null>) {
      if (state.activeProcessId !== action.payload) state.currentQuantumUsed = 0;
      state.activeProcessId = action.payload;
    },
    togglePremeption(state) {
      state.preemptive = !state.preemptive;
      if (state.selectedAlgorithm === SchedulingAlgorithm.FCFS) state.preemptive = false;
      if (state.selectedAlgorithm === SchedulingAlgorithm.RR) state.preemptive = true;
    },
    pushToRRQueue(state, action: PayloadAction<number>) {
      state.rrQueue = [...state.rrQueue, action.payload];
    },
    popFromRRQueue(state) {
      state.rrQueue = state.rrQueue.slice(1);
    },
    clearRRQueue(state) {
      state.rrQueue = [];
    },
  },
});

export const {
  startSimulation,
  pauseSimulation,
  resetSimulation,
  incrementTime,
  incrementBusyTime,
  incrementIdleTime,
  incrementQuantumUsed,
  resetQuantumUsed,
  setSimulationStatus,
  setAlgorithm,
  setQuantum,
  setActiveProcess,
  togglePremeption,
  pushToRRQueue,
  popFromRRQueue,
  clearRRQueue,
} = schedulerSlice.actions;

export default schedulerSlice.reducer;
