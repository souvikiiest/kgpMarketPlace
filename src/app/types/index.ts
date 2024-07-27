export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  imageUrl: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  productId: string;
  categoryId: string;
  product: {
    id: string;
    name: string;
    description: string;
  };
  category: {
    name: string;
  };
}
export type ListingM = {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  imageUrl: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  productId: string;
  categoryId: string;
};
