import React from "react";
import { FaAngleRight } from "react-icons/fa6";

import { UsersListTable } from "@/components/Admin/UsersListTable";
import MobileDashboardItemList from "@/components/Admin/MobileDashboardItemList";

const DashboardUsers = () => {
  return (
    <div className="h-full w-full">
      <div className="container mx-auto">
        <div className="my-5">
          <div className="flex items-center gap-1.5">
            <MobileDashboardItemList />
            <h1 className="text-3xl font-semibold">Users</h1>
          </div>
          <div className="mt-3 flex justify-between">
            <div className="flex items-center gap-2 text-sm">
              <p className="text-muted-foreground">Dashboard</p>
              <FaAngleRight className="h-3 w-3 text-muted-foreground" />
              <p className="text-muted-foreground">Users List</p>
            </div>
          </div>
        </div>
        <UsersListTable />
      </div>
    </div>
  );
};

export default DashboardUsers;
