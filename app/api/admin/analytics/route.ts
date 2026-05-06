import { handleRouteError, ok } from "@/lib/server/http";
import { fetchAdminAnalytics } from "@/lib/server/services/admin-service";
import { requireAdminApiAccess } from "@/lib/server/admin-auth";

export async function GET() {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const data = await fetchAdminAnalytics();
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
