import { auth } from "@/auth";
import prisma from "@/lib/prisma";
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
  const yearParam = searchParams.get("year");

  try {
    const currentYear = new Date().getFullYear();

    const selectedYear = yearParam === null ? currentYear : Number(yearParam);

    if (
      !Number.isInteger(selectedYear) ||
      !/^\d{4}$/.test(String(yearParam ?? currentYear)) ||
      selectedYear < 1900 ||
      selectedYear > currentYear
    ) {
      return errorResponse("Invalid registration year", 400);
    }

    const startOfYear = new Date(`${selectedYear}-01-01T00:00:00.000Z`);

    const startOfNextYear = new Date(`${selectedYear + 1}-01-01T00:00:00.000Z`);

    const [totalUsers, yearTotal, registrations] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          since: {
            gte: startOfYear,
            lt: startOfNextYear,
          },
        },
      }),

      prisma.user.findMany({
        where: {
          since: {
            not: null,
          },
        },
        select: {
          since: true,
        },
      }),
    ]);

    const registrationsByYearMap = new Map<number, number>();

    for (const registration of registrations) {
      if (!registration.since) {
        continue;
      }

      const year = registration.since.getUTCFullYear();

      registrationsByYearMap.set(
        year,
        (registrationsByYearMap.get(year) ?? 0) + 1,
      );
    }

    const registrationsByYear = Array.from(
      registrationsByYearMap,
      ([year, total]) => ({
        year,
        total,
      }),
    ).sort((a, b) => b.year - a.year);

    return successResponse({
      totalUsers,
      selectedYear,
      yearTotal,
      registrationsByYear,
    });
  } catch (error) {
    console.error(error);

    return errorResponse("An unexpected error occurred", 500);
  }
});
