"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, X, Search } from "lucide-react";
import { selectVariants } from "./variants";
import Image from "next/image";
import { type LucideIcon } from "lucide-react";
import { type ComponentProps } from "react";

// ============================================
// INTERFACES
// ============================================

interface SelectOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  image?: string;
  disabled?: boolean;
}

interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

interface MemoizedSelectItemProps {
  className?: string;
  children?: React.ReactNode;
  icon?: LucideIcon;
  image?: string;
  hasIconSlot?: boolean;
  value: string;
  isSelected?: boolean;
  disabled?: boolean;
}

interface VirtualizedSelectItemsProps {
  items: SelectOption[];
  hasIconSlot: boolean;
  value: string;
}

interface SelectProps {
  options: (SelectOption | SelectGroupOption)[];
  placeholder?: string;
  clearLabel?: string;
  allowClear?: boolean;
  isInvalid?: boolean;
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  contentClassName?: string;
  triggerClassName?: string;
  showIcons?: boolean;
  minimal?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  useVirtualization?: boolean;
  isDisabled?: boolean;
  [key: string]: unknown;
}

interface SelectTriggerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  isInvalid?: boolean;
  minimal?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
}

interface SelectValueProps {
  selectedOption?: SelectOption;
  placeholder: string;
  showIcons: boolean;
  className?: string;
}

interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
  position?: "popper" | "item-aligned";
}

interface SelectItemProps {
  className?: string;
  children?: React.ReactNode;
  icon?: LucideIcon;
  hasIconSlot?: boolean;
  value: string;
  disabled?: boolean;
}

interface SelectGroupProps extends ComponentProps<typeof SelectPrimitive.Group> {}

interface SelectLabelProps {
  className?: string;
  children?: React.ReactNode;
}

interface SelectSeparatorProps {
  className?: string;
}

interface SelectScrollButtonProps {
  className?: string;
}

// ============================================
// CONSTANTS
// ============================================

const ITEM_HEIGHT = 36; // Height of each select item
const VISIBLE_ITEMS = 10; // Number of items to render

const MemoizedSelectItem = React.memo<MemoizedSelectItemProps>(function MemoizedSelectItem({
  className,
  children,
  icon: Icon,
  image,
  hasIconSlot = false,
  value,
  isSelected,
  ...props
}) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      value={value}
      {...props}
    >
      {/* Icon / Image Slot */}
      {hasIconSlot && (
        <div className="size-4 flex items-center justify-center shrink-0">
          {image && image !== "null" && image !== "undefined" ? (
            <Image
              src={image}
              alt={(children as string) || ""}
              width={20}
              height={20}
              className="rounded object-cover"
            />
          ) : Icon ? (
            <Icon className="size-4" />
          ) : null}
        </div>
      )}

      <SelectPrimitive.ItemText className="truncate">
        {children}
      </SelectPrimitive.ItemText>

      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
});

