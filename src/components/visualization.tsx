import GanttChart from "./gantt-chart";
import ProcessProgress from "./process-progress";
import ReadyQueue from "./ready-queue";
import AlgorithmSelector from "@/components/algorithm-selector";
import SimulationStatusBadge from "@/components/simulation-status-badge";

const Visualization = () => (
  <div className="space-y-6">
    <AlgorithmSelector />
    <div className="rounded-md space-y-4 border pb-3">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-md font-medium">Visualization</h3>
        <SimulationStatusBadge />
      </div>
      <GanttChart />
      <ProcessProgress />
      <ReadyQueue />
    </div>
  </div>
);

export default Visualization;
