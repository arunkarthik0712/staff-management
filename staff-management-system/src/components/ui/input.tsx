"use client";
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  useId,
} from "react";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import {
  Eye,
  EyeOff,
  X,
  AlertCircle,
  SquareCheck,
  Square,
  Circle,
  CircleCheck,
} from "lucide-react";
import { inputVariants } from "./variants";
import { Switch, Toggle } from ".";
import { useDropzone, type Accept } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface InputProps extends Omit<
  React.ComponentProps<"input">,
  "size" | "width"
> {
  variant?: VariantProps<typeof inputVariants>["variant"];
  size?: VariantProps<typeof inputVariants>["size"];
  rounded?: VariantProps<typeof inputVariants>["rounded"];
  width?: VariantProps<typeof inputVariants>["width"];
  state?: "default" | "error" | "success" | "warning";
  animation?: VariantProps<typeof inputVariants>["animation"];
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  clearable?: boolean;
  onClear?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showPasswordToggle?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  onValueChange?: (
    value: string | boolean,
    e?: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  options?: Array<{ value: string; label: string }>;
}

interface NumberInputProps extends Omit<InputProps, "type"> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  allowMouseWheel?: boolean;
  defaultValue?: string | number;
}

interface TextAreaProps extends Omit<React.ComponentProps<"textarea">, "size"> {
  variant?: VariantProps<typeof inputVariants>["variant"];
  rounded?: VariantProps<typeof inputVariants>["rounded"];
  width?: VariantProps<typeof inputVariants>["width"];
  state?: "default" | "error" | "success" | "warning";
  animation?: VariantProps<typeof inputVariants>["animation"];
  label?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  autoResize?: boolean;
  maxRows?: number;
  minRows?: number;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  onValueChange?: (
    value: string,
    e?: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

interface SearchInputProps extends Omit<InputProps, "type"> {
  onSearch?: (value: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
  searchDelay?: number;
}

/* ------------------------------------------------------------------ */
/*  INPUT                                                             */
/* ------------------------------------------------------------------ */

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      size,
      rounded,
      width,
      state: stateProp,
      animation,
      label,
      error,
      hint,
      leftElement,
      rightElement,
      leftAddon,
      rightAddon,
      isRequired = false,
      isReadOnly = false,
      isInvalid = false,
      isDisabled = false,
      isSuccess = false,
      isWarning = false,
      clearable = false,
      onClear,
      showPasswordToggle = false,
      containerClassName,
      labelClassName,
      errorClassName,
      hintClassName,
      onValueChange,
      id: propId,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      inputMode,
      autoComplete,
      onChange,
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const id = propId || `input-${uniqueId}`;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const computedState =
      isInvalid || error
        ? "error"
        : isSuccess
          ? "success"
          : isWarning
            ? "warning"
            : "default";

    const inputState = stateProp ?? computedState;

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        inputRef.current.focus();
      }
      onClear?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(e.target.value, e);
      onChange?.(e);
    };

    const describedById =
      [ariaDescribedBy, hint ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={cn("relative flex flex-col gap-1.5", containerClassName)}>
        {label && type !== "toggle" && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              isRequired &&
                "after:text-destructive after:content-['*'] after:ml-0.5",
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="inline-flex h-full items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
              {leftAddon}
            </div>
          )}

          <div
            className={cn(
              "relative flex items-center w-full",
              leftAddon && "rounded-l-none",
              rightAddon && "rounded-r-none",
            )}
          >
            {leftElement && (
              <div className="absolute left-2.5 flex h-full items-center pointer-events-none text-muted-foreground">
                {leftElement}
              </div>
            )}

