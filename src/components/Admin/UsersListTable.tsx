/* eslint-disable indent */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import moment from "moment";
import { LuChevronDown, LuMoreHorizontal } from "react-icons/lu";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UserRole, UserStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/app/_trpc/client";
import LoadMore from "@/components/LoadMore";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import Chip from "@/components/Chip";

const using_mode = process.env.NEXT_PUBLIC_USING_MODE as "PERSONAL" | "SaaS";

type FilterType =
  | "ALL"
  | "RESTRICTED"
  | "SUSPEND"
  | "ACTIVE"
  | "ADMIN"
  | "USER";
export interface UsersType {
  id: string;
  avatar: string;
  name: string;
  email: string;
  isEmailVerify: boolean;
  stripeCurrentPeriodEnd?: string | null;
  subscriptionStatus?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date | string;
  _count: {
    File: number;
    Message: number;
  };
}

export const columns: ColumnDef<UsersType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Users",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={`data:image/png;base64,${row.original.avatar}`}
            alt={row.original.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
            placeholder="blur"
            blurDataURL={`data:image/png;base64,${row.original.avatar}`}
          />
          <div className="grid gap-0.5">
            <h5 className="font-semibold">{row.getValue("name")}</h5>
            <p className="text-sm text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div>
        <Chip
          textColor={
            row.getValue("role") === "ADMIN"
              ? "text-sky-600"
              : row.getValue("role") === "USER"
                ? "text-indigo-600"
                : "text-slate-600"
          }
          bgColor={
            row.getValue("role") === "ADMIN"
              ? "bg-sky-100"
              : row.getValue("role") === "USER"
                ? "bg-indigo-100"
                : "bg-slate-100"
          }
          text={row.getValue("role")}
          border
          borderColor={
            row.getValue("role") === "ADMIN"
              ? "border-sky-600"
              : row.getValue("role") === "USER"
                ? "border-indigo-600"
                : "border-slate-600"
          }
          rounded="rounded-full"
        />
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div>
        <Chip
          textColor={
            row.getValue("status") === "ACTIVE"
              ? "text-green-600"
              : row.getValue("status") === "RESTRICTED"
                ? "text-amber-600"
                : row.getValue("status") === "SUSPEND"
                  ? "text-rose-600"
                  : "text-slate-600"
          }
          bgColor={
            row.getValue("status") === "ACTIVE"
              ? "bg-green-100"
              : row.getValue("status") === "RESTRICTED"
                ? "bg-amber-100"
                : row.getValue("status") === "SUSPEND"
                  ? "bg-rose-100"
                  : "bg-slate-100"
          }
          borderColor={
            row.getValue("status") === "ACTIVE"
              ? "border-green-600"
              : row.getValue("status") === "RESTRICTED"
                ? "border-amber-600"
                : row.getValue("status") === "SUSPEND"
                  ? "border-rose-600"
                  : "border-slate-600"
          }
          text={row.getValue("status")}
          border
          rounded="rounded-xl"
        />
      </div>
    ),
  },
  {
    accessorKey: "_count",
    header: "Files",
    cell: ({ row }) => (
      <div className="font-bold capitalize text-muted-foreground">
        {(row.getValue("_count") as { File: number }).File}
      </div>
    ),
  },
  {
    accessorKey: "_count",
    header: "Messages",
    cell: ({ row }) => (
      <div className="font-bold capitalize text-muted-foreground">
        {(row.getValue("_count") as { Message: number }).Message}
      </div>
    ),
  },
  {
    accessorKey: "subscriptionStatus",
    header: () => (
      <div className="flex items-center">
        <h5 className="text-muted-foreground">Subscription Status</h5>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Hover me to show information"
            >
              <HiOutlineInformationCircle className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarFallback>SaaS</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Only For SaaS</h4>
                <p className="text-sm text-muted-foreground">
                  This feature is only available in SaaS mode.
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-bold capitalize text-muted-foreground">
        <Chip
          textColor={
            row.getValue("subscriptionStatus") === "NULL"
              ? "text-slate-600"
              : row.getValue("subscriptionStatus") === "ACTIVE" &&
                  using_mode === "SaaS"
                ? "text-emerald-600"
                : row.getValue("subscriptionStatus") === "CANCELED" &&
                    using_mode === "SaaS"
                  ? "text-pink-600"
                  : "text-slate-600"
          }
          bgColor={
            row.getValue("subscriptionStatus") === "NULL"
              ? "bg-slate-100"
              : row.getValue("subscriptionStatus") === "ACTIVE" &&
                  using_mode === "SaaS"
                ? "bg-emerald-100"
                : row.getValue("subscriptionStatus") === "CANCELED" &&
                    using_mode === "SaaS"
                  ? "bg-pink-100"
                  : "bg-slate-100"
          }
          borderColor={
            row.getValue("subscriptionStatus") === "NULL"
              ? "border-slate-600"
              : row.getValue("subscriptionStatus") === "ACTIVE" &&
                  using_mode === "SaaS"
                ? "border-emerald-600"
                : row.getValue("subscriptionStatus") === "CANCELED" &&
                    using_mode === "SaaS"
                  ? "border-pink-600"
                  : "border-slate-600"
          }
          text={
            row.getValue("subscriptionStatus") && using_mode === "SaaS"
              ? row.getValue("subscriptionStatus") === "NULL"
                ? "N/A"
                : row.getValue("subscriptionStatus")
              : "N/A"
          }
          border
          rounded="rounded-lg"
        />
      </div>
    ),
  },
  {
    accessorKey: "stripeCurrentPeriodEnd",
    header: () => (
      <div className="flex items-center">
        <h5 className="text-muted-foreground">Subscription End</h5>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Hover me to show information"
            >
              <HiOutlineInformationCircle className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarFallback>SaaS</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Only For SaaS</h4>
                <p className="text-sm text-muted-foreground">
                  This feature is only available in SaaS mode.
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-bold capitalize text-muted-foreground">
        {row.getValue("stripeCurrentPeriodEnd") && using_mode === "SaaS"
          ? moment(row.getValue("stripeCurrentPeriodEnd")).format("ll")
          : "N/A"}
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <div className="capitalize text-card-foreground">
        {moment(row.getValue("createdAt") as Date).format("ll")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original;
      const deleteUser = table.options.meta?.deleteUser;
      const suspendUser = table.options.meta?.suspendUser;
      const restrictUser = table.options.meta?.restrictUser;
      const activeUser = table.options.meta?.activeUser;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LuMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.status !== "ACTIVE" && (
              <DropdownMenuItem
                className="text-green-500"
                onClick={() => {
                  const isActive = confirm(
                    "Are you sure you want to make this user active?",
                  );
                  if (activeUser && isActive) {
                    return activeUser({ id: user.id });
                  }
                }}
              >
                Active
              </DropdownMenuItem>
            )}
            {user.status !== "RESTRICTED" && (
              <DropdownMenuItem
                className="text-amber-500"
                onClick={() => {
                  const isRestrict = confirm(
                    "Are you sure you want to restrict this user?",
                  );
                  if (restrictUser && isRestrict)
                    return restrictUser({ id: user.id });
                }}
              >
                Restrict
              </DropdownMenuItem>
            )}
            {user.status !== "SUSPEND" && (
              <DropdownMenuItem
                className="text-rose-500"
                onClick={() => {
                  const isSuspend = confirm(
                    "Are you sure you want to suspend this user?",
                  );

                  if (suspendUser && isSuspend)
                    return suspendUser({ id: user.id });
                }}
              >
                Suspend
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="text-red-500"
              onClick={() => {
                const isDelete = confirm(
                  "Are you sure you want to delete this user?",
                );

                if (deleteUser && isDelete) return deleteUser({ id: user.id });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function UsersListTable() {
  const { data: usersList, isLoading, isFetching } = trpc.adminUsers.useQuery();
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const utils = trpc.useUtils();
  const { mutate: deleteUser } = trpc.adminUserDelete.useMutation({
    async onSuccess() {
      toast({ title: "User successfully deleted", variant: "success" });
      await utils.adminUsers.invalidate();
    },
    onError({ message }) {
      return toast({
        title: "Action failed",
        description: message,
        variant: "destructive",
      });
    },
  });
  const { mutate: suspendUser } = trpc.adminUserSuspend.useMutation({
    async onSuccess() {
      toast({ title: "User successfully suspended", variant: "success" });
      await utils.adminUsers.invalidate();
    },
    onError({ message }) {
      return toast({
        title: "Action failed",
        description: message,
        variant: "destructive",
      });
    },
  });
  const { mutate: restrictUser } = trpc.adminUserRestrict.useMutation({
    async onSuccess() {
      toast({ title: "User successfully restricted" });
      await utils.adminUsers.invalidate();
    },
    onError({ message }) {
      return toast({
        title: "Action failed",
        description: message,
        variant: "destructive",
      });
    },
  });
  const { mutate: activeUser } = trpc.adminMakeActiveUser.useMutation({
    async onSuccess() {
      toast({ title: "User successfully activated", variant: "success" });
      await utils.adminUsers.invalidate();
    },
    onError({ message }) {
      return toast({
        title: "Action failed",
        description: message,
        variant: "destructive",
      });
    },
  });
  const table = useReactTable({
    data: usersList ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      deleteUser,
      suspendUser,
      restrictUser,
      activeUser,
    },
  });

  const activeUsers = usersList?.filter((user) => user?.status === "ACTIVE")
    .length;
  const restrictedUser = usersList?.filter(
    (user) => user?.status === "RESTRICTED",
  ).length;
  const suspendedUser = usersList?.filter((user) => user?.status === "SUSPEND")
    .length;
  const adminUsers = usersList?.filter((user) => user?.role === "ADMIN").length;
  const generalUser = usersList?.filter((user) => user?.role === "USER").length;

  return (
    <div className="w-full rounded-md bg-white shadow-sm">
      <div className="flex w-full items-center gap-2 rounded-md px-3 pt-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "ALL"
              ? "border-b-2 border-black text-black"
              : "text-muted-foreground",
          )}
          onClick={() => {
            table.resetColumnFilters();
            setFilter("ALL");
          }}
        >
          All
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "ALL"
                ? "bg-primary text-white"
                : "bg-primary/25 text-primary",
            )}
          >
            {usersList?.length || 0}
          </span>
        </Button>
        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("status")?.setFilterValue("ACTIVE");
            setFilter("ACTIVE");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "ACTIVE"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          Active
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "ACTIVE"
                ? "bg-green-600 text-white"
                : "bg-green-600/25 text-green-600",
            )}
          >
            {activeUsers || 0}
          </span>
        </Button>
        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("status")?.setFilterValue("RESTRICTED");
            setFilter("RESTRICTED");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "RESTRICTED"
              ? "border-b-2 border-black text-black"
              : "text-muted-foreground",
          )}
        >
          Restricted
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "RESTRICTED"
                ? "bg-amber-600 text-white"
                : "bg-amber-600/25 text-amber-600",
            )}
          >
            {restrictedUser || 0}
          </span>
        </Button>

        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("status")?.setFilterValue("SUSPEND");
            setFilter("SUSPEND");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "SUSPEND"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          Suspend
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "SUSPEND"
                ? "bg-rose-600 text-white"
                : "bg-rose-600/25 text-rose-600",
            )}
          >
            {suspendedUser || 0}
          </span>
        </Button>
        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("role")?.setFilterValue("ADMIN");
            setFilter("ADMIN");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "ADMIN"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          ADMIN
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "ADMIN"
                ? "bg-sky-600 text-white"
                : "bg-sky-600/25 text-sky-600",
            )}
          >
            {adminUsers || 0}
          </span>
        </Button>
        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("role")?.setFilterValue("USER");
            setFilter("USER");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "USER"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          USER
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "USER"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-600/25 text-indigo-600",
            )}
          >
            {generalUser || 0}
          </span>
        </Button>
      </div>

      <hr />
      <div className="px-2 py-1">
        <div className="flex items-center px-2 py-4">
          <Input
            placeholder="Filter names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <LuChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column, index) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={index}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-600/5">
              {table.getHeaderGroups().map((headerGroup, i) => (
                <TableRow key={i}>
                  {headerGroup.headers.map((header, i2) => {
                    return (
                      <TableHead key={i2}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table?.getRowModel().rows.length ? (
                table?.getRowModel()?.rows?.map((row, i) => (
                  <TableRow
                    key={i}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <TableCell key={i}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isLoading || isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <LoadMore />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} user(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
