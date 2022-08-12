import { NextPageWithLayout } from "@pages/_app";
import React from "react";
import DashboardLayout from "src/layout/dashboard-layout";

const Dashboard: NextPageWithLayout = () => {
  return <div>hELLO</div>;
};

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;
