import { redirect } from "next/navigation";
import { ReactNode } from "react";
import verifyToken from "../api/backend-utils/jwt";
import Sidebar from "../components/SideBar";

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout = async ({ children }: ProfileLayoutProps) => {
  const isLoggedin = await verifyToken();
  if (!isLoggedin) redirect("/signin");
  return (
    <div className="flex min-h-screen p-4 bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 ml-4 bg-white rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
