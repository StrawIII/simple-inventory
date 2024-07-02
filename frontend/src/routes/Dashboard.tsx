import { Sidebar } from "../components/Sidebar";
import { Table } from "../components/Table";

export function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <Table />
    </div>
  );
}
