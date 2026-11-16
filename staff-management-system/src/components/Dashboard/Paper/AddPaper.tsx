"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { Button, Input, Select } from "@/components/ui";
import { staffActions } from "@/actions";

const levelOptions = [
  { value: "International", label: "International" },
  { value: "National", label: "National" },
  { value: "State", label: "State" },
  { value: "Regional", label: "Regional" },
  { value: "College", label: "College" },
];

export const AddPaper = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    title_of_paper: editData?.title_of_paper || "",
    name_of_conf: editData?.name_of_conf || "",
    sponsored_by: editData?.sponsored_by || "",
    organized_by: editData?.organized_by || "",
    place: editData?.place || "",
    conference_level: editData?.conference_level || "National",
    date_from: editData?.date_from ? editData.date_from.substring(0, 10) : "",
    date_to: editData?.date_to ? editData.date_to.substring(0, 10) : "",
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
        title_of_paper: editData.title_of_paper || "",
        name_of_conf: editData.name_of_conf || "",
        sponsored_by: editData.sponsored_by || "",
        organized_by: editData.organized_by || "",
        place: editData.place || "",
        conference_level: editData.conference_level || "National",
        date_from: editData.date_from ? editData.date_from.substring(0, 10) : "",
        date_to: editData.date_to ? editData.date_to.substring(0, 10) : "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("paper");

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
          `Paper Presented ${type === "add" ? "added" : "updated"} successfully`
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
              label="*Title Of The Paper"
              placeholder="e.g. Deep Learning Applications in Healthcare"
              {...register("title_of_paper", { required: true })}
              required
            />
          </div>

          <Input
            label="*Name Of The CONF"
            placeholder="e.g. IEEE International Conference"
            {...register("name_of_conf", { required: true })}
            required
          />

          <Input
            label="Sponsored By"
            placeholder="e.g. IEEE / ACM"
            {...register("sponsored_by")}
          />

          <Input
            label="Organized By"
            placeholder="e.g. Department of Computer Science"
            {...register("organized_by")}
          />

          <Input
            label="Place"
            placeholder="e.g. Chennai, Tamil Nadu"
            {...register("place")}
          />

          <Controller
            control={control}
            name="conference_level"
            render={({ field }) => (
              <Select
                label="Conference Level"
                value={field.value}
                onValueChange={field.onChange}
                options={levelOptions}
                placeholder="Select Level"
              />
            )}
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
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Paper" : "Save Paper"}
          </Button>
        </div>
      </form>
    </div>
  );
};
