import { Box } from "@chakra-ui/react";
import Image from "next/legacy/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBreakpointValue } from "@chakra-ui/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Navigation } from "swiper";
import FirstBanner from "../assets/banner-1.jpg";
import SecondBanner from "../assets/banner-2.jpg";
import ThirdBanner from "../assets/banner-3.jpg";

export default function CaptionCarousel() {
  const imageSize = useBreakpointValue({
    base: 1200,
    md: 600,
  });

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
    <Box>
      <Swiper navigation={true} modules={[Navigation]} autoplay={{ delay: 5000 }}>
        {cards.map(product => (
          <SwiperSlide key={product.title}>
            <Image
              src={product.image}
              alt={product.title}
              objectFit={"cover"}
              layout="responsive"
              height={imageSize}
              width={1400}
              priority={true}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
