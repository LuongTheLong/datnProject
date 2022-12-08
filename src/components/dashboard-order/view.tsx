import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import LoadingSpinner from "@components/loading-spinner";
import OrderDetail from "@components/order-detail";
import { trpc } from "@utils/trpc";

type ViewOrderDetailProps = {
  id: string;
};

const ViewOrderDetail = ({ id }: ViewOrderDetailProps) => {
  const { data, isLoading } = trpc.order.getOrderWithDetail.useQuery(
    { orderId: id as string },
    {
      cacheTime: 0,
    }
  );

  return (
    <>
      {isLoading && <LoadingSpinner size="lg" />}
      {data && <OrderDetail order={data} />}
    </>
  );
};

type ViewOrderProps = {
  orderId: string;
};

const ViewOrder = ({ orderId }: ViewOrderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} colorScheme={"blue"}>
        Xem chi tiết đơn hàng
      </Button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chi tiết đơn hàng</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ViewOrderDetail id={orderId} />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );

  return <div></div>;
};

export default ViewOrder;
