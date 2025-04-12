"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setAlgorithm, setQuantum, togglePremeption } from "@/lib/features/scheduler/schedulerSlice";
import { SchedulingAlgorithm } from "@/lib/definitions";

const AlgorithmSelector = () => {
  const dispatch = useAppDispatch();
  const scheduler = useAppSelector(state => state.scheduler);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="algorithm" className="text-sm">
          Scheduling Algorithm
        </Label>
        <Select onValueChange={value => dispatch(setAlgorithm(value as SchedulingAlgorithm))}
                value={scheduler.selectedAlgorithm}>
          <SelectTrigger
            id="algorithm"
            className="w-full"
          >
            <SelectValue placeholder="First-Come, First-Served (FCFS)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fcfs">First-Come, First-Served (FCFS)</SelectItem>
            <SelectItem value="sjf">Shortest Job First (SJF)</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="rr">Round Robin (RR)</SelectItem>
            <SelectItem value="mlfq">Multi-Level Feedback Queue (MLFQ)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <Label htmlFor="time-quantum" className="mt-0.5">Time Quantum (for RR)</Label>
        <Input id="time-quantum" type="number" min="1" placeholder="2" value={scheduler.quantum}
               onChange={e => dispatch(setQuantum(Number(e.target.value)))} />
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Label htmlFor="preemptive" className="text-sm">
          Preemptive Mode
        </Label>
        <Checkbox id="preemptive" checked={!!scheduler.preemptive}
                  onCheckedChange={() => dispatch(togglePremeption())} />
      </div>
    </div>
  );
};

export default AlgorithmSelector;
