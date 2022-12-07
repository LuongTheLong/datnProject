import type { SpinnerProps } from "@chakra-ui/react";
import { Spinner, Flex } from "@chakra-ui/react";

const LoadingSpinner = (props: SpinnerProps) => {
  return (
    <Flex justifyContent={"center"}>
      <Spinner size="xl" color="crimson" {...props} />
    </Flex>
  );
};

export default LoadingSpinner;
