import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

const ListingsPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/signin");
  }

  let user;
  let listings;

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
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
    <div>
      <h1 className="mb-4 text-2xl font-bold text-center">My Listings</h1>
      <ul className="space-y-2">
        {listings.map((listing) => (
          <li key={listing.id}>
            <Link
              href={`/profile/listings/${listing.id}`}
              className="block px-4 py-2 text-blue-500 hover:underline"
            >
              {listing.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListingsPage;
