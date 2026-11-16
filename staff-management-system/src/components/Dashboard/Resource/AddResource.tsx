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

const typeOptions = [
  { value: "Seminar", label: "Seminar" },
  { value: "Workshop", label: "Workshop" },
  { value: "Conference", label: "Conference" },
  { value: "Guest Lecture", label: "Guest Lecture" },
  { value: "FDP", label: "FDP" },
];

export const AddResource = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    topic: editData?.topic || "",
    level: editData?.level || "National",
    type: editData?.type || "Guest Lecture",
    place: editData?.place || "",
    date_of_event: editData?.date_of_event ? editData.date_of_event.substring(0, 10) : "",
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
        topic: editData.topic || "",
        level: editData.level || "National",
        type: editData.type || "Guest Lecture",
        place: editData.place || "",
        date_of_event: editData.date_of_event ? editData.date_of_event.substring(0, 10) : "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("resource_person");

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
          `Resource Person record ${type === "add" ? "added" : "updated"} successfully`
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
          <div className="sm:col-span-2">
            <Input
              label="*Topic"
              placeholder="e.g. Next-Generation Cybersecurity Paradigms"
              {...register("topic", { required: true })}
              required
            />
          </div>

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

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                label="Type"
                value={field.value}
                onValueChange={field.onChange}
                options={typeOptions}
                placeholder="Select Type"
              />
            )}
          />

          <Input
            label="Place"
            placeholder="e.g. St. Joseph's College, Trichy"
            {...register("place")}
          />

          <Input
            label="Date"
            type="date"
            {...register("date_of_event")}
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
