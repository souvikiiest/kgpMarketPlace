import { ListingM } from "@/app/types";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
interface ListingModified extends ListingM {
  product: {
    id: string;
    name: string;
    description: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const listings: ListingModified[] = await prisma.listing.findMany({
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
      orderBy: {
        updatedAt: "desc",
      },
      take: 20,
    });

    return new NextResponse(JSON.stringify(listings), { status: 200 });
  } catch (err) {
    console.error("Error fetching listings:", err);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
