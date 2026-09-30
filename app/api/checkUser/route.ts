import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (typeof email !== "string" || !email.trim()) {
      return errorResponse("Email is required", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
      },
    });

    return successResponse({
      exists: !!user,
    });
  } catch (error) {
    console.error("Error checking member:", error);

    return errorResponse("An unexpected error occurred", 500);
  }
}

