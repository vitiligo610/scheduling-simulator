import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackReport, FeedbackState } from "@/lib/definitions";

const initialState: FeedbackState = {
  algorithmSuggestion: null,
  analyzedWorkloadType: null,
  detectedPattern: null,
  anomalies: [],
  parameterSuggestion: null,
  performancePredictions: null,
  lastAnalyzedTime: -1,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    updateFeedbackReport(state, action: PayloadAction<FeedbackReport | null>) {
      if (action.payload === null) {
        state.algorithmSuggestion = null;
        state.analyzedWorkloadType = null;
        state.detectedPattern = null;
        state.anomalies = [];
        state.parameterSuggestion = null;
        state.performancePredictions = null;
      } else {
        state.algorithmSuggestion = action.payload.algorithmSuggestion;
        state.analyzedWorkloadType = action.payload.analyzedWorkloadType;
        state.detectedPattern = action.payload.detectedPattern;
        state.anomalies = action.payload.anomalies;
        state.parameterSuggestion = action.payload.parameterSuggestion;
        state.performancePredictions = action.payload.performancePredictions;
      }
    },
    clearSuggestion(state) {
      state.algorithmSuggestion = null;
    },
    setLastAnalyzedTime(state, action: PayloadAction<number>) {
      state.lastAnalyzedTime = action.payload;
    },
  },
});

export const {
  updateFeedbackReport,
  clearSuggestion,
  setLastAnalyzedTime,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;