import {
  activityFeed,
  inventoryAlerts,
  kpis,
  recentOrders,
  topProducts
} from "@/lib/data/admin-dashboard";
import { ArrowDownRight, ArrowUpRight, BellRing, Boxes, CircleDollarSign, ClipboardCheck } from "lucide-react";
import { RevenueChart } from "@/components/admin/revenue-chart";

function KpiCards() {
  const icons = [CircleDollarSign, ClipboardCheck, BellRing, Boxes];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, idx) => {
        const Icon = icons[idx];
        return (
          <article key={kpi.label} className="rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-slate-500">{kpi.label}</p>
              <Icon className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="mt-1 flex items-center gap-1 text-sm">
              {kpi.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span className={kpi.trend === "up" ? "text-green-600" : "text-red-600"}>{kpi.delta}</span>
            </p>
          </article>
        );
      })}
    </div>
  );
}

function RecentOrdersTable() {
  const statusColor: Record<(typeof recentOrders)[number]["status"], string> = {
    Placed: "bg-slate-100 text-slate-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Dispatched: "bg-amber-100 text-amber-700",
    "Out for Delivery": "bg-indigo-100 text-indigo-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700"
  };

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <button className="text-sm font-medium text-indigo-600">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2 font-medium">Order</th>
              <th className="pb-2 font-medium">Customer</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Channel</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="py-3 font-medium">{order.id}</td>
                <td className="py-3">{order.customer}</td>
                <td className="py-3">{order.amount}</td>
                <td className="py-3">{order.channel}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RightRail() {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900">
        <h3 className="mb-3 text-base font-semibold">Top Products</h3>
        <div className="space-y-3">
          {topProducts.map((product) => (
            <div key={product.name} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-slate-500">
                {product.units} units · {product.revenue} · {product.conversion} conversion
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900">
        <h3 className="mb-3 text-base font-semibold">Inventory Alerts</h3>
        <div className="space-y-2">
          {inventoryAlerts.map((item) => (
            <div key={item.sku} className="rounded-lg border p-3">
              <p className="font-medium">{item.product}</p>
              <p className="text-xs text-slate-500">
                {item.sku} · {item.stock} left (threshold {item.threshold})
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900">
        <h3 className="mb-3 text-base font-semibold">Activity Feed</h3>
        <div className="space-y-3">
          {activityFeed.map((item, idx) => (
            <div key={`${item.actor}-${idx}`} className="text-sm">
              <p>
                <span className="font-medium">{item.actor}</span> {item.action}
              </p>
              <p className="text-xs text-slate-500">{item.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function DashboardPanels() {
  return (
    <div className="space-y-5">
      <KpiCards />
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <RevenueChart />
          <RecentOrdersTable />
        </div>
        <RightRail />
      </div>
    </div>
  );
}
