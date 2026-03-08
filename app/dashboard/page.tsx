import { DashboardLayout } from "@/components/dashboard-layout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="rounded-xl border border-[var(--dashboard-content-border)] bg-white p-6 shadow-sm">
        <p className="text-[var(--dashboard-text-on-light-muted)]">
          Welcome to BOHOL e-Hatod. Select an item from the sidebar to get
          started.
        </p>
      </div>
    </DashboardLayout>
  );
}
