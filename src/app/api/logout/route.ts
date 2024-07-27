import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const response = new NextResponse(
    JSON.stringify({ message: "Logout successful" }),
    { status: 200 }
  );

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
  response.headers.set("Location", "/");
  return response;
}
