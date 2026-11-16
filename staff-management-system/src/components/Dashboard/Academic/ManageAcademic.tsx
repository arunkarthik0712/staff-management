"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddAcademic } from "./AddAcademic";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageAcademic = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("academic");

  const columnsConfig = [
    {
      header: "Academic Details",
      columns: [
        columnHelper.accessor("degree", {
          header: "Degree",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("degree_name", {
          header: "Degree Name",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("branch", {
          header: "Branch",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("university_institution", {
          header: "University",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("year_of_passing", {
          header: "Year",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("percentage_cgpa", {
          header: "% / CGPA",
          cell: (info) => info.getValue() || "—",
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "degree", label: "Degree", visible: true },
    { value: "degree_name", label: "Degree Name", visible: true },
    { value: "branch", label: "Branch", visible: true },
    { value: "university_institution", label: "University", visible: true },
    { value: "year_of_passing", label: "Year", visible: true },
    { value: "percentage_cgpa", label: "% / CGPA", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      {/* Top action header for next step */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/work")}
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
                label="Search Academic Records"
                onValueChange={field.onChange}
                placeholder="Search: degree, branch, university..."
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
        title="Academic Details"
        onDelete={actions.delete}
        AddComponent={AddAcademic}
        addButtonText="Add Academic Detail"
        EditComponent={AddAcademic}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
