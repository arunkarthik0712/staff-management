"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddReproject } from "./AddReproject";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageReproject = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("research_project");

  const columnsConfig = [
    {
      header: "Research Project Details",
      columns: [
        columnHelper.accessor("title_of_project", {
          header: "Project Title",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("sponsoring_agency", {
          header: "Agency",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("project_type", {
          header: "Type",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("amount", {
          header: "Amount",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("status", {
          header: "Status",
          cell: (info) => (
            <span
              className={
                info.getValue() === "completed"
                  ? "text-emerald-600 font-semibold"
                  : "text-amber-600 font-semibold"
              }
            >
              {info.getValue() || "—"}
            </span>
          ),
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "title_of_project", label: "Project Title", visible: true },
    { value: "sponsoring_agency", label: "Agency", visible: true },
    { value: "project_type", label: "Type", visible: true },
    { value: "amount", label: "Amount", visible: true },
    { value: "status", label: "Status", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/extension")}
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
                label="Search Research Projects"
                onValueChange={field.onChange}
                placeholder="Search: project title, agency, type..."
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
        title="Research Projects"
        onDelete={actions.delete}
        AddComponent={AddReproject}
        addButtonText="Add Research Project"
        EditComponent={AddReproject}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
