import { Button } from "@/components/ui/button";

const AdaptiveFeedback = () => {
  return (
    <div className="rounded-md border flex-shrink-0">
      <div className="px-4 py-3 border-b">
        <h3 className="text-md font-medium">Adaptive Feedback</h3>
      </div>
      <div className="bg-secondary text-secondary-foreground p-4 rounded-md m-4">
        <p className="mb-2 text-sm">
          Based on your current workload, <strong>SJF</strong> might be more efficient than <strong>FCFS</strong>.
        </p>
        <p className="text-xs text-muted-foreground">Expected improvement: ~35% reduction in average waiting time</p>
      </div>
      <div className="px-4 mb-4">
        <Button className="w-full" variant="secondary">Switch to SJF</Button>
      </div>
    </div>
  );
};

export default AdaptiveFeedback;