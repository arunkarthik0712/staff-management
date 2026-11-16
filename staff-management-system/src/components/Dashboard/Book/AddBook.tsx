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

export const AddBook = ({
  type = "add",
  editData = {},
  onClose,
}: {
  type?: "add" | "edit";
  editData?: any;
  onClose?: () => void;
}) => {
  const defaults = {
    title_of_book: editData?.title_of_book || "",
    with_or_without_isbn: editData?.with_or_without_isbn || "with ISBN",
    level_of_book: editData?.level_of_book || "National",
    author: editData?.author || "Author",
    published_name: editData?.published_name || "",
    edition: editData?.edition || "",
    ch_in_edited_book: editData?.ch_in_edited_book || "",
    isbn: editData?.isbn || "",
    place_of_publication: editData?.place_of_publication || "",
    month_and_year_of_publication: editData?.month_and_year_of_publication || "",
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
        title_of_book: editData.title_of_book || "",
        with_or_without_isbn: editData.with_or_without_isbn || "with ISBN",
        level_of_book: editData.level_of_book || "National",
        author: editData.author || "Author",
        published_name: editData.published_name || "",
        edition: editData.edition || "",
        ch_in_edited_book: editData.ch_in_edited_book || "",
        isbn: editData.isbn || "",
        place_of_publication: editData.place_of_publication || "",
        month_and_year_of_publication: editData.month_and_year_of_publication || "",
      });
    }
  }, [type, editData, reset]);

  const actions = staffActions("book");

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
          `Book ${type === "add" ? "added" : "updated"} successfully`
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
              label="*Title Of The Book"
              placeholder="e.g. Cloud Computing Concepts & Architecture"
              {...register("title_of_book", { required: true })}
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
                      <RadioGroupItem value={m} id={`book-isbn-${m}`} />
                      <label htmlFor={`book-isbn-${m}`} className="text-xs cursor-pointer">
                        {m}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <Controller
            control={control}
            name="level_of_book"
            render={({ field }) => (
              <Select
                label="Level Of The Book"
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
            placeholder="e.g. McGraw Hill"
            {...register("published_name")}
          />

          <Input
            label="Edition"
            placeholder="e.g. 1st Edition"
            {...register("edition")}
          />

          <Input
            label="CH. In Edited Book"
            placeholder="e.g. Chapter 4"
            {...register("ch_in_edited_book")}
          />

          <Input
            label="ISBN"
            placeholder="e.g. 978-0-07-352332-3"
            {...register("isbn")}
          />

          <Input
            label="Place - Publication"
            placeholder="e.g. Chennai"
            {...register("place_of_publication")}
          />

          <Input
            label="Month & Year Of Publication"
            placeholder="e.g. January 2020"
            {...register("month_and_year_of_publication")}
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
            {mutation.isPending ? "Saving..." : type === "edit" ? "Update Book" : "Save Book"}
          </Button>
        </div>
      </form>
    </div>
  );
};
