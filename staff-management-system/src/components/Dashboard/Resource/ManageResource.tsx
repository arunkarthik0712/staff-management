"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddResource } from "./AddResource";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageResource = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("resource_person");

  const columnsConfig = [
    {
      header: "Resource Person Details",
      columns: [
        columnHelper.accessor("topic", {
          header: "Topic",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("level", {
          header: "Level",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("type", {
          header: "Type",
          cell: (info) => (
            <span className="font-semibold text-blue-600">{info.getValue() || "—"}</span>
          ),
        }),
        columnHelper.accessor("place", {
          header: "Place",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("date_of_event", {
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
    { value: "topic", label: "Topic", visible: true },
    { value: "level", label: "Level", visible: true },
    { value: "type", label: "Type", visible: true },
    { value: "place", label: "Place", visible: true },
    { value: "date_of_event", label: "Date", visible: true },
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
                label="Search Resource Person Records"
                onValueChange={field.onChange}
                placeholder="Search: topic, type, place..."
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
        title="Resource Person"
        onDelete={actions.delete}
        AddComponent={AddResource}
        addButtonText="Add Resource Record"
        EditComponent={AddResource}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
