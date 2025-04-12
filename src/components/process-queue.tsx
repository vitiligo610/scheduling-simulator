"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProcessStatusBadge from "./process-status-badge";
import { useAppSelector } from "@/lib/hooks";
import { ProcessStatus } from "@/lib/definitions";

const ProcessQueue = () => {
  const processes = useAppSelector(state => state.processes.processes);

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
              <TableHead className="text-xs text-muted-foreground p-3 sticky top-0">REMAINING</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3 sticky top-0">PRIORITY</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3 sticky top-0">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => (
              <TableRow key={process.id} className="border-t">
                <TableCell className="p-3 font-medium">{process.id}</TableCell>
                <TableCell className="p-3">{process.burstTime}</TableCell>
                <TableCell className="p-3">{process.arrivalTime}</TableCell>
                <TableCell className="p-3">{process.remainingTime}</TableCell>
                <TableCell className="p-3">{process.priority}</TableCell>
                <TableCell className="p-3">
                  <ProcessStatusBadge status={process.status as ProcessStatus} />
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