            {type === "switch" ? (
              <Switch
                id={id}
                checked={!!props.value}
                disabled={isDisabled}
                onCheckedChange={(v: boolean) => {
                  onValueChange?.(v);
                  (props as any).onChange?.({ target: { value: v } });
                }}
              />
            ) : type === "toggle" ? (
              <Toggle
                pressed={!!props.value}
                disabled={isDisabled}
                onPressedChange={(v: boolean) => {
                  onValueChange?.(v);
                  (props as any).onChange?.({ target: { value: v } });
                }}
                variant="outline"
                className="h-8.5 data-[state=on]:bg-transparent data-[state=on]:border-primary data-[state=on]:text-primary data-[state=on]:*:[svg]:stroke-primary cursor-pointer"
              >
                {!!props.value ? <SquareCheck /> : <Square />}
                {label || "Toggle"}
              </Toggle>
            ) : type === "radio" ? (
              <div className="flex items-center flex-wrap gap-2">
                {(props.options || []).map((opt) => (
                  <Toggle
                    key={opt.value}
                    pressed={props.value === opt.value}
                    disabled={isDisabled}
                    onPressedChange={(pressed: boolean) => {
                      if (pressed) {
                        onValueChange?.(opt.value);
                        (props as any).onChange?.({
                          target: { value: opt.value },
                        });
                      }
                    }}
                    variant="outline"
                    className="h-8.5 data-[state=on]:bg-transparent data-[state=on]:border-primary data-[state=on]:text-primary data-[state=on]:*:[svg]:stroke-primary cursor-pointer"
                  >
                    {props.value === opt.value ? <CircleCheck /> : <Circle />}
                    {opt.label}
                  </Toggle>
                ))}
              </div>
            ) : (
              /* ----------------------- DEFAULT ORIGINAL INPUT ------------------------- */
              <input
                id={id}
                ref={inputRef}
                type={inputType}
                disabled={isDisabled}
                readOnly={isReadOnly}
                // required={isRequired}
                aria-invalid={isInvalid || !!error}
                aria-describedby={describedById}
                aria-labelledby={ariaLabelledBy}
                aria-required={isRequired}
                inputMode={inputMode}
                autoComplete={autoComplete}
                data-state={inputState}
                onChange={handleChange}
                className={cn(
                  inputVariants({
                    variant,
                    size,
                    rounded,
                    width,
                    state: inputState,
                    animation,
                    disabled: isDisabled,
                  }),
                  leftElement && "pl-9",
                  (rightElement ||
                    (clearable && props.value) ||
                    (type === "password" && showPasswordToggle)) &&
                    "pr-9",
                  type === "date" && [
                    "relative pr-9",
                    "[&::-webkit-calendar-picker-indicator]:absolute",
                    "[&::-webkit-calendar-picker-indicator]:right-3",
                    "[&::-webkit-calendar-picker-indicator]:top-1/2",
                    "[&::-webkit-calendar-picker-indicator]:-translate-y-1/2",
                    "[&::-webkit-calendar-picker-indicator]:m-0",
                    "[&::-webkit-calendar-picker-indicator]:p-0",
                    "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                    "[&::-webkit-calendar-picker-indicator]:opacity-100",
                  ],
                  className,
                )}
                {...props}
              />
            )}

            {/* <input
              id={id}
              ref={inputRef}
              type={inputType}
              data-slot="input"
              disabled={isDisabled}
              readOnly={isReadOnly}
              required={isRequired}
              aria-invalid={isInvalid || !!error}
              aria-describedby={describedById}
              aria-labelledby={ariaLabelledBy}
              aria-required={isRequired}
              inputMode={inputMode}
              autoComplete={autoComplete}
              data-state={inputState}
              onChange={handleChange}
              className={cn(
                inputVariants({
                  variant,
                  size,
                  rounded,
                  width,
                  state: inputState,
                  animation,
                  disabled: isDisabled,
                }),
                leftElement && "pl-9",
                (rightElement ||
                  (clearable && props.value) ||
                  (type === "password" && showPasswordToggle)) &&
                  "pr-9",
                className
              )}
              {...props}
            /> */}

            {inputState === "error" && !rightElement && (
              <div className="absolute right-2.5 text-destructive">
                <AlertCircle aria-hidden="true" size={16} />
              </div>
            )}

