import { ReactNode } from "react";
import Sidebar from "../components/SideBar";

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
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
