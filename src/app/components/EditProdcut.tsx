"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string().min(5),
  price: z.number().positive(),
  condition: z.enum(["new", "used"]),
  category: z.string().min(3),
  images: z.array(z.string()),
});

type ListingFormData = z.infer<typeof schema>;

export default function EditProductForm({ data }: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const onSubmit = async (formData: ListingFormData) => {
    setIsLoading(true);
    try {
      console.log(formData);
      const response = await fetch(`/api/listings/edit/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      router.push(`/home`);
    } catch (error) {
      console.log(error);
      console.error("Error updating listing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setValue("images", [...(data?.images || []), ...imageUrls]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
        )}
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
          {...register("description")}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
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
          type="number"
          {...register("price")}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.price && (
          <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
        )}
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
          {...register("condition")}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        {errors.condition && (
          <p className="mt-2 text-sm text-red-600">
            {errors.condition.message}
          </p>
        )}
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
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.images && (
          <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? "Updating..." : "Update Listing"}
        </button>
      </div>
    </form>
  );
}
