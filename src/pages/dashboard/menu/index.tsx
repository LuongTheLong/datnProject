import LoadingSpinner from "@components/loading-spinner";
import DashboardLayout from "@layout/dashboard-layout";
import { NextPageWithLayout } from "@pages/_app";

import { trpc } from "src/utils/trpc";

const Menu: NextPageWithLayout = () => {
  const { isLoading, data } = trpc.useQuery(["category.get-category"]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && JSON.stringify(data)}
    </>
  );
};

Menu.getLayout = function getLayout(page: React.ReactElement): React.ReactNode {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Menu;
