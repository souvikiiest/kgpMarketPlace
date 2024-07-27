"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NewListingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState("");
  const [imageUrls, setImageUrl] = useState<string[] | null>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    condition: "new",
    category: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading("image");
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileUrls: string[] = [];
      for (const file of files) {
        const fileUrl: string = await handleImageUpload(file);
        fileUrls.push(fileUrl);
      }

      setImageUrl(fileUrls);
      setIsLoading("false");
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
        throw new Error("Failed to upload image");
      }
      return uploadData.fileUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading("form");
    try {
      const newData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: imageUrls,
      };

      const response = await fetch("/api/create-listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      router.push("/home");
    } catch (error) {
      console.error("Error creating listing:", error);
    } finally {
      setIsLoading("false");
    }
  };

  let submitButtonText = "Submit";
  if (isLoading == "image") submitButtonText = "Uploading Image";
  else if (isLoading == "form") submitButtonText = "Submitting form";

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold text-center">Add New Listing</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
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
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading != "false" ? true : false}
            className={`w-full px-4 py-2 font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading != "false"
                ? "bg-blue-400 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewListingPage;
