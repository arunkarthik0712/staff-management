"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { Button, Input } from "@/components/ui";
import { staffActions } from "@/actions";

export const AddCourse = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    course_name: editData?.course_name || "",
    place_of_study: editData?.place_of_study || "",
    month_and_year_of_completion: editData?.month_and_year_of_completion || "",
    duration: editData?.duration || "",
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
        course_name: editData.course_name || "",
        place_of_study: editData.place_of_study || "",
        month_and_year_of_completion: editData.month_and_year_of_completion || "",
        duration: editData.duration || "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("course");

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
          `Course ${type === "add" ? "added" : "updated"} successfully`
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="*Name of the Course"
            placeholder="e.g. Full Stack Web Development"
            {...register("course_name", { required: true })}
            required
          />

          <Input
            label="Place of Study"
            placeholder="e.g. NPTEL / Coursera"
            {...register("place_of_study")}
          />

          <Input
            label="Month and Year of Completion"
            placeholder="e.g. May 2016"
            {...register("month_and_year_of_completion")}
          />

          <Input
            label="Duration"
            placeholder="e.g. 4 months"
            {...register("duration")}
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
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Course" : "Save Course"}
          </Button>
        </div>
      </form>
    </div>
  );
};
