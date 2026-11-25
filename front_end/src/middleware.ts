// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const token = request.cookies.get("accessToken")?.value;
//   // const role = request.cookies.get("role")?.value;

//   const { pathname } = request.nextUrl;

//   const isCentersList = pathname === "/centers";

//   if (isCentersList) {
//     return NextResponse.next();
//   }

//   const isCenterProfileRoute = /^\/centers\/[^/]+(\/.*)?$/.test(pathname);

//   if (isCenterProfileRoute && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   const isTeacherProfileRoute = /^\/teachers\/[^/]+(\/.*)?$/.test(pathname);

//   if (isTeacherProfileRoute && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (pathname.startsWith("/dashboard/") && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (token && role) {
//     if (pathname.startsWith("/dashboard/student") && role !== "student") {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }

//     if (pathname.startsWith("/dashboard/teacher") && role !== "teacher") {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }

//     if (pathname.startsWith("/dashboard/center") && role !== "center") {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//   }

//   return NextResponse.next();
// }
// export const config = {
//   matcher: ["/centers/:id*", "/teachers/:id*", "/dashboard/:path*"],
// };

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

type UserRole = "student" | "teacher" | "center";

async function verifyAccessToken(token: string) {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  const secretKey = new TextEncoder().encode(secret);

  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });

  return payload;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  const isCentersList = pathname === "/centers";

  if (isCentersList) {
    return NextResponse.next();
  }

  const isCenterProfileRoute = /^\/centers\/[^/]+(\/.*)?$/.test(pathname);

  const isTeacherProfileRoute = /^\/teachers\/[^/]+(\/.*)?$/.test(pathname);

  const isDashboardRoute = pathname.startsWith("/dashboard/");

  const requiresAuth =
    isCenterProfileRoute || isTeacherProfileRoute || isDashboardRoute;

  if (!requiresAuth) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let role: UserRole;

  try {
    const payload = await verifyAccessToken(token);

    const tokenRole = payload.role;

    if (
      tokenRole !== "student" &&
      tokenRole !== "teacher" &&
      tokenRole !== "center"
    ) {
      throw new Error("Invalid user role");
    }

    role = tokenRole;
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("accessToken");

    return response;
  }

  const dashboardRole = pathname.match(
    /^\/dashboard\/(student|teacher|center)(?:\/|$)/,
  )?.[1];

  if (dashboardRole && dashboardRole !== role) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/centers/:id*", "/teachers/:id*", "/dashboard/:path*"],
};
