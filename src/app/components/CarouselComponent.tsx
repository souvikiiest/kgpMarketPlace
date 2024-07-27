"use client";
import Image from "next/image";
import { Key } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

export default function CarouselComponent({ data }: any) {
  return (
    <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
      {data.imageUrl.map((url: string, index: Key) => (
        <div key={index} className="relative w-full h-64">
          <Image
            src={url}
            alt={data.title}
            layout="fill" // Fill the container
            objectFit="contain" // Contain within the container
            className="object-cover mb-4 rounded"
          />
        </div>
      ))}
    </Carousel>
  );
}
