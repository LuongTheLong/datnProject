import { Flex } from "@chakra-ui/react";
import Header from "@components/header";
import Footer from "@components/footer";

export default function CommonLayout({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <Flex flexDirection={"column"} minH={"100vh"}>
      <Header />
      {children}
      {footer && <Footer />}
    </Flex>
  );
}
