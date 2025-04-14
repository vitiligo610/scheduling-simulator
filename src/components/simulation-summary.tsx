"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import GanttChart from "@/components/gantt-chart";
import PerformanceMetrics from "@/components/performance-metrics";
import ProcessesTable from "@/components/processes-table";

const SimulationSummary = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link">
          View Summary
        </Button>
      </SheetTrigger>
      <SheetContent id="simulation-summary" side="right" className="w-[900px] min-w-[900px] h-screen">
        <SheetHeader className="px-4 py-3">
          <div>
            <SheetTitle>Simulation Summary</SheetTitle>
            <SheetDescription>
              Check out detailed performance metrics with process table and gantt chart.
            </SheetDescription>
          </div>
        </SheetHeader>
        <div className="px-4 py-3 flex flex-col gap-4 h-full overflow-y-auto minimal-scrollbar">
          <div className="flex gap-1">
            <GanttChart className="w-full pl-0" />
            <PerformanceMetrics summaryView />
          </div>
          <ProcessesTable summaryView />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SimulationSummary;
