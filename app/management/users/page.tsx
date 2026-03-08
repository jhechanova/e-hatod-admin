import { UsersTable } from "../_components";

export default function UserManagementPage() {
  return (
    <div className="rounded-xl border border-[var(--dashboard-content-border)] bg-white p-6 shadow-sm">
      <UsersTable />
    </div>
  );
}
