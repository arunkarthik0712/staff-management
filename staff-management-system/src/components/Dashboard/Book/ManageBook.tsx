"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddBook } from "./AddBook";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageBook = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("book");

  const columnsConfig = [
    {
      header: "Books Published / Edited Details",
      columns: [
        columnHelper.accessor("title_of_book", {
          header: "Book Title",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("published_name", {
          header: "Publisher",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("level_of_book", {
          header: "Level",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("isbn", {
          header: "ISBN",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("month_and_year_of_publication", {
          header: "Published Date",
          cell: (info) => info.getValue() || "—",
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "title_of_book", label: "Book Title", visible: true },
    { value: "published_name", label: "Publisher", visible: true },
    { value: "level_of_book", label: "Level", visible: true },
    { value: "isbn", label: "ISBN", visible: true },
    { value: "month_and_year_of_publication", label: "Published Date", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/conf_wrk_sem_detail")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Next Step <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>

      <div className="rounded-lg shadow-sm overflow-hidden p-4 pb-6 bg-card text-card-foreground border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="search"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                label="Search Books"
                onValueChange={field.onChange}
                placeholder="Search: book title, publisher, ISBN..."
              />
            )}
          />
          <div className="flex justify-end items-end">
            <Button
              type="reset"
              variant="outline"
              onClick={() => reset({ search: "" })}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <DataTable
        fetchData={actions.getPaginated}
        columnsConfig={columnsConfig}
        columns={columns}
        setColumns={setColumns}
        title="Books Published/Edited"
        onDelete={actions.delete}
        AddComponent={AddBook}
        addButtonText="Add Book"
        EditComponent={AddBook}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
