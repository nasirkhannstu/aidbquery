import { FaAngleRight } from "react-icons/fa6";

import MobileDashboardItemList from "@/components/Admin/MobileDashboardItemList";
import SocialMedia from "@/components/Admin/Settings/SocialMedia";

const Settings = () => {
  return (
    <div className="h-full w-full">
      <div className="container mx-auto">
        <div className="my-5">
          <div className="flex items-center gap-1.5">
            <MobileDashboardItemList />
            <h1 className="text-3xl font-semibold">Settings</h1>
          </div>

          <div className="mt-3 flex justify-between">
            <div className="flex items-center gap-2 text-sm">
              <p className="text-muted-foreground">Dashboard</p>
              <FaAngleRight className="h-3 w-3 text-muted-foreground" />
              <p className="text-muted-foreground">Settings</p>
            </div>
          </div>
        </div>
        {/* Settings */}
        <div>
          <SocialMedia />
        </div>
      </div>
    </div>
  );
};

export default Settings;
