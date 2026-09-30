import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      status: "success",
      data,
    },
    { status },
  );
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      status: "error",
      message,
    },
    { status },
  );
}
