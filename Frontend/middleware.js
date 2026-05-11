// import { NextResponse } from "next/server";
// import { ROUTE_ROLE_MAP, LOGIN_ROUTE, UNAUTHORIZED_ROUTE } from "./src/constants/routes";

// /**
//  * @description Next.js Edge Middleware — runs before every request.
//  *
//  * Token strategy:
//  * - accessToken expired + refreshToken valid  -> let through, axios will refresh silently
//  * - accessToken expired + refreshToken expired -> clear cookies, redirect to login
//  * - accessToken valid -> normal flow
//  *
//  * We check refreshToken expiry as the definitive "is this session dead?" signal.
//  * If refreshToken is gone or expired, the session cannot be recovered.
//  */ 

// // Add "/" to this array
// const PUBLIC_PATHS = ["/", "/login", "/unauthorized", "/_next", "/favicon.ico", "/api", "/notice"];
   

// function decodeJWTPayload(token) {
//   try {
//     const base64Payload = token.split(".")[1];
//     const decoded = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
//     return JSON.parse(decoded);
//   } catch {
//     return null;
//   }
// }

// function isTokenExpired(payload) {
//   if (!payload?.exp) return true;
//   return payload.exp * 1000 < Date.now();
// }

// export function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // -------------------------------- Skip public paths --------------------------------
//   if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
//     return NextResponse.next();
//   }


//   const accessToken = request.cookies.get("accessToken")?.value;
//   const refreshToken = request.cookies.get("refreshToken")?.value;

//   // -------------------------------- No tokens at all -> redirect to login --------------------------------
//   if (!accessToken && !refreshToken) {
//     const loginUrl = new URL(LOGIN_ROUTE, request.url);
//     loginUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // ---------------- Check if the session is truly dead (both tokens expired/missing) -------------------
//   const refreshPayload = refreshToken ? decodeJWTPayload(refreshToken) : null;
//   const isSessionDead = !refreshToken || !refreshPayload || isTokenExpired(refreshPayload);

//   if (isSessionDead) {
//     // Both tokens expired — clear cookies and force re-login
//     const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
//     response.cookies.delete("accessToken");
//     response.cookies.delete("refreshToken");
//     return response;
//   }

//   // - Session is alive (refreshToken valid) — check access token for roles ──
//   // If accessToken is missing/expired but refreshToken is valid,
//   // let the request through — axios interceptor will refresh silently.
//   const accessPayload = accessToken ? decodeJWTPayload(accessToken) : null;
//   const userRoles = accessPayload?.roles || [];

//   // - Strict role-to-route enforcement (only if we have roles from token) ───
//   if (userRoles.length > 0) {
//     const matchedRoute = Object.keys(ROUTE_ROLE_MAP).find((route) =>
//       pathname.startsWith(route)
//     );
//     if (matchedRoute) {
//       const allowedRoles = ROUTE_ROLE_MAP[matchedRoute];
//       const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
//       if (!hasAccess) {
//         return NextResponse.redirect(new URL(UNAUTHORIZED_ROUTE, request.url));
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };





import { NextResponse } from "next/server";
import { ROUTE_ROLE_MAP, LOGIN_ROUTE, UNAUTHORIZED_ROUTE } from "./src/constants/routes";

// 1. Routes that are EXACTLY these strings (Home, About, Contact)
const PUBLIC_EXACT = ["/", "/about", "/contact", "/unauthorized", "/login"];

// 2. Routes where anything inside the folder is public (Dynamic Routes, APIs)
const PUBLIC_PREFIXES = ["/notice/", "/api/", "/_next/", "/favicon.ico"];

function decodeJWTPayload(token) {
  try {
    const base64Payload = token.split(".")[1];
    const decoded = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(payload) {
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ------------------- 1. ALLOW PUBLIC PAGES -------------------
  
  // Check for exact public matches
  if (PUBLIC_EXACT.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for public prefixes (covers /notice/123, /notice/abc)
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // ------------------- 2. AUTHENTICATION LOGIC -------------------
  
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const refreshPayload = refreshToken ? decodeJWTPayload(refreshToken) : null;
  const isSessionDead = !refreshToken || !refreshPayload || isTokenExpired(refreshPayload);

  if (isSessionDead) {
    const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  const accessPayload = accessToken ? decodeJWTPayload(accessToken) : null;
  const userRoles = accessPayload?.roles || [];

  // ------------------- 3. ROLE PROTECTION -------------------
  
  const matchedRoute = Object.keys(ROUTE_ROLE_MAP).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const allowedRoles = ROUTE_ROLE_MAP[matchedRoute];
    const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasAccess) {
      return NextResponse.redirect(new URL(UNAUTHORIZED_ROUTE, request.url));
    }
  }

  return NextResponse.next();
}

// Ensure the matcher doesn't interfere with static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
