import { ApiError } from "@/lib/server/http";
import { getProfile, upsertProfile } from "@/lib/server/repositories/profile-repo";
import { updateProfileSchema } from "@/lib/server/validators";

export async function fetchProfile(searchParams: URLSearchParams) {
  const id = searchParams.get("id");
  if (!id) throw new ApiError("id query parameter is required.", 400);
  const profile = await getProfile(id);
  if (!profile) throw new ApiError("Profile not found.", 404);
  return profile;
}

export async function saveProfile(body: unknown) {
  const payload = updateProfileSchema.parse(body);
  return upsertProfile(payload);
}
