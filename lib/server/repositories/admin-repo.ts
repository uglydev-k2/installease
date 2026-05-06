import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminAnalytics() {
  const supabase = createServerSupabaseClient();

  const [{ count: ordersToday }, { count: lowStock }, revenueResult, customersResult] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase.from("products").select("*", { count: "exact", head: true }).lt("stock", 10),
    supabase.from("orders").select("total"),
    supabase.from("profiles").select("id")
  ]);

  if (revenueResult.error) throw revenueResult.error;
  if (customersResult.error) throw customersResult.error;

  const revenue = (revenueResult.data ?? []).reduce((sum, row) => sum + Number(row.total ?? 0), 0);
  return {
    ordersToday: ordersToday ?? 0,
    lowStockAlerts: lowStock ?? 0,
    totalRevenue: revenue,
    totalCustomers: customersResult.data?.length ?? 0
  };
}
