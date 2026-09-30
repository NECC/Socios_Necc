import { auth } from "@/auth";

export const proxy = auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname === "/dashboard") {
    if (req.auth.user.role !== "ADMIN") {
      return Response.redirect(new URL("/card", req.url));
    }
  }
});

export const config = {
  matcher: ["/card", "/dashboard"],
};