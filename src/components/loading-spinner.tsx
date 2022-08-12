import dog from "../assets/dog.svg";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";

const LoadingSpinner = ({ size = 70 }: { size?: number }) => {
  return (
    <Flex alignItems={"center"} justifyContent="center">
      <Image src={dog} alt="aaaa" width={size} height={size} />
    </Flex>
  );
};

export default LoadingSpinner;
