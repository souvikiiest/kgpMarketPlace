"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateListing } from "../actions/updateListings"; // This should be the path to your server action file

const EditProductForm = ({ data }: any) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: data.title,
    description: data.description,
    price: data.price,
    condition: data.condition,
    category: data.category,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      if (e.target.files) {
        const files = Array.from(e.target.files);
        const fileUrls: string[] = [];
        for (const file of files) {
          const fileUrl: string = await handleImageUpload(file);
          fileUrls.push(fileUrl);
        }

        setImageUrls([...imageUrls, ...fileUrls]);
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage("Failed to upload image, please try again ");
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadData.status) {
        setErrorMessage("Failed to upload image, please try again ");
        throw new Error("Failed to upload image");
      }
      return uploadData.fileUrl;
    } catch (error) {
      setErrorMessage("Failed to upload image, please try again ");
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: imageUrls,
      };

      const response = await updateListing(data.id, updatedData);

      if (response.ok) {
        router.push("/home");
      } else {
        setErrorMessage("Failed to update, please check constraints ");
        console.error("Error updating listing:", response.error);
      }
    } catch (error) {
      setErrorMessage("Failed to update, please check constraints ");
      console.error("Error updating listing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="title"
          name="title"
          placeholder=" Enter your product name (minimum 3 character)"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="  Description (minimum 3 character)"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          placeholder="100"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700"
        >
          Condition
        </label>
        <select
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          placeholder="  Category (minimum 3 character)"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Images
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed opacity-50"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Updating..." : "Update Listing"}
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
