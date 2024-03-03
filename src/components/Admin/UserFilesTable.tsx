/* eslint-disable indent */
"use client";
import React, { useState } from "react";
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
import { LuChevronDown } from "react-icons/lu";
import moment from "moment";
import Image from "next/image";
import { FileType, UploadStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import LoadMore from "../LoadMore";
import { cn } from "@/lib/utils";
import FileIcon from "../FileIcon";

type FilterType =
  | "ALL"
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CSV"
  | "JSON";

interface UserType {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface FileTypes {
  id: string;
  name: string;
  fileType: FileType;
  uploadStatus: UploadStatus;
  userId: string | null;
  createdAt: string;
  User: UserType | null;
  _count: {
    messages: number;
  };
}

export const columns: ColumnDef<FileTypes>[] = [
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
    accessorKey: "fileType",
    header: "File Type",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <FileIcon type={row.getValue("fileType")} size={5} />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-bold capitalize text-muted-foreground">
        {row.getValue("name")}
      </div>
    ),
  },

  {
    accessorKey: "User",
    header: "Owner",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={`data:image/png;base64,${
            (row.getValue("User") as UserType).avatar
          }`}
          blurDataURL={`data:image/png;base64,${
            (row.getValue("User") as UserType).avatar
          }`}
          alt="Profile image"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
          placeholder="blur"
        />
        <div className="grid gap-0.5">
          <h5 className="font-semibold">
            {(row.getValue("User") as UserType).name}
          </h5>
          <p className="text-sm text-muted-foreground">
            {(row.getValue("User") as UserType).email}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "uploadStatus",
    header: "Status",
    cell: ({ row }) => (
      <div>
        <span
          className={cn(
            "rounded-md px-2 py-1 text-xs font-semibold",
            row.getValue("uploadStatus") === "SUCCESS"
              ? "bg-green-600/25 text-green-600"
              : row.getValue("uploadStatus") === "PENDING"
                ? "bg-amber-600/25 text-amber-600"
                : row.getValue("uploadStatus") === "PROCESSING"
                  ? "bg-indigo-600/25 text-indigo-600"
                  : row.getValue("uploadStatus") === "FAILED"
                    ? "bg-red-600/25 text-red-600"
                    : "bg-slate-600/25 text-slate-600",
          )}
        >
          {row.getValue("uploadStatus")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "_count",
    header: "Messages",
    cell: ({ row }) => (
      <div className="font-bold capitalize text-muted-foreground">
        {(row.getValue("_count") as { messages: number }).messages}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="capitalize text-card-foreground">
        {moment(row.getValue("createdAt") as Date).format("ll")}
      </div>
    ),
  },
];

export function UserFilesTable() {
  const { data, isLoading, isFetching } = trpc.adminFils.useQuery();
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data: data ?? [],
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
  });

  const filePending = data?.filter((file) => file.uploadStatus === "PENDING")
    .length;
  const fileProcessing = data?.filter(
    (file) => file.uploadStatus === "PROCESSING",
  ).length;
  const fileFailed = data?.filter((file) => file.uploadStatus === "FAILED")
    .length;
  const fileSuccess = data?.filter((file) => file.uploadStatus === "SUCCESS")
    .length;
  const csvFiles = data?.filter((file) => file.fileType === "CSV").length;
  const jsonFiles = data?.filter((file) => file.fileType === "JSON").length;

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
            {data?.length || 0}
          </span>
        </Button>
        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("uploadStatus")?.setFilterValue("SUCCESS");
            setFilter("SUCCESS");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "SUCCESS"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          Success
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "SUCCESS"
                ? "bg-green-600 text-white"
                : "bg-green-600/25 text-green-600",
            )}
          >
            {fileSuccess || 0}
          </span>
        </Button>
        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("uploadStatus")?.setFilterValue("PROCESSING");
            setFilter("PROCESSING");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "PROCESSING"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          Processing
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "PROCESSING"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-600/25 text-indigo-600",
            )}
          >
            {fileProcessing || 0}
          </span>
        </Button>
        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("uploadStatus")?.setFilterValue("PENDING");
            setFilter("PENDING");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "PENDING"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          Pending
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "PENDING"
                ? "bg-amber-600 text-white"
                : "bg-amber-600/25 text-amber-600",
            )}
          >
            {filePending || 0}
          </span>
        </Button>

        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("uploadStatus")?.setFilterValue("FAILED");
            setFilter("FAILED");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "FAILED"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          Failed
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "FAILED"
                ? "bg-red-600 text-white"
                : "bg-red-600/25 text-red-600",
            )}
          >
            {fileFailed || 0}
          </span>
        </Button>

        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("fileType")?.setFilterValue("CSV");
            setFilter("CSV");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "CSV"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          CSV
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "CSV"
                ? "bg-slate-600 text-white"
                : "bg-slate-600/25 text-slate-600",
            )}
          >
            {csvFiles || 0}
          </span>
        </Button>

        <Button
          onClick={() => {
            table.resetColumnFilters();
            table.getColumn("fileType")?.setFilterValue("JSON");
            setFilter("JSON");
          }}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none pb-4 transition delay-150 ease-in-out hover:bg-white",
            filter === "JSON"
              ? "border-b-2 border-black text-black"
              : " text-muted-foreground",
          )}
        >
          JSON
          <span
            className={cn(
              "ml-2 flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
              filter === "JSON"
                ? "bg-slate-600 text-white"
                : "bg-slate-600/25 text-slate-600",
            )}
          >
            {jsonFiles || 0}
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
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
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
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                table?.getRowModel()?.rows?.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
            {table.getFilteredRowModel().rows.length} file(s) selected.
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
