"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, DataTable, Input } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { staffActions } from "@/actions";
import { AddCourse } from "./AddCourse";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const ManageCourse = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const actions = staffActions("course");

  const columnsConfig = [
    {
      header: "Course / Certificate Details",
      columns: [
        columnHelper.accessor("course_name", {
          header: "Course Name",
          cell: (info) => (
            <p className="font-medium text-foreground">{info.getValue() || "—"}</p>
          ),
        }),
        columnHelper.accessor("place_of_study", {
          header: "Place of Study",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("month_and_year_of_completion", {
          header: "Completion Date",
          cell: (info) => info.getValue() || "—",
        }),
        columnHelper.accessor("duration", {
          header: "Duration",
          cell: (info) => info.getValue() || "—",
        }),
      ],
    },
  ];

  const [columns, setColumns] = useState([
    { value: "course_name", label: "Course Name", visible: true },
    { value: "place_of_study", label: "Place", visible: true },
    { value: "month_and_year_of_completion", label: "Completion Date", visible: true },
    { value: "duration", label: "Duration", visible: true },
  ]);

  const { control, watch, reset } = useForm();
  const filterSearch = watch("search");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => router.push("/dashboard/additional")}
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
                label="Search Courses / Certificates"
                onValueChange={field.onChange}
                placeholder="Search: course name, place..."
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
        title="Courses / Certificates"
        onDelete={actions.delete}
        AddComponent={AddCourse}
        addButtonText="Add Course"
        EditComponent={AddCourse}
        filters={{
          search: filterSearch ?? "",
        }}
      />
    </div>
  );
};
