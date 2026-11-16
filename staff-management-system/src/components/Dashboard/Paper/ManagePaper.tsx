"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddPaper } from "./AddPaper";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManagePaper = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("paper");

  const columnsConfig = [
    {
      header: "Paper Presented Details",
      columns: [
        columnHelper.accessor("title_of_paper", {
          header: "Paper Title",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("name_of_conf", {
          header: "Conference",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("conference_level", {
          header: "Level",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("place", {
          header: "Place",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("date_from", {
          header: "From",
          cell: (info) => {
            const v = info.getValue();
            return v ? new Date(v).toLocaleDateString() : "—";
          },
        }),
        columnHelper.accessor("date_to", {
          header: "To",
          cell: (info) => {
            const v = info.getValue();
            return v ? new Date(v).toLocaleDateString() : "—";
          },
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "title_of_paper", label: "Paper Title", visible: true },
    { value: "name_of_conf", label: "Conference", visible: true },
    { value: "conference_level", label: "Level", visible: true },
    { value: "place", label: "Place", visible: true },
    { value: "date_from", label: "From", visible: true },
    { value: "date_to", label: "To", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/journal")}
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
                label="Search Papers Presented"
                onValueChange={field.onChange}
                placeholder="Search: paper title, conference, place..."
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
        title="Paper Presented"
        onDelete={actions.delete}
        AddComponent={AddPaper}
        addButtonText="Add Paper"
        EditComponent={AddPaper}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
