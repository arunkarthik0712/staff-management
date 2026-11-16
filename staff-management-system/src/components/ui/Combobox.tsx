"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ComboboxItem {
  [key: string]: string | number;
}

interface ComboboxProps {
  items?: ComboboxItem[];
  value?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  displayKey?: string;
  valueKey?: string;
  showNoneOption?: boolean;
}

export default function Combobox({
  items = [],
  value,
  onChange,
  placeholder = "Select option",
  displayKey = "label",
  valueKey = "value",
  showNoneOption = true,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedItem = items.find((item) => String(item[valueKey]) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedItem ? selectedItem[displayKey] : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {showNoneOption && (
                <CommandItem
                  value=""
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  None
                  {!value && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              )}
              {items.map((item) => (
                <CommandItem
                  key={item[valueKey]}
                  value={(item[displayKey] + "")?.toLowerCase()}
                  onSelect={() => {
                    onChange(item[valueKey] as string);
                    setOpen(false);
                  }}
                >
                  {item[displayKey]}
                  {String(value) === String(item[valueKey]) && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
