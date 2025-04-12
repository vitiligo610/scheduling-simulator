import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProcessStatusBadge from "./process-status-badge";

const ProcessQueue = () => {
  const processes = [
    { id: "P1", burst: 10, arrival: 0, priority: 3, status: "running" },
    { id: "P2", burst: 5, arrival: 2, priority: 1, status: "waiting" },
    { id: "P3", burst: 8, arrival: 3, priority: 4, status: "waiting" },
    { id: "P4", burst: 3, arrival: 5, priority: 2, status: "waiting" },
    { id: "P5", burst: 6, arrival: 7, priority: 5, status: "waiting" },
    { id: "P6", burst: 6, arrival: 7, priority: 5, status: "waiting" },
    { id: "P7", burst: 6, arrival: 7, priority: 5, status: "waiting" },
    { id: "P8", burst: 6, arrival: 7, priority: 5, status: "waiting" },
  ];

  return (
    <div className="rounded-md border flex flex-col h-full">
      <div className="px-4 py-3 border-b flex-shrink-0">
        <h3 className="text-md font-medium">Process Queue</h3>
      </div>

      <div className="flex-1 overflow-y-auto minimal-scrollbar">
        <Table className="w-full overflow-x-hidden">
          <TableHeader>
            <TableRow className="">
              <TableHead className="text-xs text-muted-foreground p-3 sticky top-0">ID</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3 sticky top-0">BURST</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3 sticky top-0">ARRIVAL</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3 sticky top-0">PRIORITY</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3 sticky top-0">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-x-hidden">
            {processes.map((process) => (
              <TableRow key={process.id} className="border-t">
                <TableCell className="p-3 font-medium">{process.id}</TableCell>
                <TableCell className="p-3">{process.burst}</TableCell>
                <TableCell className="p-3">{process.arrival}</TableCell>
                <TableCell className="p-3">{process.priority}</TableCell>
                <TableCell className="p-3">
                  <ProcessStatusBadge status={process.status as any} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {processes.length === 0 && (
        <div
          className="h-full m-4 border border-dashed rounded-md flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground text-center text-sm">No processes added yet!</p>
        </div>
      )}
    </div>
  );
};

export default ProcessQueue;
