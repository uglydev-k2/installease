import { handleRouteError, ok } from "@/lib/server/http";
import { fetchAdminAnalytics } from "@/lib/server/services/admin-service";

export async function GET() {
  try {
    const data = await fetchAdminAnalytics();
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
