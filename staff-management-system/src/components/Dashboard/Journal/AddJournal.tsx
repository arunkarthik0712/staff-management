"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { Button, Input, Select, RadioGroup, RadioGroupItem } from "@/components/ui";
import { staffActions } from "@/actions";

const levelOptions = [
  { value: "International", label: "International" },
  { value: "National", label: "National" },
  { value: "State", label: "State" },
  { value: "Regional", label: "Regional" },
  { value: "College", label: "College" },
];

const authorOptions = [
  { value: "Author", label: "Author" },
  { value: "Co-Author", label: "Co-Author" },
];

const typeOptions = [
  { value: "UGC Listed", label: "UGC Listed" },
  { value: "Peer-Reviewed", label: "Peer-Reviewed" },
  { value: "Scopus Indexed", label: "Scopus Indexed" },
  { value: "SCI", label: "SCI" },
  { value: "Other", label: "Other" },
];

export const AddJournal = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    title_of_article: editData?.title_of_article || "",
    with_or_without_issn: editData?.with_or_without_issn || "with ISSN",
    journal_name: editData?.journal_name || "",
    level: editData?.level || "National",
    author: editData?.author || "Author",
    type: editData?.type || "Peer-Reviewed",
    impact_factor: editData?.impact_factor || "",
    citation_index: editData?.citation_index || "",
    h_index: editData?.h_index || "",
    scopus_index: editData?.scopus_index || "",
    issn: editData?.issn || "",
    volume: editData?.volume || "",
    issue_no: editData?.issue_no || "",
    page_numbers: editData?.page_numbers || "",
    date_of_publish: editData?.date_of_publish || "",
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
        title_of_article: editData.title_of_article || "",
        with_or_without_issn: editData.with_or_without_issn || "with ISSN",
        journal_name: editData.journal_name || "",
        level: editData.level || "National",
        author: editData.author || "Author",
        type: editData.type || "Peer-Reviewed",
        impact_factor: editData.impact_factor || "",
        citation_index: editData.citation_index || "",
        h_index: editData.h_index || "",
        scopus_index: editData.scopus_index || "",
        issn: editData.issn || "",
        volume: editData.volume || "",
        issue_no: editData.issue_no || "",
        page_numbers: editData.page_numbers || "",
        date_of_publish: editData.date_of_publish || "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("journal");

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
          `Journal Article ${type === "add" ? "added" : "updated"} successfully`
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
              label="*Title Of The Article"
              placeholder="e.g. Machine Learning in Cloud Security"
              {...register("title_of_article", { required: true })}
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              ISSN Mode
            </label>
            <Controller
              control={control}
              name="with_or_without_issn"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex items-center gap-4 mt-2"
                >
                  {["with ISSN", "without ISSN"].map((m) => (
                    <div key={m} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={m} id={`issn-${m}`} />
                      <label htmlFor={`issn-${m}`} className="text-xs cursor-pointer">
                        {m}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <Input
            label="*Journal Name"
            placeholder="e.g. International Journal of Computer Science"
            {...register("journal_name", { required: true })}
            required
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

          <Controller
            control={control}
            name="author"
            render={({ field }) => (
              <Select
                label="Author"
                value={field.value}
                onValueChange={field.onChange}
                options={authorOptions}
                placeholder="Select Author"
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
            label="Impact Factor"
            placeholder="e.g. 4.5"
            {...register("impact_factor")}
          />

          <Input
            label="Citation Index"
            placeholder="e.g. 12"
            {...register("citation_index")}
          />

          <Input
            label="h-Index"
            placeholder="e.g. 8"
            {...register("h_index")}
          />

          <Input
            label="Scopus Index"
            placeholder="e.g. 23"
            {...register("scopus_index")}
          />

          <Input
            label="ISSN"
            placeholder="e.g. 2345-6789"
            {...register("issn")}
          />

          <Input
            label="Volume"
            placeholder="e.g. Vol 5"
            {...register("volume")}
          />

          <Input
            label="Issue NO"
            placeholder="e.g. Issue 2"
            {...register("issue_no")}
          />

          <Input
            label="Page NOs"
            placeholder="e.g. 45-52"
            {...register("page_numbers")}
          />

          <Input
            label="Date Of Publish"
            placeholder="e.g. October 2021"
            {...register("date_of_publish")}
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
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Article" : "Save Article"}
          </Button>
        </div>
      </form>
    </div>
  );
};
