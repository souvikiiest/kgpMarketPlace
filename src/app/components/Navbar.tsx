import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";
import HandleLogout from "./handleLogout";

const Navbar = async () => {
  let isAuthenticated = false;

  const token = cookies().get("token");

  if (token) {
    try {
      jwt.verify(token.value, process.env.JWT_SECRET!);
      isAuthenticated = true;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  return (
    <nav className="flex items-center justify-between p-2 md:p-4 bg-gray-800">
      <Link href="/" className="text-white text-sm md:text-xl">
        KGP MARKETPLACE
      </Link>
      <div className="flex  space-x-1 md:space-x-4 md:space-y-0 ">
        {isAuthenticated ? (
          <>
            <Link
              href="/new-listings"
              className="text-white flex bg-blue-500 text-xs items-center md:text-base px-2 md:px-4 py-1 md:py-2 rounded-md"
            >
              ADD PRODUCT
            </Link>
            <Link
              href="/profile"
              className="text-white flex items-center bg-green-500 text-xs md:text-base px-2 md:px-4 py-1 md:py-2 rounded-md"
            >
              Profile
            </Link>
            <HandleLogout />
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className="text-white flex items-center bg-blue-500 text-xs md:text-base px-2 md:px-4 py-1 md:py-2 rounded-md"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-white bg-blue-500 text-xs md:text-base px-2 md:px-4 py-1 md:py-2 rounded-md"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
