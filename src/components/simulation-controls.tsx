import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, RefreshCw } from "lucide-react";
import SimulationStatusBadge from "@/components/simulation-status-badge";

const SimulationControls = () => (
  <Card>
    <CardHeader>
      <CardTitle>Simulation Controls</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          Start
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <Pause className="h-4 w-4" />
          Pause
        </Button>
        <Button variant="destructive" className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Current Time:</span>
          <span className="text-sm">0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">Active Process:</span>
          <span className="text-sm">None</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status:</span>
          <SimulationStatusBadge status="idle" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default SimulationControls;
