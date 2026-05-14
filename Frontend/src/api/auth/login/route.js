// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${process.env.API_BASE_URL}/api/v1/auths/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message || "লগইন ব্যর্থ হয়েছে" },
      { status: res.status }
    );
  }

  // ⚠️ Adjust this to match your actual backend response shape
  const { accessToken, refreshToken, user } = data.data;

  const response = NextResponse.json({
    success: true,
    data: { user },
  });

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",   // lax is fine since same domain now
    maxAge: 60 * 15,   // 15 minutes
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
