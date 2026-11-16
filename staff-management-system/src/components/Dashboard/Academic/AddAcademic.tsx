"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { Button, Input, Select } from "@/components/ui";
import { staffActions } from "@/actions";

const degreeOptions = [
  { value: "Doctorate (PhD)", label: "Doctorate (PhD)" },
  { value: "Master's", label: "Master's" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Diploma", label: "Diploma" },
  { value: "Other", label: "Other" },
];

export const AddAcademic = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    degree: editData?.degree || "Bachelor's Degree",
    degree_name: editData?.degree_name || "",
    branch: editData?.branch || "",
    university_institution: editData?.university_institution || "",
    year_of_passing: editData?.year_of_passing || "",
    percentage_cgpa: editData?.percentage_cgpa || "",
    class: editData?.class || "",
    rank: editData?.rank || "",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: defaults,
  });

  useEffect(() => {
    if (type === "edit" && editData) {
      reset({
        degree: editData.degree || "Bachelor's Degree",
        degree_name: editData.degree_name || "",
        branch: editData.branch || "",
        university_institution: editData.university_institution || "",
        year_of_passing: editData.year_of_passing || "",
        percentage_cgpa: editData.percentage_cgpa || "",
        class: editData.class || "",
        rank: editData.rank || "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("academic");

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
          `Academic Detail ${type === "add" ? "added" : "updated"} successfully`
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
          <Controller
            control={control}
            name="degree"
            render={({ field }) => (
              <Select
                label="*Degree"
                value={field.value}
                onValueChange={field.onChange}
                options={degreeOptions}
                placeholder="Select Degree"
              />
            )}
          />

          <Input
            label="*Degree Name"
            placeholder="e.g. M.Phil, MCA, B.Sc"
            {...register("degree_name", { required: true })}
            required
          />

          <Input
            label="*Branch"
            placeholder="e.g. Computer Science, Chemistry"
            {...register("branch", { required: true })}
            required
          />

          <Input
            label="University / Institution"
            placeholder="e.g. Bishop Heber College"
            {...register("university_institution")}
          />

          <Input
            label="Year of Passing"
            placeholder="e.g. 2019"
            {...register("year_of_passing")}
          />

          <Input
            label="Percentage / CGPA"
            placeholder="e.g. 79.68"
            {...register("percentage_cgpa")}
          />

          <Input
            label="Class"
            placeholder="e.g. 1st Class with Distinction"
            {...register("class")}
          />

          <Input
            label="Rank (if any)"
            placeholder="e.g. 1st Rank"
            {...register("rank")}
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
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Academic" : "Save Academic"}
          </Button>
        </div>
      </form>
    </div>
  );
};
