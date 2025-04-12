import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SimulationStatus } from "@/lib/definitions";

interface SimulationStatusBadgeProps {
  status: SimulationStatus;
  className?: string;
}

const SimulationStatusBadge = ({ status, className }: SimulationStatusBadgeProps) => {
  const statusStyles = {
    idle: "bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200",
    running: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    paused: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
  };

  const displayText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {displayText}
    </Badge>
  );
};

export default SimulationStatusBadge;
