import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const PATCH = auth(async function PATCH(req, { params }) {
  if (!req.auth || req.auth.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { name, email, studentNumber, phoneNumber } = await req.json();

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        studentNumber,
        phoneNumber,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao atualizar sócio" },
      { status: 500 },
    );
  }
});

export const DELETE = auth(async function DELETE(req, { params }) {
  if (!req.auth || req.auth.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const { id } = await params;

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Sócio apagado com sucesso",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao apagar sócio" },
      { status: 500 },
    );
  }
});
