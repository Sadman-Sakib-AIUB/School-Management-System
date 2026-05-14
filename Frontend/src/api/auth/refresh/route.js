// src/app/api/auth/refresh/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const res = await fetch(`${process.env.API_BASE_URL}/api/v1/auths/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    const response = NextResponse.json(
      { error: "Refresh failed" },
      { status: 401 }
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  const data = await res.json();
  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", data.data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });

  return response;
}
