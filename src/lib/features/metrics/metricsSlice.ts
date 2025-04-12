import { MetricsState } from "@/lib/definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calculateAndUpdateMetrics } from "@/lib/thunks";

export const initialState: MetricsState = {
  averageWaitingTime: 0,
  averageTurnaroundTime: 0,
  cpuUtilization: 0,
  throughput: 0,
  completionOrder: [],
  lastCalculationTime: -1,
};

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    resetMetrics: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(calculateAndUpdateMetrics.fulfilled, (state, action: PayloadAction<MetricsState>) => {
      state.averageWaitingTime = action.payload.averageWaitingTime;
      state.averageTurnaroundTime = action.payload.averageTurnaroundTime;
      state.cpuUtilization = action.payload.cpuUtilization;
      state.throughput = action.payload.throughput;
      state.completionOrder = action.payload.completionOrder;
      state.lastCalculationTime = action.payload.lastCalculationTime;
    });
  },
});

export const { resetMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;
