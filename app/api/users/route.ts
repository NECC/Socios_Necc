import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";

const memberSelect = {
  id: true,
  name: true,
  email: true,
  studentNumber: true,
  phoneNumber: true,
  memberNumber: true,
};

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return errorResponse("Authentication required", 401);
  }

  if (req.auth.user.role !== "ADMIN") {
    return errorResponse(
      "You do not have permission to perform this action",
      403,
    );
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() ?? "";

  try {
    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,

      orderBy: {
        memberNumber: "asc",
      },

      take: 15,

      select: memberSelect,
    });

    return successResponse(users);
  } catch (error) {
    console.error(error);

    return errorResponse("An unexpected error occurred", 500);
  }
});

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return errorResponse("Authentication required", 401);
  }

  if (req.auth.user.role !== "ADMIN") {
    return errorResponse(
      "You do not have permission to perform this action",
      403,
    );
  }

  try {
    const body = await req.json();

    const { name, email, studentNumber, phoneNumber } = body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        studentNumber,
        phoneNumber,
      },

      select: memberSelect,
    });

    return successResponse(user, 201);
  } catch (error) {
    console.error(error);

    return errorResponse("An unexpected error occurred", 500);
  }
});
