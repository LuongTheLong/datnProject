import { Box, IconButton, useBreakpointValue, Stack, Heading, Text, Container } from "@chakra-ui/react";
// Here we have used react-icons package for the icons

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Navigation } from "swiper";
import FirstBanner from "../assets/banner-1.jpg";
import SecondBanner from "../assets/banner-2.jpg";
import ThirdBanner from "../assets/banner-3.jpg";

// Settings for the slider

export default function CaptionCarousel() {
  const cards = [
    {
      title: "Design Projects 1",
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image: FirstBanner,
    },
    {
      title: "Design Projects 2",
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image: SecondBanner,
    },
    {
      title: "Design Projects 3",
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image: ThirdBanner,
    },
  ];

  return (
    <Box mb={12}>
      <Swiper navigation={true} modules={[Navigation]} autoplay={{ delay: 5000 }}>
        {cards.map(product => (
          <SwiperSlide key={product.title}>
            <Image
              src={product.image}
              alt={product.title}
              objectFit={"cover"}
              layout="responsive"
              height={580}
              width={1400}
              priority={true}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
