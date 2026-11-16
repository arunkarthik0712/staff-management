import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface TablePaginationProps {
  table: any;
  showPagination?: boolean;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  table,
  showPagination = true,
}) => {
  const pageCount = table.getPageCount() || 1;
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div
      className={
        showPagination
          ? "flex flex-col sm:flex-row justify-between items-center py-4 px-2"
          : "hidden"
      }
    >
      <div className="flex items-center space-x-3 mb-3 sm:mb-0">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <select
          value={
            table.getState().pagination.pageSize === table.getRowCount()
              ? "All"
              : table.getState().pagination.pageSize
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value === "All") {
              table.setPageSize(table.getRowCount());
            } else {
              table.setPageSize(Number(value));
            }
          }}
          className="px-2 py-1 border border-border rounded text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {[5, 10, 20, 30, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
          {table.getRowCount() > 10 && <option value="All">All</option>}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className="p-1.5 rounded-md bg-background border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          className="p-1.5 rounded-md bg-background border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center">
          <span className="text-sm px-3 py-1 bg-background border border-border rounded-md min-w-[90px] text-center font-medium text-foreground">
            {currentPage} of {pageCount}
          </span>
        </div>

        <button
          className="p-1.5 rounded-md bg-background border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={16} />
        </button>
        <button
          className="p-1.5 rounded-md bg-background border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
