"use client";
import { UsersList } from "@/components/Admin/UsersList";
import { PageContainer } from "@ant-design/pro-components";

const Container = () => (
  <div className="container max-h-screen bg-[var(--bg-card)]">
    <PageContainer
      style={{ padding: 0, margin: 0 }}
      header={{
        title: "Users List",
        ghost: true,
        breadcrumb: {
          items: [
            {
              path: "",
              title: "Dashboard",
            },
            {
              path: "",
              title: "Users",
            },
          ],
        },
      }}
      tabProps={{
        type: "editable-card",
        hideAdd: true,
        onEdit: (e, action) => console.log(e, action),
      }}
    >
      <UsersList />
    </PageContainer>
  </div>
);

export default Container;
