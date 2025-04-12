import { configureStore } from "@reduxjs/toolkit";
import processReducer from "./features/process/processSlice";
import schedulerReducer from "./features/scheduler/schedulerSlice";
import metricsReducer from "./features/metrics/metricsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      processes: processReducer,
      scheduler: schedulerReducer,
      metrics: metricsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
