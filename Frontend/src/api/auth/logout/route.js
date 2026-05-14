// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    await fetch(`${process.env.API_BASE_URL}/api/v1/auths/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch { /* fail silently */ }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}
