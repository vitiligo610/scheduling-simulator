"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProcessStatusBadge from "./process-status-badge";
import { useAppSelector } from "@/lib/hooks";
import { ProcessStatus, SchedulingAlgorithm } from "@/lib/definitions";
import ProcessQueueButtons from "@/components/process-queue-buttons";
import MlfqConfigDialog from "@/components/mlfq-config-dialog";
import ProcessActionButtons from "@/components/process-action-buttons";

const ProcessesTable = ({ summaryView = false }: { summaryView?: boolean; }) => {
  const processes = useAppSelector(state => state.processes.processes);
  const scheduler = useAppSelector(state => state.scheduler);

  return (
    <div className="rounded-md border flex flex-col h-full">
      <div className="px-4 py-3 border-b flex-shrink-0 flex items-center justify-between">
        <h3 className="text-md font-medium">Processes Table</h3>
        {!summaryView && scheduler.selectedAlgorithm === SchedulingAlgorithm.MLFQ && <MlfqConfigDialog />}
        {!summaryView && <ProcessQueueButtons />}
      </div>

      <div className="flex-1 overflow-y-auto minimal-scrollbar">
        <Table className="w-full overflow-x-hidden">
          <TableHeader>
            <TableRow className="">
              <TableHead className="text-xs text-muted-foreground p-3">ID</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3">STATUS</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3">PRIORITY</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3">ARRIVAL</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3">BURST</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3">REMAINING</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3">START</TableHead>
              <TableHead className="text-xs text-muted-foreground p-3">END</TableHead>
              {!summaryView && <TableHead className="sr-only">ACTIONS</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => (
              <TableRow key={process.id} className="border-t">
                <TableCell className="p-3 font-medium">P{process.id}</TableCell>
                <TableCell className="p-3">
                  <ProcessStatusBadge
                    status={process.id === scheduler.activeProcessId ? ProcessStatus.RUNNING : process.status as ProcessStatus} />
                </TableCell>
                <TableCell className="p-3">{process.priority}</TableCell>
                <TableCell className="p-3">{process.arrivalTime}</TableCell>
                <TableCell className="p-3">{process.burstTime}</TableCell>
                <TableCell className="p-3">{process.remainingTime}</TableCell>
                <TableCell className="p-3">{process.startTime !== undefined ? process.startTime : "-"}</TableCell>
                <TableCell className="p-3">{process.endTime || "-"}</TableCell>
                {!summaryView && <TableCell className="p-3 space-x-3">
                  <ProcessActionButtons processId={process.id} />
                </TableCell>}
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

export default ProcessesTable;
