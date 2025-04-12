const PerformanceMetrics = () => (
  <div className="rounded-md border flex flex-col flex-shrink-0">
    <div className="px-4 py-3 border-b">
      <h3 className="text-md font-medium">Performance Metrics</h3>
    </div>
    <div className="grid grid-cols-2 gap-4 p-4">
      <div>
        <div className="text-sm text-muted-foreground">Avg. Waiting Time</div>
        <div className="text-lg font-semibold">4.2 ms</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Avg. Turnaround Time</div>
        <div className="text-lg font-semibold">9.6 ms</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">CPU Utilization</div>
        <div className="text-lg font-semibold">78%</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Throughput</div>
        <div className="text-lg font-semibold">0.12 p/ms</div>
      </div>
    </div>
  </div>
);

export default PerformanceMetrics;
