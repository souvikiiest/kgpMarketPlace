"use client";

import { useRouter } from "next/navigation";

const ListingActions = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/profile/listings/edit/${id}`);
  };

  const handleMarkAsSold = async () => {
    try {
      const response = await fetch(`/api/listings/edit/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to mark as sold");
      }
      router.push("/profile/");
    } catch (error) {
      console.error("Error marking as sold:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleEdit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
      >
        Edit
      </button>
      <button
        onClick={handleMarkAsSold}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Mark as Sold
      </button>
    </div>
  );
};

export default ListingActions;
