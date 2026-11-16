"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { Button, Input, Textarea } from "@/components/ui";
import { staffActions } from "@/actions";

export const AddWork = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    institution_name: editData?.institution_name || "",
    designation: editData?.designation || "",
    address_of_institution: editData?.address_of_institution || "",
    pay_band_basic_pay: editData?.pay_band_basic_pay || "",
    period_of_service_from: editData?.period_of_service_from || "",
    period_of_service_to: editData?.period_of_service_to || "",
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
        institution_name: editData.institution_name || "",
        designation: editData.designation || "",
        address_of_institution: editData.address_of_institution || "",
        pay_band_basic_pay: editData.pay_band_basic_pay || "",
        period_of_service_from: editData.period_of_service_from || "",
        period_of_service_to: editData.period_of_service_to || "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("work");

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
          `Work Experience ${type === "add" ? "added" : "updated"} successfully`
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
            label="*Name Of The Institution"
            placeholder="e.g. Bishop Heber College"
            {...register("institution_name", { required: true })}
            required
          />

          <Input
            label="*Designation"
            placeholder="e.g. Assistant Professor"
            {...register("designation", { required: true })}
            required
          />

          <Input
            label="Pay Band / Basic Pay"
            placeholder="e.g. 15600-39100"
            {...register("pay_band_basic_pay")}
          />

          <Input
            label="Period Of Service From"
            placeholder="e.g. July 2001"
            {...register("period_of_service_from")}
          />

          <Input
            label="To"
            placeholder="e.g. till date"
            {...register("period_of_service_to")}
          />

          <div className="sm:col-span-3">
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              Address of the Institution
            </label>
            <Textarea
              rows={2}
              placeholder="e.g. Vayalur Road, Puthur, Tiruchirappalli"
              {...register("address_of_institution")}
              className="w-full"
            />
          </div>
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
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Work" : "Save Work"}
          </Button>
        </div>
      </form>
    </div>
  );
};
