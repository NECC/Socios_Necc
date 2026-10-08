import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SearchType } from "@/types/api";
import { successResponse, errorResponse } from "@/lib/apiResponse";

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

  const type = searchParams.get("type") as SearchType | null;
  const value = searchParams.get("value")?.trim() ?? "";

  try {
    if (!type || !value) {
      return errorResponse("Missing search type or value", 400);
    }

    const validSearchTypes: SearchType[] = [
      "name",
      "email",
      "memberNumber",
      "studentNumber",
      "phoneNumber",
      "year",
    ];

    if (!validSearchTypes.includes(type)) {
      return errorResponse("Invalid search type", 400);
    }

    let where;

    switch (type) {
      case "name":
        where = {
          name: {
            contains: value,
            mode: "insensitive" as const,
          },
        };
        break;

      case "email":
        where = {
          email: {
            contains: value,
            mode: "insensitive" as const,
          },
        };
        break;

      case "studentNumber":
        where = {
          studentNumber: {
            contains: value,
            mode: "insensitive" as const,
          },
        };
        break;

      case "phoneNumber":
        where = {
          phoneNumber: {
            contains: value,
          },
        };
        break;

      case "memberNumber": {
        const memberNumber = Number(value);

        if (!Number.isInteger(memberNumber)) {
          return errorResponse("Member number must be a valid number", 400);
        }

        where = {
          memberNumber,
        };

        break;
      }

      case "year": {
        if (!/^\d{4}$/.test(value)) {
          return errorResponse("Invalid registration year", 400);
        }

        const year = Number(value);

        if (year < 1900 || year > 9999) {
          return errorResponse("Invalid registration year", 400);
        }

        const startOfYear = new Date(Date.UTC(year, 0, 1));

        const startOfNextYear = new Date(Date.UTC(year + 1, 0, 1));

        where = {
          since: {
            gte: startOfYear,
            lt: startOfNextYear,
          },
        };

        break;
      }
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: {
        memberNumber: "asc",
      },
      take: type === "year" ? undefined : 15,
      select: {
        id: true,
        name: true,
        email: true,
        studentNumber: true,
        phoneNumber: true,
        memberNumber: true,
      },
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

      select: {
        id: true,
        name: true,
        email: true,
        studentNumber: true,
        phoneNumber: true,
        memberNumber: true,
      },
    });

    return successResponse(user);
  } catch (error) {
    console.error(error);
    return errorResponse("An unexpected error occurred", 500);
  }
});
