import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SchedulingAlgorithm, SimulationState, SimulationStatus } from "@/lib/definitions";

const initialState: SimulationState = {
  currentTime: 0,
  isRunning: false,
  selectedAlgorithm: SchedulingAlgorithm.FCFS,
  quantum: 4,
  activeProcessId: null,
  status: SimulationStatus.PAUSED,
  preemptive: false,
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
    },
    incrementTime(state) {
      state.currentTime++;
    },
    setSimulationStatus(state, action: PayloadAction<SimulationStatus>) {
      state.status = action.payload;
    },
    setAlgorithm(state, action: PayloadAction<SchedulingAlgorithm>) {
      state.selectedAlgorithm = action.payload;
    },
    setQuantum(state, action: PayloadAction<number>) {
      state.quantum = action.payload <= 0 ? 1 : action.payload;
    },
    setActiveProcess(state, action: PayloadAction<number | null>) {
      state.activeProcessId = action.payload;
    },
    togglePremeption(state) {
      state.preemptive = !state.preemptive;
    },
  },
});

export const {
  startSimulation,
  pauseSimulation,
  resetSimulation,
  incrementTime,
  setSimulationStatus,
  setAlgorithm,
  setQuantum,
  setActiveProcess,
  togglePremeption,
} = schedulerSlice.actions;
export default schedulerSlice.reducer;
