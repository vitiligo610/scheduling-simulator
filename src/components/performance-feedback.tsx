import PerformanceMetrics from "@/components/performance-metrics";
import AdaptiveFeedback from "@/components/adaptive-feedback";
import EducationalModule from "@/components/educational-module";

const PerformanceFeedback = () => (
  <div className="flex flex-col h-full space-y-4">
    <h2 className="text-lg font-semibold flex-shrink-0">Performance & Feedback</h2>
    <PerformanceMetrics />
    <AdaptiveFeedback />
    <EducationalModule />
  </div>
);

export default PerformanceFeedback;