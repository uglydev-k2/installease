import { Download, Plus } from "lucide-react";
import { DashboardPanels } from "@/components/admin/dashboard-panels";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-3 rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900">
        <div>
          <h1 className="text-3xl font-bold">Admin Command Center</h1>
          <p className="text-sm text-slate-500">
            Real-time commerce operations for installease across revenue, orders, and inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
      </section>

      <div className="rounded-xl border bg-indigo-600 p-4 text-white shadow-sm">
        <p className="text-xs uppercase tracking-wide text-indigo-100">Priority Alert</p>
        <p className="text-sm font-medium">
          Stock on smart cameras dropped below safety threshold in 2 warehouses. Recommended restock window: next 18 hours.
        </p>
      </div>

      <DashboardPanels />
    </div>
  );
}
