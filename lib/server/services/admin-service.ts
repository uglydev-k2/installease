import { getAdminAnalytics } from "@/lib/server/repositories/admin-repo";

export async function fetchAdminAnalytics() {
  return getAdminAnalytics();
}
