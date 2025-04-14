import ProcessesTable from "./processes-table";
import ProcessForm from "./process-form";

const ProcessManagement = () => (
  <div className="flex flex-col gap-4 h-full">
    <h2 className="text-lg font-semibold">Process Management</h2>
    <div className="flex-shrink-0">
      <ProcessForm />
    </div>
    <div className="flex-1 min-h-0">
      <ProcessesTable />
    </div>
  </div>
);

export default ProcessManagement;