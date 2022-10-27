import type { NextPageWithLayout } from "@pages/_app";
import DashboardLayout from "src/layout/dashboard-layout";
import React from "react";
import LoadingSpinner from "@components/loading-spinner";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Text,
    Spinner,
    Radio,
    RadioGroup,
    Input,
    HStack,
    Select
} from "@chakra-ui/react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
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
const Checkout: NextPageWithLayout = () => {
    const { isLoading, data } = trpc.category.getAll.useQuery(undefined, { refetchOnWindowFocus: false });
    const cartQuery = trpc.cart.getAll.useQuery();
    const [typeService, setTypeService] = useState('inside');
    const [typeCheckout, setTypeCheckout] = useState('cash');
    return (
        <>
            <Flex as="h1" mb={2} textTransform={"initial"} fontWeight="800" fontSize={"larger"}>
                Thanh toán đơn hàng
            </Flex>
            {isLoading && <LoadingSpinner />}
            {!isLoading && data && !cartQuery.isLoading && cartQuery.data && (
                <>
                    <Text mb={2} fontWeight="700">
                        Sản phẩm:
                    </Text>
                    <Flex flexDirection={"column"}>
                        {cartQuery.data.cart.map(item => (
                            <CartItem item={item} key={item.id} />
                        ))}
                    </Flex>
                    <Text mb={2} fontWeight="700">
                        Chọn thời gian nhận:
                    </Text>
                    <Input
                        placeholder="Chọn thời gian nhận"
                        size="md"
                        type="time"
                        min={Date.now()}
                        required
                    />
                    <Text mb={2} fontWeight="700">
                        Chọn phương thức đặt:
                    </Text>
                    <Select>
                        <option value='take-away' selected>Mang đi</option>
                        <option value='inside'>Tại chỗ</option>
                    </Select>
                    {/* <RadioGroup onChange={setTypeService} value={typeService}>
                        <HStack direction='row'>
                            <Radio value='take-away'>Mang đi</Radio>
                            <Radio value='inside' defaultChecked>Tại chỗ</Radio>
                        </HStack>
                    </RadioGroup> */}
                    <Text mb={2} fontWeight="700">
                        Chọn phương thức thanh toán:
                    </Text>
                    <Select>
                        <option value='cash' selected>Tiền mặt</option>
                        <option value='momo'>Momo</option>
                        <option value='ibanking'>IBanking</option>
                    </Select>
                    {/* <RadioGroup onChange={setTypeCheckout} value={typeCheckout}>
                        <HStack direction='row'>
                            <Radio value='cash'>Tiền mặt</Radio>
                            <Radio value='momo' defaultChecked>Momo</Radio>
                            <Radio value='ibanking' defaultChecked>IBanking</Radio>
                        </HStack>
                    </RadioGroup> */}
                    <Button
                        bg={"crimson"}
                        _hover={{ bg: "#ba0f31" }}
                        rounded={"full"}
                        width={"full"}
                        mt={4}
                    >
                        <Flex alignItems={"center"} justifyContent="space-between" width={"full"}>
                            <Text color={"white"} fontWeight={700}>
                                Thanh toán
                            </Text>
                            <Text color={"white"} fontWeight={700}>
                                {cartQuery.data.grandTotal} VNĐ
                            </Text>
                        </Flex>
                    </Button>
                </>
            )}
        </>
    );
};

Checkout.getLayout = function getLayout(page: React.ReactElement): React.ReactNode {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default Checkout;
