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
  { value: "Editor", label: "Editor" },
];

export const AddPublishedBook = ({
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
    with_or_without_isbn: editData?.with_or_without_isbn || "with ISBN",
    book_name: editData?.book_name || "",
    level_of_book: editData?.level_of_book || "National",
    author: editData?.author || "Author",
    publishers_name: editData?.publishers_name || "",
    place_of_publication: editData?.place_of_publication || "",
    isbn: editData?.isbn || "",
    volume: editData?.volume || "",
    issue_no: editData?.issue_no || "",
    page_no: editData?.page_no || "",
    month_and_year: editData?.month_and_year || "",
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
        with_or_without_isbn: editData.with_or_without_isbn || "with ISBN",
        book_name: editData.book_name || "",
        level_of_book: editData.level_of_book || "National",
        author: editData.author || "Author",
        publishers_name: editData.publishers_name || "",
        place_of_publication: editData.place_of_publication || "",
        isbn: editData.isbn || "",
        volume: editData.volume || "",
        issue_no: editData.issue_no || "",
        page_no: editData.page_no || "",
        month_and_year: editData.month_and_year || "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("published_book_article");

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
          `Book Article ${type === "add" ? "added" : "updated"} successfully`
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
              placeholder="e.g. Advancements in Edge Computing"
              {...register("title_of_article", { required: true })}
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              ISBN Mode
            </label>
            <Controller
              control={control}
              name="with_or_without_isbn"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex items-center gap-4 mt-2"
                >
                  {["with ISBN", "without ISBN"].map((m) => (
                    <div key={m} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={m} id={`published-isbn-${m}`} />
                      <label htmlFor={`published-isbn-${m}`} className="text-xs cursor-pointer">
                        {m}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <Input
            label="*Book Name"
            placeholder="e.g. Emerging Trends in Information Technology"
            {...register("book_name", { required: true })}
            required
          />

          <Controller
            control={control}
            name="level_of_book"
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

          <Input
            label="Publisher's Name"
            placeholder="e.g. Springer Nature"
            {...register("publishers_name")}
          />

          <Input
            label="Place Of Publication"
            placeholder="e.g. New Delhi"
            {...register("place_of_publication")}
          />

          <Input
            label="ISBN"
            placeholder="e.g. 978-3-16-148410-0"
            {...register("isbn")}
          />

          <Input
            label="Volume"
            placeholder="e.g. Vol 2"
            {...register("volume")}
          />

          <Input
            label="Issue NO"
            placeholder="e.g. 1"
            {...register("issue_no")}
          />

          <Input
            label="Page NOs"
            placeholder="e.g. 112-124"
            {...register("page_no")}
          />

          <Input
            label="Month & Year"
            placeholder="e.g. March 2022"
            {...register("month_and_year")}
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
