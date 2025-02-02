import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import verifyToken from "../../../backend-utils/jwt";

const prisma = new PrismaClient();

const editProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  price: z.number().positive(),
  condition: z.enum(["new", "refurbished"]),
  category: z.string().min(2),
  imageUrl: z.array(z.string()),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const decodedValue = await verifyToken();
    if (!decodedValue) {
      redirect("/signin");
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const userId = decodedValue.userId;
    const isExisting = await prisma.listing.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
        category: true,
      },
    });
    if (!isExisting)
      return new NextResponse(
        JSON.stringify({ message: "Listing not found" }),
        { status: 404 }
      );
    const body = await req.json();
    const parsedValue = editProductSchema.safeParse(body);
    if (!parsedValue.success)
      return new NextResponse(JSON.stringify(parsedValue.error), {
        status: 400,
      });
    const { title, description, price, condition, category, imageUrl } =
      parsedValue.data;
    let categoryResponse = await prisma.category.findFirst({
      where: { name: category },
    });
    if (!categoryResponse) {
      categoryResponse = await prisma.category.create({
        data: {
          name: category,
        },
      });
    }
    const productResponse = await prisma.product.update({
      where: {
        id: isExisting.productId,
      },
      data: {
        name: title,
        description,
        price,
        condition,
        imageUrl,
      },
    });
    const editResponse = await prisma.listing.update({
      where: {
        id,
        userId,
      },
      data: {
        title,
        description,
        price,
        condition,
        imageUrl,
        categoryId: categoryResponse.id,
        productId: productResponse.id,
        userId: decodedValue.userId,
      },
    });

    return new NextResponse(JSON.stringify({ editResponse }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error occured" }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  try {
    const decodedValue = await verifyToken();
    if (!decodedValue)
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    const userId = decodedValue.userId;
    const listingToDelete = await prisma.listing.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!listingToDelete || listingToDelete.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ message: "Listing not found or unauthorized" }),
        { status: 404 }
      );
    }

    await prisma.listing.delete({
      where: { id },
    });
    await prisma.product.delete({
      where: { id: listingToDelete.productId },
    });

    return new NextResponse(
      JSON.stringify({ message: "Listing deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error occured" }),
      { status: 500 }
    );
  }
}
