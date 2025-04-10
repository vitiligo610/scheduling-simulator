import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Process } from "@/lib/definitions";

interface ProcessState {
  processes: Process[];
}

const initialState: ProcessState = {
  processes: [],
};

const processSlice = createSlice({
  name: "processes",
  initialState,
  reducers: {
    addProcess(state, action: PayloadAction<Process>) {
      state.processes.push(action.payload);
    },
    removeProcess(state, action: PayloadAction<string>) {
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
    },
  },
});

export const { addProcess, removeProcess, updateProcess, resetProcesses } =
  processSlice.actions;
export default processSlice.reducer;
