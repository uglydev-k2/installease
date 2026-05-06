import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/server/http";
import { fetchProfile, saveProfile } from "@/lib/server/services/profile-service";

export async function GET(request: NextRequest) {
  try {
    const data = await fetchProfile(request.nextUrl.searchParams);
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await saveProfile(body);
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
