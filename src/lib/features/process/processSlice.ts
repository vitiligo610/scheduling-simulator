import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Process } from "@/lib/definitions";

interface ProcessState {
  processes: Process[];
  lastProcessId: number;
}

const initialState: ProcessState = {
  processes: [],
  lastProcessId: 0,
};

const processSlice = createSlice({
  name: "processes",
  initialState,
  reducers: {
    addProcess(state, action: PayloadAction<Process>) {
      action.payload.id = ++state.lastProcessId;
      state.processes.push(action.payload);
    },
    removeProcess(state, action: PayloadAction<number>) {
      state.processes = state.processes.filter((p) => p.id !== action.payload);
    },
    updateProcess(state, action: PayloadAction<Process>) {
      const index = state.processes.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (index !== -1) state.processes[index] = action.payload;
    },
    resetProcesses(state) {
      state.processes = [];
      state.lastProcessId = 0;
    },
  },
});

export const { addProcess, removeProcess, updateProcess, resetProcesses } =
  processSlice.actions;
export default processSlice.reducer;
