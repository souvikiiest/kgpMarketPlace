import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
  console.log(JWT_SECRET);

  const { email, password } = await req.json();

  try {
    const userResponse = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!userResponse)
      return new NextResponse(
        JSON.stringify({ message: "Email or password is wrong" }),
        { status: 400 }
      );
    const isValidPassword = await bcrypt.compare(
      password,
      userResponse.password
    );
    if (!isValidPassword)
      return new NextResponse(
        JSON.stringify({ message: "Email or password is wrong" }),
        { status: 400 }
      );

    const token = jwt.sign(
      { userId: userResponse.id, email: userResponse.email },
      JWT_SECRET!,
      { expiresIn: "10h" }
    );
    const response = new NextResponse(JSON.stringify({ token }));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });
    return response;
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Internal server occured" }),
      { status: 500 }
    );
  }
}
