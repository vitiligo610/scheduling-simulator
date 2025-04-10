import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProcessStatusBadge from "@/components/process-status-badge";

const ProcessList = () => (
  <Card>
    <CardHeader>
      <CardTitle>Process List</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Arrival</TableHead>
            <TableHead>Burst</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>P1</TableCell>
            <TableCell>0</TableCell>
            <TableCell>5</TableCell>
            <TableCell>2</TableCell>
            <TableCell>5</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>
              <ProcessStatusBadge status="ready" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>P2</TableCell>
            <TableCell>2</TableCell>
            <TableCell>3</TableCell>
            <TableCell>1</TableCell>
            <TableCell>3</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>
              <ProcessStatusBadge status="waiting" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell>P3</TableCell>
            <TableCell>4</TableCell>
            <TableCell>7</TableCell>
            <TableCell>3</TableCell>
            <TableCell>7</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>
              <ProcessStatusBadge status="running" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default ProcessList;