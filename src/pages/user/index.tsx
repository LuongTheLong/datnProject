import type { FormValues } from "@shared/validators/user-edit-validator";
import { signIn, useSession } from "next-auth/react";
import CommonLayout from "@layout/common-layout";
import { Box, Container, Flex, Heading, Input, FormLabel, FormControl, Button, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@utils/trpc";
import { formValidator } from "@shared/validators/user-edit-validator";

const User = () => {
  const session = useSession({
    onUnauthenticated() {
      signIn();
    },
    required: true,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formValidator),
    defaultValues: {
      name: session.data?.user.name,
      phoneNumber: session.data?.user.phoneNumber,
    },
  });
  const toast = useToast();

  const { isLoading, mutate } = trpc.user.update.useMutation({
    onSuccess: data => {
      reset({ name: data.name, phoneNumber: data.phoneNumber });

      toast({
        title: "Cập nhật thành công",
        position: "top",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    },
  });

  const onSubmit = handleSubmit(values => {
    mutate(values);
  });

  return (
    <Container maxW="780px">
      <Box mt={10} p={8} boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 12px"} rounded={"md"}>
        <Heading as="h3" size="lg" mb={8}>
          Thông tin cá nhân
        </Heading>
        {session.status === "authenticated" && (
          <>
            <form onSubmit={onSubmit}>
              <Box mb={4}>
                <Flex gap={6} wrap={"wrap"}>
                  <Box flex={1}>
                    <FormControl isInvalid={!!errors.name} isDisabled={isLoading}>
                      <FormLabel>Họ và tên</FormLabel>
                      <Input {...register("name")} type="text" placeholder="Họ và tên" />
                    </FormControl>
                  </Box>
                  <Box flex={1}>
                    <FormControl isInvalid={!!errors.phoneNumber} isDisabled={isLoading}>
                      <FormLabel>Số điện thoại</FormLabel>
                      <Input {...register("phoneNumber")} type="tel" placeholder="Số điện thoại" />
                    </FormControl>
                  </Box>
                  <Box width={"100%"}>
                    <FormControl isDisabled={isLoading}>
                      <FormLabel>Địa chỉ email</FormLabel>
                      <Input defaultValue={session.data.user.email || ""} type="email" readOnly={true} />
                    </FormControl>
                  </Box>
                </Flex>
              </Box>
              <Box textAlign={"right"}>
                <Button
                  rounded={"full"}
                  type="submit"
                  colorScheme={"red"}
                  isLoading={isLoading}
                  loadingText={"Đang xử lý"}
                >
                  Lưu
                </Button>
              </Box>
            </form>
          </>
        )}
      </Box>
    </Container>
  );
};

User.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default User;
