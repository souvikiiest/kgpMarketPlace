import Image from "next/image";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Listing } from "../types";

interface ItemsProps {
  items: Listing[];
}

const ItemList: React.FC<ItemsProps> = ({ items }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 border rounded-lg shadow-sm">
          <Carousel showThumbs={false}>
            {item.imageUrl.map((url, index) => (
              <div key={index}>
                <Image
                  src={url}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="object-cover w-full h-48 mb-4 rounded"
                />
              </div>
            ))}
          </Carousel>
          <Link href={`/items/${item.id}`}>
            <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
          </Link>
          <p className="mb-2 text-gray-700">{item.description}</p>
          <p className="text-lg font-bold">₹{item.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
