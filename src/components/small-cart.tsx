import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import CartItem from "./cart-item";
import { formatPrice } from "@utils/common";
import { MdOutlineClose } from "react-icons/md";

const SmallCart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cartQuery = trpc.cart.getAll.useQuery();

  const checkout = trpc.order.create.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const router = useRouter();

  return (
    <>
      {!cartQuery.isLoading && cartQuery.data && (
        <>
          <Flex
            onClick={onOpen}
            px={3}
            py={2}
            rounded={"full"}
            alignItems="center"
            bg={"crimson"}
            gap={4}
            cursor="pointer"
            _hover={{ bg: "#ba0f31" }}
            visibility={isOpen ? "hidden" : "visible"}
          >
            <FaShoppingCart fontSize={18} color={"white"} />

            <Text lineHeight={0} fontWeight={"medium"} color={"white"} fontSize={18}>
              {cartQuery.data.cart.length}
            </Text>
          </Flex>
          <Drawer placement={"right"} onClose={onClose} isOpen={isOpen} size={"sm"}>
            <DrawerOverlay />
            <DrawerContent position={"relative"}>
              <DrawerHeader borderBottomWidth="1px" fontSize={24}>
                <Flex alignItems={"center"} justifyContent="space-between">
                  Giỏ hàng
                  <Icon onClick={onClose} as={MdOutlineClose} w={8} h={8} />
                </Flex>

                {cartQuery.data.cart.length !== 0 && (
                  <Button
                    bg={"crimson"}
                    _hover={{ bg: "#ba0f31" }}
                    rounded={"full"}
                    width={"full"}
                    mt={4}
                    onClick={() => router.push("/customer/checkout")}
                  >
                    <Flex alignItems={"center"} justifyContent="space-between" width={"full"}>
                      <Text color={"white"} fontWeight={700}>
                        Thanh toán
                      </Text>
                      <Text color={"white"} fontWeight={700}>
                        {formatPrice(cartQuery.data.grandTotal)} VNĐ
                      </Text>
                    </Flex>
                  </Button>
                )}
              </DrawerHeader>
              <DrawerBody p={0}>
                <Flex flexDirection={"column"}>
                  {cartQuery.data.cart.map(item => (
                    <CartItem item={item} key={item.id} />
                  ))}
                </Flex>
              </DrawerBody>

              {checkout.isLoading && (
                <Box
                  position={"absolute"}
                  inset={0}
                  bg={"rgba(0,0,0,0.10)"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  zIndex={3}
                >
                  <Spinner size={"md"} color={"red"} />
                </Box>
              )}
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
};

export default SmallCart;
