import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import verifyToken from "../backend-utils/jwt";
const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(2),
  price: z.number().positive(),
  condition: z.enum(["new", "used"]),
  category: z.string().min(3),
  imageUrl: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
      console.log("error from zod", validatedData.error);

      return new NextResponse(JSON.stringify(validatedData.error), {
        status: 400,
      });
    }
    const { name, description, price, condition, category, imageUrl } =
      validatedData.data;

    const decodedValue = await verifyToken();
    if (!decodedValue)
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 400,
      });
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

    const productResponse = await prisma.product.create({
      data: {
        name,
        description,
        price,
        condition,
        imageUrl,
      },
    });

    const listingResponse = await prisma.listing.create({
      data: {
        title: name,
        description,
        price,
        condition,
        imageUrl,
        category: { connect: { id: categoryResponse.id } },
        product: { connect: { id: productResponse.id } },
        user: { connect: { id: decodedValue.userId } },
      },
    });
    return new NextResponse(JSON.stringify({ listingResponse }), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server occured" }),
      { status: 500 }
    );
  }
}
