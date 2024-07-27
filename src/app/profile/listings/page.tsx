import verifyToken from "@/app/api/backend-utils/jwt";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

const ListingsPage = async () => {
  const decoded = await verifyToken();

  if (!decoded) {
    redirect("/signin");
  }

  let user;
  let listings;

  try {
    user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        listings: {
          select: {
            id: true,
            title: true,
            price: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      redirect("/signin");
    }

    listings = user.listings;
  } catch (error) {
    console.error("Token verification failed:", error);
    redirect("/signin");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold text-center">My Listings</h1>
      <ul className="space-y-4">
        {listings.map(
          (listing: {
            id: string;
            title: string;
            price: number;
            updatedAt: Date;
          }) => (
            <li key={listing.id} className="border p-4 rounded-lg shadow-lg">
              <Link href={`/profile/listings/${listing.id}`}>
                <div className="block text-lg font-semibold text-blue-500 hover:underline">
                  {listing.title}
                </div>
              </Link>
              <p className="text-gray-700">Price: ₹{listing.price}</p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(listing.updatedAt).toLocaleDateString()}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ListingsPage;
