import ProcessProgress from "./process-progress";
import ReadyQueue from "./ready-queue";
import AlgorithmSelector from "@/components/algorithm-selector";
import SimulationStatusBadge from "@/components/simulation-status-badge";
import GanttChart from "@/components/gantt-chart";

const Visualization = () => (
  <div className="flex flex-col h-full space-y-6">
    <AlgorithmSelector />
    <div className="flex flex-col flex-1 min-h-0 rounded-md space-y-4 border pb-3">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-md font-medium">Visualization</h3>
        <SimulationStatusBadge />
      </div>
      <div className="flex-1 overflow-y-auto minimal-scrollbar space-y-4">
        <GanttChart />
        <ProcessProgress />
        <ReadyQueue />
      </div>
    </div>
  </div>
);

export default Visualization;