            {type === "password" && showPasswordToggle && (
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2.5 p-1 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}

            {clearable &&
              props.value &&
              !(type === "password" && showPasswordToggle) && (
                <button
                  type="button"
                  aria-label="Clear input"
                  onClick={handleClear}
                  className="absolute right-2.5 p-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  <X size={16} />
                </button>
              )}

            {rightElement &&
              !(type === "password" && showPasswordToggle) &&
              !clearable && (
                <div className="absolute right-2.5 flex h-full items-center pointer-events-none text-muted-foreground">
                  {rightElement}
                </div>
              )}
          </div>

          {rightAddon && (
            <div className="inline-flex h-full items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-muted-foreground">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className={cn(
              "text-xs font-medium text-destructive",
              errorClassName,
            )}
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p
            id={hintId}
            className={cn("text-xs text-muted-foreground", hintClassName)}
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

/* ------------------------------------------------------------------ */
/*  NumberInput                                                       */
/* ------------------------------------------------------------------ */
const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min,
      max,
      step = 1,
      precision = 0,
      onValueChange,
      defaultValue,
      value: controlledValue,
      allowMouseWheel = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<string | number>(
      defaultValue ?? "",
    );
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const format = useCallback(
      (v: number) => (precision != null ? v.toFixed(precision) : v.toString()),
      [precision],
    );

    const increment = () => {
      const current = parseFloat(String(value)) || 0;
      const next = Math.min(max ?? Infinity, current + step);
      const formatted = format(next);
      if (!isControlled) setInternalValue(formatted);
      onValueChange?.(formatted);
    };

    const decrement = () => {
      const current = parseFloat(String(value)) || 0;
      const next = Math.max(min ?? -Infinity, current - step);
      const formatted = format(next);
      if (!isControlled) setInternalValue(formatted);
      onValueChange?.(formatted);
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (!allowMouseWheel) return;
      e.preventDefault();
      e.deltaY < 0 ? increment() : decrement();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      if (!isControlled) setInternalValue(newVal);
      onValueChange?.(newVal);
      onChange?.(e);
    };

    return (
      <Input
        ref={ref}
        type="number"
        value={value}
        onChange={handleChange}
        onWheel={handleWheel}
        min={min}
        max={max}
        step={step}
        rightAddon={
          <div className="flex flex-col">
            <button
              type="button"
              onClick={increment}
              className="flex h-4 w-6 items-center justify-center text-xs hover:bg-accent"
              tabIndex={-1}
            >
              ▲
            </button>
            <button
              type="button"
              onClick={decrement}
              className="flex h-4 w-6 items-center justify-center text-xs hover:bg-accent"
              tabIndex={-1}
            >
              ▼
            </button>
          </div>
        }
        {...props}
      />
    );
  },
);
NumberInput.displayName = "NumberInput";

/* ------------------------------------------------------------------ */
/*  TextArea                                                          */
/* ------------------------------------------------------------------ */
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      variant,
      rounded,
      width,
      state: stateProp,
      animation,
      label,
      error,
      hint,
      isRequired = false,
      isReadOnly = false,
      isInvalid = false,
      isDisabled = false,
      isSuccess = false,
      isWarning = false,
      autoResize = false,
      maxRows,
      minRows = 3,
      rows,
      containerClassName,
      labelClassName,
      errorClassName,
      hintClassName,
      onValueChange,
      id: propId,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      onChange,
      ...props
    },
    ref,
  ) => {
    const uniqueId = React.useId();
    const id = propId || `textarea-${uniqueId}`;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const adjustHeight = useCallback(() => {
      if (!autoResize || !textareaRef.current) return;
      textareaRef.current.style.height = "auto";
      const lineHeight =
        parseInt(getComputedStyle(textareaRef.current).lineHeight) || 20;
      let newHeight = Math.max(
        minRows * lineHeight,
        textareaRef.current.scrollHeight,
      );
      if (maxRows) {
        const maxHeight = maxRows * lineHeight;
        newHeight = Math.min(newHeight, maxHeight);
        textareaRef.current.style.overflowY =
          newHeight >= maxHeight ? "auto" : "hidden";
      }
      textareaRef.current.style.height = `${newHeight}px`;
    }, [autoResize, maxRows, minRows]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) adjustHeight();
      onValueChange?.(e.target.value, e);
      onChange?.(e);
    };

    useEffect(() => {
      if (autoResize) adjustHeight();
    }, [autoResize, adjustHeight, props.value, props.defaultValue]);

    const computedState =
      isInvalid || error
        ? "error"
        : isSuccess
          ? "success"
          : isWarning
            ? "warning"
            : "default";
    const inputState = stateProp ?? computedState;
    const describedById =
      [ariaDescribedBy, hint ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={cn("relative flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              isRequired &&
                "after:text-destructive after:content-['*'] after:ml-0.5",
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        <textarea
          id={id}
          ref={textareaRef}
          data-slot="textarea"
          disabled={isDisabled}
          readOnly={isReadOnly}
          // required={isRequired}
          rows={rows}
          aria-invalid={isInvalid || !!error}
          aria-describedby={describedById}
          aria-labelledby={ariaLabelledBy}
          aria-required={isRequired}
          data-state={inputState}
          onChange={handleChange}
          className={cn(
            inputVariants({
              variant,
              rounded,
              width,
              state: inputState,
              animation,
              disabled: isDisabled,
            }),
            "min-h-[80px] resize-y",
            className,
          )}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            className={cn(
              "text-xs font-medium text-destructive",
              errorClassName,
            )}
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p
            id={hintId}
            className={cn("text-xs text-muted-foreground", hintClassName)}
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);
TextArea.displayName = "TextArea";

/* ------------------------------------------------------------------ */
/*  Search Input                                                      */
/* ------------------------------------------------------------------ */
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { onSearch, onValueChange, onClear, searchDelay = 300, onChange, ...props },
    ref,
  ) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      onValueChange?.(e.target.value, e);
      onChange?.(e);
      if (onSearch) {
        timerRef.current = setTimeout(() => {
          onSearch(e.target.value, e);
        }, searchDelay);
      }
    };

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    return (
      <Input
        ref={ref}
        type="search"
        onChange={handleChange}
        onClear={(e) => {
          onClear?.(e);
          onSearch?.("", e as any);
        }}
        clearable
        leftElement={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        {...props}
      />
    );
  },
);
SearchInput.displayName = "SearchInput";

