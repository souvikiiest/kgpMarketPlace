import EditProduct from "@/app/components/EditProdcut";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EditListing = async (context: { params: { id: string } }) => {
  const id = context.params.id;
  const data = await prisma.listing.findUnique({
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
      user: {
        select: {
          username: true,
        },
      },
      product: true,
    },
  });
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <EditProduct data={data} />
    </div>
  );
};

export default EditListing;
