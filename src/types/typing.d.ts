import { UsersType } from "@/components/Admin/UsersListTable";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends UsersType> {
    deleteUser: ({ id: string }) => void;
    suspendUser: ({ id: string }) => void;
    restrictUser: ({ id: string }) => void;
    activeUser: ({ id: string }) => void;
  }
}
