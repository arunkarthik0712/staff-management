"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddJournal } from "./AddJournal";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageJournal = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("journal");

  const columnsConfig = [
    {
      header: "Publication in Journal Details",
      columns: [
        columnHelper.accessor("title_of_article", {
          header: "Article Title",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("journal_name", {
          header: "Journal",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("level", {
          header: "Level",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("issn", {
          header: "ISSN",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("volume", {
          header: "Vol",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("date_of_publish", {
          header: "Date",
          cell: (info) => info.getValue() || "—",
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "title_of_article", label: "Article Title", visible: true },
    { value: "journal_name", label: "Journal", visible: true },
    { value: "level", label: "Level", visible: true },
    { value: "issn", label: "ISSN", visible: true },
    { value: "volume", label: "Vol", visible: true },
    { value: "date_of_publish", label: "Date", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/published")}
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
                label="Search Journal Articles"
                onValueChange={field.onChange}
                placeholder="Search: article title, journal, ISSN..."
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
        title="Publication in Journal"
        onDelete={actions.delete}
        AddComponent={AddJournal}
        addButtonText="Add Journal Article"
        EditComponent={AddJournal}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
