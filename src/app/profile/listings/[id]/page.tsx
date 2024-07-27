import CarouselComponent from "@/app/components/CarouselComponent";
import ListingActions from "@/app/components/ListingsAction";
import { PrismaClient } from "@prisma/client";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
    <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 sm:text-4xl">
        {data.title}
      </h1>

      <div className="mb-6">
        <CarouselComponent data={data} />
      </div>

      <div className="space-y-4">
        <p className="text-lg text-gray-700">
          <strong className="font-semibold">Description:</strong>{" "}
          {data.description}
        </p>
        <p className="text-lg text-gray-700">
          <strong className="font-semibold">Price:</strong> ₹
          {data.price.toFixed(2)}
        </p>
        <p className="text-lg text-gray-700">
          <strong className="font-semibold">Condition:</strong> {data.condition}
        </p>
        <p className="text-lg text-gray-700">
          <strong className="font-semibold">Category:</strong>{" "}
          {data.category.name}
        </p>
      </div>

      <div className="mt-6">
        <ListingActions id={data.id} />
      </div>
    </div>
  );
}
