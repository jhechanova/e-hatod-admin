import { TransactionsTable } from "../_components";

export default function TransactionManagementPage() {
  return (
    <div className="rounded-xl border border-[var(--dashboard-content-border)] bg-white p-6 shadow-sm">
      <TransactionsTable />
    </div>
  );
}