/* ------------------------------------------------------------------ */
/*  CustomDropZone                                                     */
/* ------------------------------------------------------------------ */

/** A dropzone entry is either a freshly-picked File or an existing URL string. */
type DropFile = File | string;

/** Map of field name → its list of files/URLs. */
type UploadedFilesMap = Record<string, DropFile[]>;

interface CustomDropZoneProps {
  /** Field name — the key under which files are stored in `uploadedFiles`. */
  name: string;
  label?: string;
  /** Controlled file state, keyed by `name`. */
  uploadedFiles: UploadedFilesMap;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFilesMap>>;
  /** Max number of files allowed for this field. */
  number_of_images?: number;
  /** Max size per file, in bytes. */
  image_size?: number;
  /** Validation errors keyed by field name (e.g. react-hook-form errors). */
  errors?: Record<string, { message?: string } | undefined>;
  required?: boolean;
  labelComponent?: React.ReactNode;
  labelPlacement?: "default" | "none";
  /** Which file categories to accept. */
  fileType?: "image" | "docs" | "mixed";
  /** Extra node rendered inside the dropzone (variant "1"). */
  component?: React.ReactNode;
  /** UI variant: "1" = inline compact, "2" = tiled preview grid. */
  variant?: "1" | "2";
}

const CustomDropZone = ({
  name,
  label,
  uploadedFiles,
  number_of_images = 1,
  image_size = 5 * 1024 * 1024,
  errors,
  required = false,
  setUploadedFiles,
  labelComponent,
  labelPlacement = "default",
  fileType,
  component,
  variant = "1", // ✅ ADDED (same as old project)
}: CustomDropZoneProps) => {
  const getAcceptedFileTypes = (): Accept => {
    switch (fileType) {
      case "image":
        return {
          "image/jpeg": [],
          "image/jpg": [],
          "image/png": [],
          "image/webp": [],
          "image/avif": [],
          "image/svg+xml": [],
        };
      case "docs":
        return {
          "application/pdf": [],
          "application/msword": [],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [],
          "application/vnd.ms-excel": [],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            [],
          "text/csv": [],
        };
      case "mixed":
        return {
          "image/jpeg": [],
          "image/jpg": [],
          "image/png": [],
          "image/webp": [],
          "image/avif": [],
          "image/svg+xml": [],
          "application/pdf": [],
          "application/msword": [],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [],
          "application/vnd.ms-excel": [],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            [],
          "text/csv": [],
        };
      default:
        return {};
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles((prevFiles) => {
        const current = prevFiles[name] || [];

        const all: DropFile[] = [
          ...current,
          ...acceptedFiles.filter(
            (file) =>
              !current.some((f) =>
                file instanceof File
                  ? f instanceof File && f.name === file.name
                  : f === file,
              ),
          ),
        ];

        const limited = all.slice(0, number_of_images);
        return { ...prevFiles, [name]: limited };
      });
    },
    [name, setUploadedFiles, number_of_images],
  );

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: getAcceptedFileTypes(),
    maxFiles: number_of_images,
    maxSize: image_size,
    onDrop,
  });

  const acceptedFileItems = (uploadedFiles[name] || [])?.map((file, idx) => {
    const isFileObject = file instanceof File;
    const fileName = isFileObject ? file.name : file;
    const ext = fileName?.split(".").pop()?.toLowerCase() ?? "";

    const imageExts = ["jpeg", "jpg", "png", "webp", "avif", "svg"];
    const docExts = ["pdf", "doc", "docx", "xls", "xlsx", "csv"];

    const isImage = imageExts.includes(ext);
    const isDoc = docExts.includes(ext);

    if (!isImage && !isDoc) return null;

    return (
      <div
        key={idx}
        className={`relative mr-2 group transition-all duration-200 origin-center ${
          isImage
            ? "inline-block bg-card hover:scale-[3] hover:z-10 h-[22px] w-[22px]"
            : "inline-flex items-center justify-center px-2 py-1 rounded text-[10px] min-w-[90px] bg-muted text-foreground border border-border"
        }`}
      >
        {isImage ? (
          <>
            <img
              src={isFileObject ? URL.createObjectURL(file) : `${file}`}
              alt={fileName}
              className="w-full h-full object-cover rounded border"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFiles((prevFiles) => ({
                  ...prevFiles,
                  [name]: prevFiles[name].filter((element) => {
                    if (isFileObject && element instanceof File) {
                      return (
                        element.name !== file.name || element.size !== file.size
                      );
                    }
                    return element !== file;
                  }),
                }));
              }}
              className="cursor-pointer absolute -top-1 -right-1 bg-destructive text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]"
            >
              ×
            </button>
          </>
        ) : (
          <>
            <Link
              href={isFileObject ? "#" : `${file}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline truncate max-w-[100px]"
              onClick={(e) => e.stopPropagation()}
            >
              {fileName?.split("/").pop()}
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFiles((prevFiles) => ({
                  ...prevFiles,
                  [name]: prevFiles[name].filter((element) => {
                    if (isFileObject && element instanceof File) {
                      return (
                        element.name !== file.name || element.size !== file.size
                      );
                    }
                    return element !== file;
                  }),
                }));
              }}
              className="cursor-pointer absolute -top-1 -right-1 bg-destructive text-white rounded-full w-3 h-3 flex items-center justify-center"
            >
              ×
            </button>
          </>
        )}
      </div>
    );
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.path} className="text-xs text-destructive font-medium">
      <p className="font-semibold">{file.name}</p>
      {errors.map((e, idx) => {
        if (e.code === "file-too-large") {
          return (
            <p key={idx}>
              File too large. Max size: {Math.ceil(image_size / 1024)} KB
            </p>
          );
        }
        if (e.code === "file-invalid-type") {
          return <p key={idx}>Invalid file type</p>;
        }
        return <p key={idx}>{e.message}</p>;
      })}
    </div>
  ));

  return (
    <div className="w-full">
      {label && labelPlacement === "default" && (
        <label
          htmlFor={name}
          className="flex items-center gap-2 text-sm font-medium text-foreground mb-0.5"
        >
          <div>
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </div>
          {labelComponent && labelComponent}
        </label>
      )}

      {/* ===================================================== */}
      {/* ✅ VARIANT 2 UI (from old project, modernized)       */}
      {/* ===================================================== */}
      {variant === "2" ? (
        <div className="relative w-full border border-border rounded-md bg-card shadow-sm p-2 flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            {(uploadedFiles[name] || [])?.map((file, idx) => {
              const isFileObject = file instanceof File;
              const fileName = isFileObject ? file.name : file;
              const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
              const imgExts = [
                "jpeg",
                "jpg",
                "png",
                "gif",
                "webp",
                "avif",
                "svg",
              ];
              const isImg = imgExts.includes(ext);

              return (
                <div key={idx} className="relative group">
                  {isImg ? (
                    <img
                      src={isFileObject ? URL.createObjectURL(file) : `${file}`}
                      className="w-20 h-20 object-cover rounded-md border border-border"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted text-muted-foreground rounded-md border border-border flex items-center justify-center text-[10px]">
                      {ext.toUpperCase()}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFiles((prev) => ({
                        ...prev,
                        [name]: prev[name].filter((f) => f !== file),
                      }));
                    }}
                    className="cursor-pointer absolute -top-1 -right-1 bg-destructive text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>

          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center text-center border border-dashed border-border rounded-md p-3 cursor-pointer hover:border-primary/50 hover:bg-accent/40 transition-colors"
          >
            <CloudUpload className="text-muted-foreground mb-1" size={20} />
            <p className="text-xs font-medium text-foreground">Upload {label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {uploadedFiles[name]?.length || 0}/{number_of_images} Files
            </p>
          </div>

          <input {...getInputProps()} />
        </div>
      ) : (
        /* ===================================================== */
        /* ✅ VARIANT 1 (your default new UI)                    */
        /* ===================================================== */
        <div
          className={`rounded-md border relative ${
            errors && errors[name] ? "border-destructive" : "border-border"
          } bg-muted/40`}
        >
          <div
            {...getRootProps()}
            className="cursor-pointer flex items-center justify-between px-4 py-1.5 bg-background border border-border rounded-md hover:bg-accent transition-colors"
          >
            {acceptedFileItems.length > 0 ? (
              <div className="flex flex-wrap gap-1">{acceptedFileItems}</div>
            ) : (
              <p className="text-sm text-muted-foreground">Upload Files...</p>
            )}

            <CloudUpload size={18} className="text-muted-foreground" />
            <input {...getInputProps()} />
          </div>

          {component && component}
        </div>
      )}

      {errors && (
        <p className="text-xs text-destructive font-medium mt-1">
          {errors[name]?.message}
        </p>
      )}

      {fileRejectionItems.length > 0 && (
        <div className="mt-2 space-y-1">{fileRejectionItems}</div>
      )}
    </div>
  );
};

CustomDropZone.displayName = "CustomDropZone";

export { Input, NumberInput, TextArea, SearchInput, CustomDropZone };
export type {
  InputProps,
  NumberInputProps,
  TextAreaProps,
  SearchInputProps,
  CustomDropZoneProps,
  DropFile,
  UploadedFilesMap,
};
