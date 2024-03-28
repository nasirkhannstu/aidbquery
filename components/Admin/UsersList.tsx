import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";

export const UsersList = () => {
  return (
    <div className="p-5">
      <div className="my-5">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: (
                <>
                  <UserOutlined />
                  <span>Dashboard</span>
                </>
              ),
            },
            {
              title: "Users List",
            },
          ]}
        />
      </div>
      <div className="my-5 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Users List</h1>
        <div>
          <p>Manage all users</p>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th className="rounded-tl-lg">ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Customer ID</th>
            <th>Joined</th>
            <th>Update</th>
            <th className="rounded-tr-lg">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-body">
            <td>123</td>
            <td>Avatar</td>
            <td>Malcolm Lockyer</td>
            <td>yousuf360.ya@gmail.com</td>
            <td>role</td>
            <td>status</td>
            <td>Customer ID</td>
            <td>Joined</td>
            <td>Update</td>
            <td>
              <Button danger>Delete</Button>
              <Button>Edit</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
