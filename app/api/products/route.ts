import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/server/http";
import { fetchCatalog } from "@/lib/server/services/catalog-service";

export async function GET(request: NextRequest) {
  try {
    const data = await fetchCatalog(request.nextUrl.searchParams);
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
