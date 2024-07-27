import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import verifyToken from "../../backend-utils/jwt";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decodedValue = verifyToken();
    if (!decodedValue)
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    const userId = decodedValue.userId;

    const allListings = await prisma.listing.findMany({
      where: { userId: decodedValue.userId },
      include: {
        product: {
          select: {
            name: true,
            description: true,
          },
        },
        category: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return new NextResponse(JSON.stringify({ allListings }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error occured" }),
      { status: 500 }
    );
  }
}
