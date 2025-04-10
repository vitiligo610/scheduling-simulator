import ProcessForm from "@/components/process-form";
import SimulationControls from "@/components/simulation-controls";
import AlgorithmSelector from "@/components/algorithm-selector";
import ProcessList from "@/components/process-list";
import GanttChart from "@/components/gantt-chart";
import QueueVisualization from "@/components/queue-visualization";
import PerformanceMetrics from "@/components/performance-metrics";

const Page = () => (
  <div className="container mx-auto py-6 px-10">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Controls (1/3 width) */}
      <div className="space-y-6">
        <SimulationControls />
        <AlgorithmSelector />
        <ProcessForm />
      </div>

      {/* Right Column - Visualizations (2/3 width) */}
      <div className="md:col-span-2 space-y-6">
        <ProcessList />
        <GanttChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QueueVisualization />
          <PerformanceMetrics />
        </div>
      </div>
    </div>
  </div>
);

export default Page;