import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = auth(async function GET(req) {
  if (!req.auth || req.auth.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() ?? "";

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
  });

  return NextResponse.json(users);
});

export const POST = auth(async function POST(req) {
  if (!req.auth || req.auth.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
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
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar sócio" },
      { status: 500 },
    );
  }
});
