export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 dark:bg-slate-900">Today's Revenue</div>
        <div className="rounded-xl border bg-white p-4 dark:bg-slate-900">Orders Today</div>
        <div className="rounded-xl border bg-white p-4 dark:bg-slate-900">Low Stock Alerts</div>
        <div className="rounded-xl border bg-white p-4 dark:bg-slate-900">New Customers</div>
      </div>
    </div>
  );
}
