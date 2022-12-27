import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Icon,
    Text,
    Stack,
    HStack,
    VStack,
} from '@chakra-ui/react';
import type { FormValues } from "@shared/validators/user-edit-validator";
import { getSession, signIn, useSession } from "next-auth/react";
import CommonLayout from "@layout/common-layout";
// import { Box, Container, Flex, Heading, Input, FormLabel, FormControl, Button, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import { formValidator } from "@shared/validators/user-edit-validator";
import LoadingSpinner from "@components/loading-spinner";
// Replace test data with your own
// const features = Array.apply(null, Array(8)).map(function (x, i) {
//     return {
//         id: i,
//         title: 'Lorem ipsum dolor sit amet',
//         text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
//     };
// });

const featuress = [
    {
        id: 1,
        title: 'Ý nghĩa của CoolMate',
        text: 'Tên gọi CoolMate lấy cảm hứng từ hình ảnh những người hoàn hảo (C    ool) để nói về các chị cộng tác viên giúp việc luôn hoàn thành tốt công việc được giao. Chúng tôi (Mate) - những người siêng năng, chăm chỉ và cần mẫn - sẽ cung cấp cho khách hàng những dịch vụ chất lượng cao một cách tiện lợi và nhanh chóng.'
    },
    {
        id: 2,
        title: 'Khu vực hoạt động',
        text: 'Hiện tại, CoolMate cung cấp các dịch vụ tiện ích cho nhiều hộ gia đình ở khắp 10 tỉnh thành phố lớn tại Việt Nam: Hà Nội, Hải Phòng, Đà Nẵng, Hội An, Nha Trang, Đà Lạt, Bình Dương, Biên Hòa, TP.HCM và Cần Thơ. Ngoài ra, CoolMate đang mở rộng ra thị trường nước ngoài với dịch vụ chính là giúp việc nhà theo giờ tại Thái Lan và Malaysia.'
    },
    {
        id: 3,
        title: 'Phát triển nhiều hơn nữa',
        text: 'Tại Việt Nam, tính đến nay, CoolMate đã giúp hơn 7000 người giúp việc có thu nhập ổn định và đáp ứng nhu cầu chăm sóc nhà cửa cho hơn 350,000 khách hàng. Với mục tiêu mang đến cho khách hàng những trải nghiệm dịch vụ tốt nhất, CoolMate không ngừng cải thiện chất lượng dịch vụ, ứng dụng.'
    },
    {
        id: 4,
        title: 'Tầm nhìn',
        text: 'Không chỉ muốn giúp bạn chăm sóc gia đình từ những dịch vụ dọn dẹp nhà, vệ sinh máy lạnh, nấu ăn gia đình, giặt ủi,... CoolMate đang nỗ lực trở thành công ty hàng đầu Việt Nam và vươn ra thị trường Đông Nam Á, cung cấp nhiều hơn những dịch vụ tiện ích gia đình tích hợp trên ứng dụng di động.'
    },
    {
        id: 5,
        title: 'Sứ mệnh',
        text: 'CoolMate ra đời với sứ mệnh đáp ứng nhu cầu giải quyết việc nhà của người dân đô thị và nâng cao giá trị nghề giúp việc nhà bằng cách xây dựng nguồn nhân lực giúp việc bài bản, chuyên nghiệp và tận tâm. Cuộc sống thảnh thơi khi nhẹ đi gánh nặng việc nhà của khách hàng và nguồn thu nhập ổn định của người lao động chính là những gì mà chúng tôi luôn hướng đến.'
    },
]

const GridListWithHeading = () => {
    return (
        <Box p={4}>
            <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                <Heading fontSize={'3xl'}>Chúng tôi là CoolMate</Heading>
                <Text color={'gray.600'} fontSize={'xl'}>
                    Team CoolMate được thành lập vào ngày 01 tháng 3 năm 2022.
                    CoolMate là 1 đội tiên phong trong việc ứng dụng công nghệ vào ngành giúp việc nhà ở Việt Nam.
                    Chúng tôi cung cấp đa dịch vụ tiện ích như: dọn dẹp nhà, vệ sinh máy lạnh, đi chợ, … tại Việt Nam.
                    Thông qua ứng dụng đặt lịch dành cho khách hàng CoolMate và ứng dụng nhận việc của cộng tác viên CoolMate Partner,
                    khách hàng và cộng tác viên có thể chủ động đăng và nhận việc trực tiếp trên ứng dụng.
                </Text>
            </Stack>

            <Container maxW={'6xl'} mt={10}>
                {/* <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}> */}
                <SimpleGrid spacing={10}>
                    {featuress.map((feature) => (
                        <HStack key={feature.id} align={'top'}>
                            {/* <Box color={'green.400'} px={2}>
                                <Icon as={CheckIcon} />
                            </Box> */}
                            <VStack align={'start'}>
                                <Text fontWeight={600}>{feature.title}</Text>
                                <Text color={'gray.600'}>{feature.text}</Text>
                            </VStack>
                        </HStack>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}

GridListWithHeading.getLayout = function getLayout(page: React.ReactElement) {
    return <CommonLayout>{page}</CommonLayout>;
};

export default GridListWithHeading;