import ListingActions from "@/app/components/ListingsAction";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { Key } from "react";

const prisma = new PrismaClient();
export default async function dataDetails(context: { params: { id: string } }) {
  const id = context.params.id;
  const data: any = await prisma.listing.findUnique({
    where: {
      id,
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
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <div className="mb-4">
        {data.imageUrl &&
          data.imageUrl.map((url: string | undefined, index: Key) => (
            <Image
              key={index}
              height={200}
              width={200}
              src={url!}
              alt={data.title}
              className="w-48 h-48 object-cover mr-2"
            />
          ))}
      </div>
      <p className="mb-4">
        <strong>Description:</strong> {data.description}
      </p>
      <p className="mb-4">
        <strong>Price:</strong> ₹{data.price}
      </p>
      <p className="mb-4">
        <strong>Condition:</strong> {data.condition}
      </p>
      <p className="mb-4">
        <strong>Category:</strong> {data.category.name}
      </p>
      <ListingActions id={data.id} />
    </div>
  );
}
