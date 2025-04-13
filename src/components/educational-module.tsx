import { InfoIcon as InfoCircle } from "lucide-react";
import EducationalDialog from "@/components/educational-dialog";

const EducationalModule = () => {
  return (
    <div className="rounded-md border flex flex-col flex-1 min-h-0">
      <div className="px-4 py-3 border-b flex-shrink-0 flex items-center justify-between">
        <h3 className="text-md font-medium flex items-center gap-2 ">
          <InfoCircle className="h-4 w-4" />
          Algorithms&#39; Information
        </h3>
        <EducationalDialog />
      </div>

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
    </div>
  );
};

export default EducationalModule;