"use client";
import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import img1 from "@/public/images/slides/1.png";
import img2 from "@/public/images/slides/2.png";
import img3 from "@/public/images/slides/3.png";
import img4 from "@/public/images/slides/4.png";
import img5 from "@/public/images/slides/5.png";
import img6 from "@/public/images/slides/6.png";
import img7 from "@/public/images/slides/7.png";
import img8 from "@/public/images/slides/8.png";
import img9 from "@/public/images/slides/9.png";

const CarouselSection = () => {
  const imgArr = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  return (
    <section className="container bg-transparent lg:max-h-[calc(100vh-56px)]">
      <Swiper
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper flow-root"
      >
        {imgArr.map((img, index) => (
          <SwiperSlide key={index}>
            <Image
              placeholder="blur"
              src={img}
              alt="product preview"
              quality={100}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CarouselSection;
