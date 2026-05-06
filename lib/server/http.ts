import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ApiError) {
    return fail(error.message, error.status);
  }
  if (error instanceof Error) {
    return fail(error.message, 500);
  }
  return fail("Unexpected server error.", 500);
}
