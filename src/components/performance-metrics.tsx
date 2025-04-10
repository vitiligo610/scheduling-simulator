import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PerformanceMetrics = () => (
  <Card>
    <CardHeader>
      <CardTitle>Performance Metrics</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Average Waiting Time:</span>
          <span className="text-sm">N/A</span>
        </div>
        <div className="flex justify-between">
            <span className="text-sm font-medium">
              Average Turnaround Time:
            </span>
          <span className="text-sm">N/A</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">CPU Utilization:</span>
          <span className="text-sm">N/A</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">Throughput:</span>
          <span className="text-sm">N/A</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default PerformanceMetrics;
