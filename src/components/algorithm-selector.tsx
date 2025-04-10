import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AlgorithmSelector = () => (
  <Card>
    <CardHeader>
      <CardTitle>Algorithm Selection</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="algorithm">Scheduling Algorithm</Label>
        <Select>
          <SelectTrigger id="algorithm">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fcfs">
              First Come First Served (FCFS)
            </SelectItem>
            <SelectItem value="sjf">Shortest Job First (SJF)</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="rr">Round Robin</SelectItem>
            <SelectItem value="mlfq">
              Multi-Level Feedback Queue (MLFQ)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time-quantum">Time Quantum</Label>
        <Input id="time-quantum" type="number" min="1" placeholder="2" />
      </div>
    </CardContent>
  </Card>
);

export default AlgorithmSelector;
