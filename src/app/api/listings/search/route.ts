import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";
  const response = await prisma.listing.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      condition: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      productId: true,
      categoryId: true,
      product: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });
  return new NextResponse(JSON.stringify(response), { status: 200 });
}
