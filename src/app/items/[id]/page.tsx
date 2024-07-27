import verifyToken from "@/app/api/backend-utils/jwt";
import CarouselComponent from "@/app/components/CarouselComponent";
import EmailButtonComponent from "@/app/components/EmailButtonComponent";
import { PrismaClient } from "@prisma/client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const prisma = new PrismaClient();

interface buyerData {
  phoneNo: string;
  email: string;
  username: string;
}
export default async function itemDetails(context: { params: { id: string } }) {
  const tokenResponse = await verifyToken();
  const isLoggedIn = tokenResponse?.userId ? true : false;
  let buyer: buyerData = {
    phoneNo: "",
    email: "",
    username: "",
  };
  if (isLoggedIn) {
    const user = await prisma.user.findUnique({
      where: {
        id: tokenResponse?.userId,
      },
      select: {
        phoneNo: true,
        email: true,
        username: true,
      },
    });

    if (user) {
      buyer = {
        phoneNo: user.phoneNo,
        email: user.email,
        username: user.username,
      };
    }
  }
  const id = context.params.id;
  const data: any = await prisma.listing.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      description: true,
      condition: true,
      price: true,
      updatedAt: true,
      imageUrl: true,
      user: {
        select: {
          username: true,
          email: true,
          phoneNo: true,
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
  const sellerData = {
    email: data.user.email,
    phoneNo: data.user.phoneNo,
    title: data.title,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <div className="mb-4">
        <CarouselComponent data={data} />
      </div>
      <p className="mb-4">
        <strong>Description:</strong> {data.description}
      </p>
      <p className="mb-4">
        <strong>Uploaded by:</strong> {data.user.username}
      </p>
      <p className="mb-4">
        <strong>Last updated:</strong>{" "}
        {new Date(data.updatedAt).toLocaleString()}
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
      <EmailButtonComponent
        isLoggedIn={isLoggedIn}
        buyerData={buyer}
        sellerData={sellerData}
      />
    </div>
  );
}
