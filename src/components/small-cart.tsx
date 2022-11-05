import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Text,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { trpc, InferProcedures } from "@utils/trpc";
import { Choice } from "@prisma/client";

type CartItemType = InferProcedures["cart"]["getAll"]["output"]["cart"][number];

const CartItem = ({ item }: { item: CartItemType }) => {
  const t = trpc.useContext();
  const deleteCart = trpc.cart.delete.useMutation({
    onSuccess: deletedItem => {
      t.cart.getAll.setData(oldItems => {
        if (oldItems) {
          const newCart = { ...oldItems };
          newCart.cart = newCart.cart.filter(item => item.id !== deletedItem.id);
          newCart.grandTotal = newCart.cart.reduce((prev, curr) => prev + curr.total, 0);

          return newCart;
        }

        return undefined;
      });
    },
  });

  return (
    <Grid
      justifyContent={"center"}
      alignItems={"center"}
      borderBottom={"1px solid rgb(231, 231, 231)"}
      key={item.id}
      h="140px"
      templateColumns="repeat(6, 1fr)"
      gap={2}
      px={4}
      cursor={"pointer"}
      _hover={{ bg: "gray.50" }}
      position={"relative"}
      pointerEvents={deleteCart.isLoading ? "none" : "unset"}
    >
      <GridItem colSpan={2} display={"flex"} justifyContent="center" alignItems={"center"}>
        <Flex
          width={"35px"}
          height={"35px"}
          rounded={"full"}
          bg={"black"}
          shadow={"sm"}
          fontWeight={700}
          fontSize={16}
          justifyContent="center"
          alignItems={"center"}
          color={"white"}
          marginRight={"-17.5px"}
          position="relative"
          zIndex={2}
        >
          {item.quantity}x
        </Flex>
        <Box width={"80px"} height={"80px"} rounded={"md"} overflow={"hidden"} position="relative">
          <Image width={80} height={80} objectFit="cover" src={item.product.image} alt={item.product.title} />
        </Box>
      </GridItem>
      <GridItem colSpan={3}>
        <Text fontSize={16} lineHeight={1.5} fontWeight={500}>
          {item.product.title}
        </Text>
        <Box noOfLines={2}>
          {(item.option as Choice[]).map(option => (
            <Text
              _notLast={{
                _after: {
                  content: '"•"',
                  mx: 1,
                },
              }}
              key={option.id}
              as={"span"}
              fontSize={12}
              color={"rgb(73, 73, 73)"}
              fontWeight={500}
              textTransform={"capitalize"}
              lineHeight={0}
            >
              {option.title}
            </Text>
          ))}
        </Box>

        <Text mt={4} fontWeight={500} fontSize={16} color={"black"}>
          {item.total} VNĐ
        </Text>
      </GridItem>
      <GridItem colSpan={1}>
        <Box
          width={"40px"}
          height={"40px"}
          rounded={"full"}
          _hover={{
            bg: "white",
          }}
          display="flex"
          justifyContent="center"
          alignItems={"center"}
          cursor={"pointer"}
          onClick={() => deleteCart.mutate({ id: item.id })}
        >
          <FaTrash color="black" fontSize={18} />
        </Box>
      </GridItem>
      {deleteCart.isLoading && (
        <Box
          position={"absolute"}
          inset={0}
          bg={"rgba(0,0,0,0.10)"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={3}
        >
          <Spinner size={"sm"} color={"red"} />
        </Box>
      )}
    </Grid>
  );
};

const SmallCart = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cartQuery = trpc.cart.getAll.useQuery();

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
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px" fontSize={24}>
                Giỏ hàng
                <Button bg={"crimson"} _hover={{ bg: "#ba0f31" }} rounded={"full"} width={"full"} mt={4}>
                  <Flex alignItems={"center"} justifyContent="space-between" width={"full"}>
                    <Text color={"white"} fontWeight={700}>
                      Thanh toán
                    </Text>
                    <Text color={"white"} fontWeight={700}>
                      {cartQuery.data.grandTotal} VNĐ
                    </Text>
                  </Flex>
                </Button>
              </DrawerHeader>
              <DrawerBody p={0}>
                <Flex flexDirection={"column"}>
                  {cartQuery.data.cart.map(item => (
                    <CartItem item={item} key={item.id} />
                  ))}
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
};

export default SmallCart;
