"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearProcesses, resetProcesses } from "@/lib/features/process/processSlice";
import { clearSuggestion } from "@/lib/features/feedback/feedbackSlice";

const ProcessQueueButtons = () => {
  const currentTime = useAppSelector(state => state.scheduler.currentTime);
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" onClick={() => dispatch(resetProcesses(currentTime ?? 0))}>
              <RefreshCw />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Processes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider><TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="destructive" onClick={() => {
            dispatch(clearProcesses());
            dispatch(clearSuggestion());
          }}>
            <Trash />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear All Processes</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    </div>
  );
};

export default ProcessQueueButtons;