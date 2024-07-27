import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10).max(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = userSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(JSON.stringify(validationResult.error), {
        status: 400,
      });
    }

    const { username, email, password, phone } = validationResult.data; // Use validated data

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "User with same email already exists" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phoneNo: phone,
      },
    });
    return new NextResponse(
      JSON.stringify({ message: "User created successfully" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
