"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TreeNode {
  id: string | number;
  name: string;
  children?: TreeNode[];
}

interface NestedSelectProps {
  data: TreeNode[];
  value: string;
  onChange: (value: string) => void;
}

export default function NestedSelect({ data, value, onChange }: NestedSelectProps) {
  const renderMenuItems = (nodes: TreeNode[]) =>
    nodes.map((node) => {
      const hasChildren = node.children?.length! > 0;

      if (hasChildren) {
        return (
          <DropdownMenuSub key={node.id}>
            <DropdownMenuSubTrigger>{node.name}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderMenuItems(node.children!)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      }

      return (
        <DropdownMenuItem
          key={node.id}
          onSelect={() => onChange(String(node.id))}
        >
          {node.name}
        </DropdownMenuItem>
      );
    });

  const selectedLabel = findLabelById(data, value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedLabel || "Select Category"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {renderMenuItems(data)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function findLabelById(data: TreeNode[], id: string): string | null {
  for (const node of data) {
    if (String(node.id) === id) return node.name;
    if (node.children?.length) {
      const label = findLabelById(node.children, id);
      if (label) return label;
    }
  }
  return null;
}
