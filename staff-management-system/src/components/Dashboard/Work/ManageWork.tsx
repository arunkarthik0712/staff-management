"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddWork } from "./AddWork";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageWork = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("work");

  const columnsConfig = [
    {
      header: "Work Experience Details",
      columns: [
        columnHelper.accessor("institution_name", {
          header: "Institution",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("designation", {
          header: "Designation",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("period_of_service_from", {
          header: "From",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("period_of_service_to", {
          header: "To",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("pay_band_basic_pay", {
          header: "Pay",
          cell: (info) => info.getValue() || "—",
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "institution_name", label: "Institution", visible: true },
    { value: "designation", label: "Designation", visible: true },
    { value: "period_of_service_from", label: "From", visible: true },
    { value: "period_of_service_to", label: "To", visible: true },
    { value: "pay_band_basic_pay", label: "Pay", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/exp")}
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
                label="Search Work Experience"
                onValueChange={field.onChange}
                placeholder="Search: institution, designation..."
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
        title="Work Experience"
        onDelete={actions.delete}
        AddComponent={AddWork}
        addButtonText="Add Work Experience"
        EditComponent={AddWork}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
