"use client";

import { flexRender, Table } from "@tanstack/react-table";

interface TableFooterProps {
  table: Table<any>;
}

const TableFooter = ({ table }: TableFooterProps) => {
  const hasFooters = table
    .getFooterGroups()
    .some((footerGroup) =>
      footerGroup.headers.some((footer) => footer.column.columnDef.footer),
    );
  const rowCount = table.getRowCount();

  if (!hasFooters || rowCount === 0) {
    return null;
  }

  return (
    <tfoot className="border-t-2 border-border bg-muted/30">
      {table.getFooterGroups().map((footerGroup) => (
        <tr key={footerGroup.id} className="">
          {footerGroup.headers.map((footer) => {
            const hasContent =
              !footer.isPlaceholder && footer.column.columnDef.footer;
            return (
              <td
                key={footer.id}
                colSpan={footer.colSpan}
                className="px-3 py-1 text-sm font-bold text-foreground"
                style={{ position: "relative", width: `${footer.getSize()}px` }}
              >
                {hasContent
                  ? flexRender(
                      footer.column.columnDef.footer,
                      footer.getContext(),
                    )
                  : null}
                <div
                  onMouseDown={(e) => footer.getResizeHandler()(e)}
                  onTouchStart={(e) => footer.getResizeHandler()(e)}
                  className={`resizer ${footer.column.getIsResizing() ? "isResizing" : ""}`}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </tfoot>
  );
};

export default TableFooter;
