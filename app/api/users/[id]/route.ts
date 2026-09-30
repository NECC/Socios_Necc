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

export const PATCH = auth(async function PATCH(req, { params }) {
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

      select: memberSelect,
    });

    return successResponse(user);
  } catch (error) {
    console.error(error);

    return errorResponse("An unexpected error occurred", 500);
  }
});

export const DELETE = auth(async function DELETE(req, { params }) {
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
    const { id } = await params;

    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    return successResponse(user);
  } catch (error) {
    console.error(error);

    return errorResponse("An unexpected error occurred", 500);
  }
});
