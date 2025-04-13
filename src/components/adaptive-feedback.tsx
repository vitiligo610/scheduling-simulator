"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { updateFeedbackReport } from "@/lib/features/feedback/feedbackSlice";
import { setAlgorithm } from "@/lib/features/scheduler/schedulerSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const AdaptiveFeedback = () => {
  const dispatch = useAppDispatch();
  const feedback = useAppSelector(state => state.feedback);

  const handleSwitchAlgorithm = () => {
    if (feedback.algorithmSuggestion) {
      const { suggestedAlgorithm, currentAlgorithm } = feedback.algorithmSuggestion;
      console.log(`Adaptive Feedback: Switching from ${currentAlgorithm} to ${suggestedAlgorithm}`);
      dispatch(setAlgorithm(suggestedAlgorithm));
      dispatch(updateFeedbackReport(null));
    }
  };

  if (!feedback || !feedback.algorithmSuggestion) {
    return (
      <div className="rounded-md border flex-shrink-0">
        <div className="px-4 py-3 border-b">
          <h3 className="text-md font-medium">Adaptive Feedback</h3>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          No suggestions at this time.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border flex-shrink-0">
      <div className="px-4 py-3 border-b">
        <h3 className="text-md font-medium">Adaptive Feedback</h3>
      </div>
      <div className="bg-secondary text-secondary-foreground p-4 rounded-md m-4">
        <p className="mb-2 text-sm">
          Based on {feedback.algorithmSuggestion.reason},{" "}
          <strong>{feedback.algorithmSuggestion.suggestedAlgorithm.toUpperCase()}</strong> might be more
          efficient than <strong>{feedback.algorithmSuggestion.currentAlgorithm.toUpperCase()}</strong>.
        </p>
        <p className="text-xs text-muted-foreground">
          {feedback.algorithmSuggestion.estimatedBenefit}
        </p>
      </div>
      <div className="px-4 mb-4">
        <Button
          className="w-full"
          variant="secondary"
          onClick={handleSwitchAlgorithm}
        >
          Switch to {feedback.algorithmSuggestion.suggestedAlgorithm.toUpperCase()}
        </Button>
      </div>
    </div>
  );
};

export default AdaptiveFeedback;