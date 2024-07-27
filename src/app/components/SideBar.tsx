"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold">Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link
            href="/profile"
            className={`block px-4 py-2 ${
              pathname === "/profile"
                ? "bg-blue-500 rounded-md text-white"
                : "text-blue-500 rounded-md"
            }`}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/profile/listings"
            className={`block px-4 py-2 ${
              pathname === "/profile/listings"
                ? "bg-blue-500 rounded-md text-white"
                : "text-blue-500 rounded-md"
            }`}
          >
            Listings
          </Link>
        </li>
        <li>
          <Link
            href="/profile/about"
            className={`block px-4 py-2 ${
              pathname === "/profile/about"
                ? "bg-blue-500 rounded-md text-white"
                : "text-blue-500 rounded-md"
            }`}
          >
            About
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
