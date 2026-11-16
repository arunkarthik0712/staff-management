"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { Button, Input, Select } from "@/components/ui";
import { staffActions } from "@/actions";

const typeOptions = [
  { value: "Conference", label: "Conference" },
  { value: "Workshop", label: "Workshop" },
  { value: "Seminar", label: "Seminar" },
  { value: "FDP", label: "FDP" },
];

const levelOptions = [
  { value: "International", label: "International" },
  { value: "National", label: "National" },
  { value: "State", label: "State" },
  { value: "Regional", label: "Regional" },
  { value: "College", label: "College" },
];

export const AddConference = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    conf_workshop_type: editData?.conf_workshop_type || "Conference",
    conf_workshop_name: editData?.conf_workshop_name || "",
    sponsored_by: editData?.sponsored_by || "",
    organized_by: editData?.organized_by || "",
    place: editData?.place || "",
    level: editData?.level || "National",
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
        conf_workshop_type: editData.conf_workshop_type || "Conference",
        conf_workshop_name: editData.conf_workshop_name || "",
        sponsored_by: editData.sponsored_by || "",
        organized_by: editData.organized_by || "",
        place: editData.place || "",
        level: editData.level || "National",
        date_from: editData.date_from ? editData.date_from.substring(0, 10) : "",
        date_to: editData.date_to ? editData.date_to.substring(0, 10) : "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("conference");

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
          `Conference / Workshop ${type === "add" ? "added" : "updated"} successfully`
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
            name="conf_workshop_type"
            render={({ field }) => (
              <Select
                label="*CONF/WKSHP/SEM"
                value={field.value}
                onValueChange={field.onChange}
                options={typeOptions}
                placeholder="Select Type"
              />
            )}
          />

          <div className="sm:col-span-2">
            <Input
              label="*CONF/WKSHP/SEM NAME"
              placeholder="e.g. National Conference on Advanced Computing"
              {...register("conf_workshop_name", { required: true })}
              required
            />
          </div>

          <Input
            label="Sponsored By"
            placeholder="e.g. UGC / DST"
            {...register("sponsored_by")}
          />

          <Input
            label="Organized By"
            placeholder="e.g. Department of Computer Science"
            {...register("organized_by")}
          />

          <Input
            label="Place"
            placeholder="e.g. Tiruchirappalli"
            {...register("place")}
          />

          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <Select
                label="Level"
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
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Details" : "Save Details"}
          </Button>
        </div>
      </form>
    </div>
  );
};
