import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import verifyToken from "../api/backend-utils/jwt";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

const ProfilePage = async () => {
  const decoded = verifyToken();

  if (!decoded) {
    redirect("/signin");
  }

  let user;

  try {
    user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      redirect("/signin");
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    redirect("/signin");
  }

  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-blue-500 rounded-full">
          {initial}
        </div>
      </div>
      <h1 className="mb-4 text-2xl font-bold text-center">Profile</h1>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">
            <strong>Username:</strong> {user.username}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
