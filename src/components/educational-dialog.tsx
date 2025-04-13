"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, InfoIcon as InfoCircle } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { pauseSimulation } from "@/lib/features/scheduler/schedulerSlice";

const EducationalDialog = () => {
  const dispatch = useAppDispatch();

  const openDialog = () => {
    dispatch(pauseSimulation());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" onClick={openDialog}>
          <ChevronsUpDown className="rotate-45 h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center">
            <InfoCircle className="h-4 w-4" />
            Algorithms&#39; Information
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 px-4 py-3 overflow-y-auto minimal-scrollbar">
          <h4 className="font-medium">First-Come, First-Served (FCFS)</h4>
          <p className="text-sm">Processes are executed in the order they arrive in the ready queue. It&#39;s simple to
            implement but can suffer from the convoy effect, where short processes get stuck behind long ones, leading
            to high average waiting times.</p>
          <h4 className="font-medium mt-4">Shortest Job First (SJF)</h4>
          <p className="text-sm">Selects the process with the smallest execution time (burst time) to run next. It&#39;s
            provably optimal in minimizing average waiting time but requires knowing burst times in advance, which is
            often not possible (preemptive version is SRTF).</p>
          <h4 className="font-medium mt-4">Priority Scheduling</h4>
          <p className="text-sm">Assigns a priority to each process. The scheduler always selects the process with the
            highest priority (which might be the lowest number). Can be preemptive or non-preemptive. Risk of starvation
            for low-priority processes.</p>
          <h4 className="font-medium mt-4">Round Robin (RR)</h4>
          <p className="text-sm">A preemptive algorithm designed for time-sharing systems. Each process gets a small
            unit of CPU time (time quantum). If the process doesn&#39;t finish within the quantum, it&#39;s moved to the
            end of
            the ready queue. Fair but can have high context switching overhead.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EducationalDialog;