import { Avatar, Flex, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const DashboardHeader = ({ title }: { title?: string }) => {
  const { data } = useSession();

  return (
    <Flex justifyContent={"space-between"}>
      <Heading as="h3" size="lg">
        {title}
      </Heading>
      {data && <Avatar name={data.user.name} src={data.user.image || "https://bit.ly/broken-link"} />}
    </Flex>
  );
};

export default DashboardHeader;
