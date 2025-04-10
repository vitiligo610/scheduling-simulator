import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GanttChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Gantt Chart</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-32 border border-dashed rounded-md flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Gantt Chart will appear here</p>
      </div>
    </CardContent>
  </Card>
);

export default GanttChart;
