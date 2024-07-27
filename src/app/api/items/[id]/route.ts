import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const itemId = context.params.id;

  if (!itemId) {
    return new NextResponse(JSON.stringify({ message: "Missing item ID" }), {
      status: 400,
    });
  }

  try {
    const item = await prisma.listing.findUnique({
      where: {
        id: itemId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        condition: true,
        price: true,
        updatedAt: true,
        imageUrl: true,
        user: {
          select: {
            username: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        product: true,
      },
    });

    if (!item) {
      return new NextResponse(JSON.stringify({ message: "Item not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(item), { status: 200 });
  } catch (error) {
    console.error("Error fetching item:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
