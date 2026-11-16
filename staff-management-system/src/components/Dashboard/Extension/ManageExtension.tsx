"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddExtension } from "./AddExtension";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageExtension = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("extension");

  const columnsConfig = [
    {
      header: "Extension Activity Information",
      columns: [
        columnHelper.accessor("position_designation", {
          header: "Designation",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("period_tenure", {
          header: "Tenure",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("program_title", {
          header: "Program Title",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("target_group", {
          header: "Target Group",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("place", {
          header: "Place",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("amount_spent", {
          header: "Amount Spent",
          cell: (info) => info.getValue() || "—",
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "position_designation", label: "Designation", visible: true },
    { value: "period_tenure", label: "Tenure", visible: true },
    { value: "program_title", label: "Program Title", visible: true },
    { value: "target_group", label: "Target Group", visible: true },
    { value: "place", label: "Place", visible: true },
    { value: "amount_spent", label: "Amount Spent", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      {/* Top action header for next step */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/additional")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Next Step <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>

      {/* Search / Filter Section */}
      <div className="rounded-lg shadow-sm overflow-hidden p-4 pb-6 bg-card text-card-foreground border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="search"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                label="Search Extension Activities"
                onValueChange={field.onChange}
                placeholder="Search: designation, program, place..."
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

      {/* Reusable Template DataTable */}
      <DataTable
        fetchData={actions.getPaginated}
        columnsConfig={columnsConfig}
        columns={columns}
        setColumns={setColumns}
        title="Extension Activities"
        onDelete={actions.delete}
        AddComponent={AddExtension}
        addButtonText="Add Extension Activity"
        EditComponent={AddExtension}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
