"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddAward } from "./AddAward";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageAwards = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("award");

  const columnsConfig = [
    {
      header: "Awards Received Details",
      columns: [
        columnHelper.accessor("award_name", {
          header: "Award Name",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("level", {
          header: "Level",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("instituted_by", {
          header: "Instituted By",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("presented_by", {
          header: "Presented By",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("amount_received", {
          header: "Amount",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("month_and_year", {
          header: "Date",
          cell: (info) => {
            const v = info.getValue();
            return v ? new Date(v).toLocaleDateString() : "—";
          },
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "award_name", label: "Award Name", visible: true },
    { value: "level", label: "Level", visible: true },
    { value: "instituted_by", label: "Instituted By", visible: true },
    { value: "presented_by", label: "Presented By", visible: true },
    { value: "amount_received", label: "Amount", visible: true },
    { value: "month_and_year", label: "Date", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/reproject")}
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
                label="Search Awards"
                onValueChange={field.onChange}
                placeholder="Search: award name, level, presenter..."
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
        title="Awards Received"
        onDelete={actions.delete}
        AddComponent={AddAward}
        addButtonText="Add Award"
        EditComponent={AddAward}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
