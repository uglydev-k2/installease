export interface KpiMetric {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export interface OrderRow {
  id: string;
  customer: string;
  amount: string;
  status: "Placed" | "Confirmed" | "Dispatched" | "Out for Delivery" | "Delivered" | "Cancelled";
  channel: "Web" | "Mobile";
  createdAt: string;
}

export interface InventoryAlert {
  product: string;
  sku: string;
  stock: number;
  threshold: number;
}

export interface TopProduct {
  name: string;
  units: number;
  revenue: string;
  conversion: string;
}

export interface ActivityItem {
  actor: string;
  action: string;
  time: string;
}

export const kpis: KpiMetric[] = [
  { label: "Today Revenue", value: "$14,280", delta: "+18.6%", trend: "up" },
  { label: "Orders Today", value: "132", delta: "+9.2%", trend: "up" },
  { label: "Low Stock Alerts", value: "7", delta: "-3 from yesterday", trend: "up" },
  { label: "New Customers", value: "46", delta: "+12.1%", trend: "up" }
];

export const revenue7Days: RevenuePoint[] = [
  { label: "Mon", revenue: 6200 },
  { label: "Tue", revenue: 7100 },
  { label: "Wed", revenue: 6900 },
  { label: "Thu", revenue: 7400 },
  { label: "Fri", revenue: 9200 },
  { label: "Sat", revenue: 10100 },
  { label: "Sun", revenue: 11200 }
];

export const revenue30Days: RevenuePoint[] = [
  { label: "W1", revenue: 42500 },
  { label: "W2", revenue: 47100 },
  { label: "W3", revenue: 44900 },
  { label: "W4", revenue: 51800 }
];

export const revenue90Days: RevenuePoint[] = [
  { label: "Jan", revenue: 143000 },
  { label: "Feb", revenue: 156000 },
  { label: "Mar", revenue: 171000 }
];

export const recentOrders: OrderRow[] = [
  { id: "ORD-8921", customer: "Nana Ofori", amount: "$289.00", status: "Out for Delivery", channel: "Web", createdAt: "2m ago" },
  { id: "ORD-8918", customer: "Ama Mensah", amount: "$119.00", status: "Confirmed", channel: "Mobile", createdAt: "9m ago" },
  { id: "ORD-8916", customer: "Kwame Asare", amount: "$457.00", status: "Dispatched", channel: "Web", createdAt: "16m ago" },
  { id: "ORD-8913", customer: "Elena Boateng", amount: "$89.00", status: "Delivered", channel: "Mobile", createdAt: "27m ago" },
  { id: "ORD-8908", customer: "Michael Addo", amount: "$210.00", status: "Placed", channel: "Web", createdAt: "41m ago" }
];

export const inventoryAlerts: InventoryAlert[] = [
  { product: "Guardian 4K Smart Camera", sku: "GD-CAM-004", stock: 4, threshold: 10 },
  { product: "Installease Smart Socket Pro", sku: "IL-SKT-001", stock: 7, threshold: 15 },
  { product: "Aura Smart Bulb Pack (4)", sku: "AU-BLB-410", stock: 8, threshold: 20 }
];

export const topProducts: TopProduct[] = [
  { name: "Guardian 4K Smart Camera", units: 312, revenue: "$49,608", conversion: "8.7%" },
  { name: "Installease Smart Lock X", units: 255, revenue: "$45,645", conversion: "7.9%" },
  { name: "Aura Smart Bulb Pack (4)", units: 488, revenue: "$26,840", conversion: "10.2%" },
  { name: "Installease Smart Socket Pro", units: 601, revenue: "$17,429", conversion: "12.4%" }
];

export const activityFeed: ActivityItem[] = [
  { actor: "Warehouse Bot", action: "marked ORD-8916 as Dispatched", time: "3m ago" },
  { actor: "Support Team", action: "resolved compatibility ticket #884", time: "13m ago" },
  { actor: "Inventory Sync", action: "updated stock for 24 SKUs", time: "19m ago" },
  { actor: "Admin", action: "created Spring Security Bundle promo", time: "26m ago" }
];
