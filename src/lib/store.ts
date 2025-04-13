import { configureStore } from "@reduxjs/toolkit";
import processReducer from "./features/process/processSlice";
import schedulerReducer from "./features/scheduler/schedulerSlice";
import metricsReducer from "./features/metrics/metricsSlice";
import mlfqReducer from "./features/mlfq/mlfqSlice";
import feedbackReducer from "./features/feedback/feedbackSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      processes: processReducer,
      scheduler: schedulerReducer,
      metrics: metricsReducer,
      mlfq: mlfqReducer,
      feedback: feedbackReducer,
    },
    devTools: {
      maxAge: 1000,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
