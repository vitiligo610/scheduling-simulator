import Navbar from "@/components/navbar";
import ProcessManagement from "@/components/process-management";
import Visualization from "@/components/visualization";
import PerformanceFeedback from "@/components/performance-feedback";

const SimulatorPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-r p-4">
          <ProcessManagement />
        </div>
        <div className="w-2/4 border-r p-4 overflow-y-auto">
          <Visualization />
        </div>
        <div className="w-1/4 p-4 overflow-y-auto">
          <PerformanceFeedback />
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;
