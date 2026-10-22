import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { getCurrentAcademicYearLabel, parseAcademicYear } from "@/lib/academicYear";

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

  let academicYear;

  try {
    academicYear = parseAcademicYear(yearParam, new Date());
  } catch {
    return errorResponse("Invalid academic year", 400);
  }

  try {
    const [totalUsers, yearTotal, registrations] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          since: {
            gte: academicYear.start,
            lt: academicYear.end,
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

    const registrationsByYearMap = new Map<string, number>();

    for (const registration of registrations) {
      if (!registration.since) {
        continue;
      }

      const academicYearLabel = getCurrentAcademicYearLabel(registration.since);
      registrationsByYearMap.set(
        academicYearLabel,
        (registrationsByYearMap.get(academicYearLabel) ?? 0) + 1,
      );
    }

    const registrationsByYear = Array.from(
      registrationsByYearMap,
      ([year, total]) => ({
        year,
        total,
      }),
    ).sort((a, b) => b.year.localeCompare(a.year));

    return successResponse({
      totalUsers,
      selectedYear: academicYear.label,
      yearTotal,
      registrationsByYear,
    });
  } catch (error) {
    console.error(error);

    return errorResponse("An unexpected error occurred", 500);
  }
});
