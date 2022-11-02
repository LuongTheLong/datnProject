import { Flex, Container, Text, IconButton, Heading, Box } from "@chakra-ui/react";

import Image from "next/image";
import FastFood from "../assets/fast-food.svg";
import Drink from "../assets/drink.svg";
import Hamburger from "../assets/banh-mi.svg";
import Pizza from "../assets/pizza.svg";
import Dessert from "../assets/trang-mieng.svg";
import Breakfast from "../assets/breakfast.svg";
import Filter from "@components/filter";

const CATEGORIES = [
    {
        title: "Đồ ăn nhanh",
        slug: "do-an-nhanh",
        image: FastFood,
    },
    {
        title: "Thức uống",
        slug: "thuc-uong",
        image: Drink,
    },
    {
        title: "Dessert",
        slug: "dessert",
        image: Dessert,
    },
    {
        title: "Pizza",
        slug: "pizza",
        image: Pizza,
    },
    {
        title: "Bánh mì",
        slug: "banh-mi",
        image: Hamburger,
    },
    {
        title: "Ăn sáng",
        slug: "an-sang",
        image: Breakfast,
    },
];

const CategoryList = () => {
    return (
        <Flex alignItems={"center"} gap={6} justifyContent="center">
            {CATEGORIES.map(category => (
                <Flex
                    key={category.slug}
                    flexDir={"column"}
                    alignItems="center"
                    cursor={"pointer"}
                    transition={"all 250ms ease"}
                    _hover={{ color: "crimson" }}
                >
                    <Image width={50} height={50} src={category.image} alt={category.slug} layout="fixed" />
                    <Text fontSize={15} fontWeight={600}>
                        {category.title}
                    </Text>
                </Flex>
            ))}
        </Flex>
    );
};

export default CategoryList;