// Virtual Scrolling Container
function VirtualizedSelectItems({ items, hasIconSlot, value }: VirtualizedSelectItemsProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    const endIndex = Math.min(
      startIndex + VISIBLE_ITEMS + 5, // Add buffer
      items.length,
    );

    return {
      visibleItems: items.slice(startIndex, endIndex),
      totalHeight: items.length * ITEM_HEIGHT,
      offsetY: startIndex * ITEM_HEIGHT,
    };
  }, [items, scrollTop]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="max-h-[360px] overflow-y-auto"
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item) => {
            const safeValue = item.value === "" ? "__empty__" : item.value;

            return (
              <MemoizedSelectItem
                key={safeValue}
                value={safeValue}
                icon={item.icon}
                image={item.image}
                hasIconSlot={hasIconSlot}
                disabled={item.disabled}
                isSelected={item.value === value}
              >
                {item.label}
              </MemoizedSelectItem>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 3. OPTIMIZED SELECT COMPONENT
// ============================================

export function Select({
  options,
  placeholder = "Select an option",
  clearLabel = "Clear selection",
  allowClear = true,
  isInvalid,
  label,
  error,
  size = "md",
  contentClassName,
  triggerClassName,
  showIcons = true,
  minimal = false,
  value = "",
  onValueChange,
  searchable = true,
  searchPlaceholder = "Search...",
  useVirtualization = true,
  isDisabled = false,
  ...props
}: SelectProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Flatten options once
  const flatOptions = useMemo(
    () => options?.flatMap((o) => ("options" in o ? o.options : o)),
    [options],
  );

  const selectedOption = useMemo(
    () => flatOptions?.find((o) => String(o.value) === String(value)),
    [flatOptions, value],
  );

  const hasAnyIcon = useMemo(
    () => showIcons && flatOptions?.some((o) => o.icon || o.image),
    [showIcons, flatOptions],
  );

  // const handleValueChange = (newValue) =>
  //   onValueChange?.(newValue === "__clear__" ? "" : newValue);
  const handleValueChange = (newValue: string) => {
    // Map internal tokens back to empty string for the form
    if (newValue === "__clear__" || newValue === "__empty__") {
      onValueChange?.("");
      return;
    }

    onValueChange?.(newValue);
  };

  // Optimized filtering with debouncing
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const lower = searchTerm.toLowerCase();

    return options
      .map((item) => {
        if ("options" in item) {
          const filteredGroup = item.options.filter((o) =>
            o.label.toLowerCase().includes(lower),
          );
          return filteredGroup.length > 0
            ? { ...item, options: filteredGroup }
            : null;
        }
        return item.label.toLowerCase().includes(lower) ? item : null;
      })
      .filter(Boolean) as (SelectOption | SelectGroupOption)[];
  }, [options, searchTerm]);

  const flatFilteredOptions = useMemo(
    () => filteredOptions?.flatMap((o) => ("options" in o ? o.options : o)),
    [filteredOptions],
  );

  return (
    <div>
      <SelectPrimitive.Root
        // value={value}
        value={value === "" ? "__empty__" : value}
        onValueChange={handleValueChange}
        {...props}
      >
        {label && (
          <label className="mb-1 block text-sm font-medium leading-none text-foreground">
            {label}
          </label>
        )}

        <SelectTrigger
          size={size}
          isInvalid={isInvalid}
          minimal={minimal}
          isDisabled={isDisabled}
          className={`w-full ${triggerClassName}`}
        >
          <SelectValue
            selectedOption={selectedOption}
            placeholder={placeholder}
            className={triggerClassName}
            showIcons={hasAnyIcon as boolean}
          />
        </SelectTrigger>

        <SelectContent className={contentClassName}>
          {searchable && (
            <div
              className="flex items-center gap-2 p-2 border-b border-border bg-popover text-popover-foreground sticky top-0 z-10"
              onKeyDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            >
              <Search className="size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}

          {allowClear && value !== (0 as unknown as string) && (
            <MemoizedSelectItem
              value="__clear__"
              icon={X}
              hasIconSlot={allowClear}
            >
              {clearLabel}
            </MemoizedSelectItem>
          )}

          {/* Use virtualization for large lists */}
          {useVirtualization && flatFilteredOptions?.length > 50 ? (
            <VirtualizedSelectItems
              items={flatFilteredOptions}
              hasIconSlot={hasAnyIcon as boolean}
              value={value}
            />
          ) : (
            filteredOptions?.map((groupOrOption, idx) => {
              if ("options" in groupOrOption) {
                return (
                  <React.Fragment key={groupOrOption.label}>
                    <SelectGroup>
                      <SelectLabel>{groupOrOption.label}</SelectLabel>

                      {groupOrOption.options.map((opt) => {
                        const safeValue =
                          opt.value === "" ? "__empty__" : opt.value;

                        return (
                          <MemoizedSelectItem
                            key={safeValue}
                            value={safeValue}
                            icon={opt.icon}
                            image={opt.image}
                            hasIconSlot={hasAnyIcon as boolean}
                            disabled={opt.disabled}
                          >
                            {opt.label}
                          </MemoizedSelectItem>
                        );
                      })}
                    </SelectGroup>

                    {idx < filteredOptions.length - 1 && <SelectSeparator />}
                  </React.Fragment>
                );
              }

              // SINGLE OPTION (not grouped)
              const safeValue =
                groupOrOption.value === "" ? "__empty__" : groupOrOption.value;

              return (
                <MemoizedSelectItem
                  key={safeValue}
                  value={safeValue}
                  icon={groupOrOption.icon}
                  image={groupOrOption.image}
                  hasIconSlot={hasAnyIcon as boolean}
                  disabled={groupOrOption.disabled}
                >
                  {groupOrOption.label}
                </MemoizedSelectItem>
              );
            })
          )}
        </SelectContent>
      </SelectPrimitive.Root>

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

// --- Trigger Button ---
function SelectTrigger({
  className,
  size,
  isInvalid,
  minimal,
  isDisabled,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        minimal
          ? "bg-transparent font-bold border-none shadow-none p-0 h-auto focus:ring-0 focus:outline-none"
          : selectVariants({ size }),
        "flex items-center justify-between gap-2",
        isInvalid && "border-destructive ring-destructive/20",
        isDisabled && "cursor-not-allowed opacity-50",
        className,
      )}
      aria-invalid={isInvalid}
      disabled={isDisabled}
      {...props}
    >
      <div className="flex-1 min-w-0 truncate">{children}</div>
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// --- Selected Value Display ---
function SelectValue({ selectedOption, placeholder, showIcons, className }: SelectValueProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {selectedOption ? (
        <>
          {showIcons &&
            selectedOption.image &&
            selectedOption.image !== "null" &&
            selectedOption.image !== "undefined" && (
              <Image
                src={selectedOption.image}
                alt={selectedOption.label || ""}
                width={20}
                height={20}
                className="rounded object-cover"
              />
            )}

          {showIcons && selectedOption.icon && !selectedOption.image && (
            <selectedOption.icon className="size-4 shrink-0" />
          )}
          <span className="truncate block">{selectedOption.label}</span>
        </>
      ) : (
        <span className={cn("text-muted-foreground truncate block", className)}>
          {placeholder}
        </span>
      )}
    </div>
  );
}

// --- Select Content Wrapper ---
function SelectContent({ className, children, position = "popper", ...props }: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        onKeyDown={(e) => {
          if ((e.target as HTMLElement).tagName === "INPUT") {
            e.stopPropagation();
          }
        }}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-hidden rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            // "p-1",
            position === "popper" &&
              "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// --- Individual Select Item ---
function SelectItem({
  className,
  children,
  icon: Icon,
  hasIconSlot = false,
  ...props
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {hasIconSlot && (
        <div className="size-4 shrink-0 flex items-center justify-center">
          {Icon ? <Icon className="size-4" /> : null}
        </div>
      )}
      <SelectPrimitive.ItemText className="truncate">
        {children}
      </SelectPrimitive.ItemText>
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

// --- Group ---
function SelectGroup(props: SelectGroupProps) {
  return <SelectPrimitive.Group {...props} />;
}

// --- Label ---
function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

// --- Separator ---
function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

// --- Scroll Buttons ---
function SelectScrollUpButton({ className, ...props }: SelectScrollButtonProps) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, ...props }: SelectScrollButtonProps) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}
