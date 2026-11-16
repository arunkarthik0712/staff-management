"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { Button, Input, Select } from "@/components/ui";
import { staffActions } from "@/actions";

const typeOptions = [
  { value: "Minor", label: "Minor" },
  { value: "Major", label: "Major" },
];

const statusOptions = [
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

export const AddReproject = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    title_of_project: editData?.title_of_project || "",
    sponsoring_agency: editData?.sponsoring_agency || "",
    duration: editData?.duration || "",
    amount: editData?.amount || "",
    project_type: editData?.project_type || "Minor",
    status: editData?.status || "ongoing",
    date_from: editData?.date_from || "",
    date_to: editData?.date_to || "",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: defaults });

  useEffect(() => {
    if (type === "edit" && editData) {
      reset({
        title_of_project: editData.title_of_project || "",
        sponsoring_agency: editData.sponsoring_agency || "",
        duration: editData.duration || "",
        amount: editData.amount || "",
        project_type: editData.project_type || "Minor",
        status: editData.status || "ongoing",
        date_from: editData.date_from || "",
        date_to: editData.date_to || "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("research_project");

  const mutation = useApiMutation({
    endpoint:
      type === "add"
        ? actions.add.url
        : `${actions.update.url}?id=${editData?._id || editData?.id}`,
    method: type === "add" ? actions.add.method : actions.update.method,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [actions.getPaginated.key] });
      toast.success(
        res?.message ||
          `Research Project ${type === "add" ? "added" : "updated"} successfully`
      );
      onClose?.();
    },
    onError: (err: any) => toast.error(err?.message || "Something went wrong"),
  });

  const onSubmit = async (data: any) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className="p-4 sm:p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="*Title Of The Project"
              placeholder="e.g. AI-driven Smart Campus Management"
              {...register("title_of_project", { required: true })}
              required
            />
          </div>

          <Input
            label="Sponsoring Agency"
            placeholder="e.g. DST - SERB"
            {...register("sponsoring_agency")}
          />

          <Input
            label="Duration"
            placeholder="e.g. 2 years"
            {...register("duration")}
          />

          <Input
            label="Amount"
            placeholder="e.g. 5,00,000"
            {...register("amount")}
          />

          <Controller
            control={control}
            name="project_type"
            render={({ field }) => (
              <Select
                label="Project Type"
                value={field.value}
                onValueChange={field.onChange}
                options={typeOptions}
                placeholder="Select Project Type"
              />
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Status"
                value={field.value}
                onValueChange={field.onChange}
                options={statusOptions}
                placeholder="Select Status"
              />
            )}
          />

          <Input
            label="Date From"
            placeholder="e.g. 2019-10-23"
            {...register("date_from")}
          />

          <Input
            label="To"
            placeholder="e.g. Tilldate"
            {...register("date_to")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button
            variant="ghost"
            type="button"
            onClick={() => reset(defaults)}
            disabled={isSubmitting || mutation.isPending}
          >
            Reset
          </Button>

          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Project" : "Save Project"}
          </Button>
        </div>
      </form>
    </div>
  );
};
