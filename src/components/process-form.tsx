import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProcessForm = () => (
  <Card>
    <CardHeader>
      <CardTitle>Add Process</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="process-name">Process Name</Label>
        <Input id="process-name" placeholder="P1" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="arrival-time">Arrival Time</Label>
        <Input id="arrival-time" type="number" min="0" placeholder="0" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="burst-time">Burst Time</Label>
        <Input id="burst-time" type="number" min="1" placeholder="5" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Input id="priority" type="number" placeholder="1" />
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Add Process</Button>
    </CardFooter>
  </Card>
);

export default ProcessForm;
