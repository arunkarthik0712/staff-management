"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { Button, Input } from "@/components/ui";
import { staffActions } from "@/actions";

export const AddExtension = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    position_designation: editData?.position_designation || "",
    period_tenure: editData?.period_tenure || "",
    till_date: editData?.till_date || "",
    program_title: editData?.program_title || "",
    target_group: editData?.target_group || "",
    place: editData?.place || "",
    amount_spent: editData?.amount_spent || "",
    date_from: editData?.date_from ? editData.date_from.substring(0, 10) : "",
    date_to: editData?.date_to ? editData.date_to.substring(0, 10) : "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: defaults });

  useEffect(() => {
    if (type === "edit" && editData) {
      reset({
        position_designation: editData.position_designation || "",
        period_tenure: editData.period_tenure || "",
        till_date: editData.till_date || "",
        program_title: editData.program_title || "",
        target_group: editData.target_group || "",
        place: editData.place || "",
        amount_spent: editData.amount_spent || "",
        date_from: editData.date_from ? editData.date_from.substring(0, 10) : "",
        date_to: editData.date_to ? editData.date_to.substring(0, 10) : "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("extension");

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
          `Extension Activity ${type === "add" ? "added" : "updated"} successfully`
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
          <Input
            label="*Position / Designation"
            placeholder="e.g. Coordinator / Advisor"
            {...register("position_designation", { required: true })}
            required
          />

          <Input
            label="Period / Tenure"
            placeholder="e.g. 2 years"
            {...register("period_tenure")}
          />

          <Input
            label="Till Date"
            placeholder="e.g. Till date / 2022"
            {...register("till_date")}
          />

          <div className="sm:col-span-2">
            <Input
              label="*Program Title"
              placeholder="e.g. Community Health Awareness Camp"
              {...register("program_title", { required: true })}
              required
            />
          </div>

          <Input
            label="Target Group"
            placeholder="e.g. School students / Rural youth"
            {...register("target_group")}
          />

          <Input
            label="Place"
            placeholder="e.g. Trichy"
            {...register("place")}
          />

          <Input
            label="Amount Spent"
            placeholder="e.g. 25000"
            {...register("amount_spent")}
          />

          <Input
            label="Date From"
            type="date"
            {...register("date_from")}
          />

          <Input
            label="To"
            type="date"
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
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Activity" : "Save Activity"}
          </Button>
        </div>
      </form>
    </div>
  );
};
