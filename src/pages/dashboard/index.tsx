import DashboardLayout from "@layout/dashboard-layout";
import { NextPageWithLayout } from "@pages/_app";
import React from "react";

const Dashboard: NextPageWithLayout = () => {
  return <div>hELLO</div>;
};

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
