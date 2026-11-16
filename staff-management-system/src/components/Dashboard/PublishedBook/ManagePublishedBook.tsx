"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddPublishedBook } from "./AddPublishedBook";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManagePublishedBook = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("published_book_article");

  const columnsConfig = [
    {
      header: "Publication in Book Details",
      columns: [
        columnHelper.accessor("title_of_article", {
          header: "Article Title",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("book_name", {
          header: "Book Name",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("publishers_name", {
          header: "Publisher",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("isbn", {
          header: "ISBN",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("month_and_year", {
          header: "Month & Year",
          cell: (info) => info.getValue() || "—",
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "title_of_article", label: "Article Title", visible: true },
    { value: "book_name", label: "Book Name", visible: true },
    { value: "publishers_name", label: "Publisher", visible: true },
    { value: "isbn", label: "ISBN", visible: true },
    { value: "month_and_year", label: "Month & Year", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/book")}
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
                label="Search Book Articles"
                onValueChange={field.onChange}
                placeholder="Search: article title, book, ISBN..."
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
        title="Publication in Book"
        onDelete={actions.delete}
        AddComponent={AddPublishedBook}
        addButtonText="Add Book Article"
        EditComponent={AddPublishedBook}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
