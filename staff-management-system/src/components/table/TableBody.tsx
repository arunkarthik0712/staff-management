import React from "react";
import { flexRender } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

interface SortableRowProps {
  row: any;
  children: React.ReactNode;
  draggable: any;
  enableDrag?: boolean;
}

function SortableRow({ row, children, draggable, enableDrag }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = enableDrag
    ? useSortable({ id: row.id })
    : { attributes: {}, listeners: {}, setNodeRef: null };

  const style = enableDrag
    ? {
        transform: transform
          ? `translate3d(0, ${transform.y}px, 0)`
          : undefined,
        transition,
        background: isDragging ? "rgba(0,0,0,0.04)" : undefined,
      }
    : {};

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-muted/50 transition-colors duration-150 ${
        isDragging ? "opacity-75" : ""
      }`}
    >
      {draggable && (
        <td
          {...attributes}
          {...listeners}
          className="px-2 w-10 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing text-center"
        >
          <GripVertical size={18} />
        </td>
      )}
      {children}
    </tr>
  );
}

interface TableBodyProps {
  table: any;
  draggable: any;
  enableDrag?: boolean;
  subRowsConfig?: any[];
}

const TableBody: React.FC<TableBodyProps> = ({
  table,
  draggable,
  enableDrag = false,
  subRowsConfig = [],
}) => {
  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={table.getAllLeafColumns().length + 1}
            className="py-10 text-center text-muted-foreground"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-lg font-medium">No Data Available</p>
              <p className="text-sm text-muted-foreground">
                No records found to display
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-border">
      {rows.map((row: any) => (
        <React.Fragment key={row.id}>
          <SortableRow row={row} draggable={draggable} enableDrag={enableDrag}>
            {row.getVisibleCells().map((cell: any) => (
              <td
                key={cell.id}
                className={`px-3 py-2 text-sm text-foreground ${
                  cell.column.columnDef?.meta?.tdClass ?? ""
                }`}
                style={{
                  cursor: cell.column.columnDef?.meta?.onClick
                    ? "pointer"
                    : "default",
                }}
                onClick={() => {
                  const onClick = cell.column.columnDef?.meta?.onClick;
                  if (onClick) onClick(cell.row);
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </SortableRow>
          {row.getIsExpanded() &&
            Array.isArray(row.original.subRows) &&
            row.original.subRows.length > 0 &&
            row.original.subRows.map((group: any, idx: number) => {
              const config = subRowsConfig.find((c: any) => c.type === group.type);
              if (!config) return null;

              const hasCustomRenderer =
                typeof config.rowRenderer === "function";

              return (
                <tr key={`${row.id}-sub-${idx}`} className="bg-muted/30">
                  <td
                    colSpan={
                      table.getAllLeafColumns().length + (draggable ? 1 : 0)
                    }
                    className="p-4"
                  >
                    <h3 className="text-primary font-semibold mb-2">
                      {config.title}
                    </h3>

                    <table className="w-full border border-border text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          {config.headers.map((h: any, i: number) => (
                            <th key={i} className="px-2 py-2 border text-left">
                              {typeof h === "object" ? h.value : h}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {group.data.map((subRow: any, sIndex: number) => {
                          if (hasCustomRenderer) {
                            const cells = config.rowRenderer(subRow, sIndex);

                            return (
                              <tr
                                key={sIndex}
                                className="even:bg-card odd:bg-muted/20"
                              >
                                {cells.map((cell: any, ci: number) => {
                                  let value = cell;
                                  let className = "";

                                  if (
                                    typeof cell === "object" &&
                                    cell !== null &&
                                    !React.isValidElement(cell)
                                  ) {
                                    value = cell.value;
                                    className = cell.className || "";
                                  }

                                  const renderable =
                                    React.isValidElement(value) ||
                                    typeof value === "string" ||
                                    typeof value === "number";

                                  return (
                                    <td
                                      key={ci}
                                      className={`px-2 py-2 border ${className}`}
                                    >
                                      {renderable ? value : "-"}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          }

                          return (
                            <tr
                              key={sIndex}
                              className="even:bg-card odd:bg-muted/20"
                            >
                              {config.headers.map((h: any, i: number) => {
                                const key = typeof h === "object" ? h.value : h;
                                return (
                                  <td key={i} className="px-2 py-1 border">
                                    {subRow[key] ?? "-"}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </td>
                </tr>
              );
            })}
        </React.Fragment>
      ))}
    </tbody>
  );
};

export default TableBody;
