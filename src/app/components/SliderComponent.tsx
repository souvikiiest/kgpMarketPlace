"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const SliderComponent = ({ images, title }: any) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {images.map((url: string, index: number) => (
        <div key={index}>
          <Image
            height={400}
            width={600}
            src={url}
            alt={title}
            className="object-cover w-full h-64 sm:h-96"
          />
        </div>
      ))}
    </Slider>
  );
};

export default SliderComponent;
