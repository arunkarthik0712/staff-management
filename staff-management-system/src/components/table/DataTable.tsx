"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TablePagination from "./TablePagination";
import {
  FileSpreadsheet,
  FileBarChart2,
  FileText,
  Plus,
  X,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  LayoutList,
  RefreshCw,
  Download,
  EllipsisVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Separator,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useApiQuery, useApiMutation } from "@/hooks";
import { queryClient } from "@/lib/queryClient";
import { LoadingDataTable } from "../ui/loading";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LuChevronDown, LuChevronRight, LuX } from "react-icons/lu";
import TableFooter from "./TableFooter";

const DataTable = ({
  tag,
  fetchData,
  columnsConfig = [],
  addLink = null,
  editLink = null,
  addButtonText = "Add Item",
  AddComponent = null,
  onDelete = false,
  onCancel = false,
  EditComponent = null,
  ViewComponent = null,
  columns,
  setColumns,
  filters,
  title,
  expandable = false,
  showPagination = true,
  dontShowColumnSelect = false,
  onPDF = false,
  onCSV = false,
  onExcel = false,
  fieldPrint = false,
  draggable = null,
  selectableRows = false,
  subRowsConfig = [],
  rowSelectBtnTxt,
  rowSelectBtnIcon = null,
  RowSelectComponent = null,
  CustomActionComponent = false,
  CustomActionIcon = EllipsisVertical,
  CustomActionTitle = "Action",
  CustomActionText = "",
}: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [modalType, setModalType] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowIdToDelete, setRowIdToDelete] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rowSelectModalOpen, setRowSelectModalOpen] = useState(false);
  const [rowIdToCancel, setRowIdToCancel] = useState(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );
  const router = useRouter();

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const baseParams = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  };

  const finalParams = {
    ...baseParams,
    ...(filters &&
      Object.keys(filters).length > 0 && {
        filters: JSON.stringify(filters),
      }),
    ...(Array.isArray(sorting) &&
      sorting.length > 0 && {
        sorting: JSON.stringify(sorting),
      }),
  };

  const { data, error, isLoading, refetch } = useApiQuery({
    key: fetchData.key,
    endpoint: fetchData.url,
    method: fetchData.method,
    queryParams: finalParams,
  });

  const isRowSelected = (row: any) => {
    const key = JSON.stringify(row);
    return !!selectedItems[key];
  };

  const toggleRowSelected = (row: any, value?: any) => {
    const key = JSON.stringify(row);
    setSelectedItems((prev: any) => ({
      ...prev,
      [key]: value ?? !prev[key],
    }));
  };

  const getSelectedRows = () => {
    return Object.keys(selectedItems)
      .filter((k) => selectedItems[k])
      .map((k) => JSON.parse(k));
  };

  const clearSelection = () => setSelectedItems({});

  const toggleAllRowsSelected = (value: any) => {
    const newSelected: any = {};
    table.getRowModel().rows.forEach((r: any) => {
      const key = JSON.stringify(r.original);
      newSelected[key] = value;
    });
    setSelectedItems(newSelected);
  };

  const getIsAllRowsSelected = () => {
    const rows = table.getRowModel().rows;
    if (rows.length === 0) return false;
    return rows.every((r: any) => isRowSelected(r.original));
  };

  const getIsSomeRowsSelected = () => {
    const rows = table.getRowModel().rows;
    return (
      rows.some((r: any) => isRowSelected(r.original)) &&
      !getIsAllRowsSelected()
    );
  };

  const hasSelectedItems = Object.values(selectedItems).some(Boolean);

  const selectedRows = getSelectedRows();

  const handleRowSelectButtonClick = () => {
    setSelectedRowData(selectedRows);
    setRowSelectModalOpen(true);
  };

  const selectColumn = {
    id: "select",
    size: 40,
    minSize: 40,
    header: () => (
      <IndeterminateCheckbox
        checked={getIsAllRowsSelected()}
        indeterminate={getIsSomeRowsSelected()}
        onChange={() => toggleAllRowsSelected(!getIsAllRowsSelected())}
      />
    ),
    cell: ({ row }: any) => (
      <IndeterminateCheckbox
        checked={isRowSelected(row.original)}
        onChange={(e: any) => toggleRowSelected(row.original, e.target.checked)}
        onClick={(e: any) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableResizing: false,
  };

  const expanderColumn = {
    id: "expander",
    header: () => null,
    size: 25,
    minSize: 25,
    className: "table-expander",
    meta: {
      onClick: (row: any) => {
        row.getToggleExpandedHandler()();
      },
    },
    cell: ({ row }: any) => {
      const hasSub =
        Array.isArray(row.original.subRows) && row.original.subRows.length > 0;

      if (!hasSub) return null;

      return (
        <button className="text-muted-foreground hover:text-primary">
          {row.getIsExpanded() ? (
            <LuChevronDown size={18} />
          ) : (
            <LuChevronRight size={18} />
          )}
        </button>
      );
    },
  };

  const defaultColumn = {
    cell: ({ getValue }: any) => <span>{getValue()}</span>,
    enableSorting: false,
  };

  const handleDeleteClick = (id: any) => {
    setRowIdToDelete(id);
    setShowDeleteDialog(true);
  };

  const deleteMutation = useApiMutation({
    endpoint: onDelete?.url,
    method: onDelete?.method,
    onSuccess: (data: any) => {
      toast.success(data.message || "Deleted successfully");
      queryClient.invalidateQueries({ queryKey: [fetchData.key] });
      setShowDeleteDialog(false);
      setRowIdToDelete(null);
    },
    onError: (err: any) => {
      console.error("Delete failed:", err);
      toast.error(err?.message || "Delete failed");
    },
  });

  const confirmDelete = () => {
    if (!rowIdToDelete) return;
    deleteMutation.mutate({ id: rowIdToDelete });
  };

  const handleCancelClick = (id: any) => {
    setRowIdToCancel(id);
    setShowCancelDialog(true);
  };

  const cancelMutation = useApiMutation({
    endpoint: onCancel?.url,
    method: onCancel?.method,
    onSuccess: (data: any) => {
      toast.success(data.message || "Cancelled successfully");
      queryClient.invalidateQueries({ queryKey: [fetchData.key] });
      setShowCancelDialog(false);
      setRowIdToCancel(null);
    },
    onError: (err: any) => {
      console.error("Cancel failed:", err);
      toast.error(err?.response?.data?.message || "Cancel failed");
    },
  });

  const confirmCancel = () => {
    if (!rowIdToCancel) return;
    cancelMutation.mutate({ id: rowIdToCancel });
  };

  const handlePDFClick = () => {
    const visibleColumns = columns.filter((col: any) => col.visible);
    onPDF(tag, data.rows, visibleColumns);
  };

  const handleCSVClick = () => {
    const visibleColumns = columns.filter((col: any) => col.visible);
    onCSV(tag, data.rows, visibleColumns);
  };

  const handleExcelClick = () => {
    const visibleColumns = columns.filter((col: any) => col.visible);
    onExcel(tag, data.rows, visibleColumns);
  };

  const handleEditClick = (row: any) => {
    if (typeof editLink === "function") {
      router.push(editLink(row.original));
      return;
    }
    setSelectedRowData(row.original);
    setModalType("edit");
    setModalOpen(true);
  };

  const handleCustomActionClick = (row: any) => {
    setSelectedRowData(row.original);
    setModalType("custom");
    setModalOpen(true);
  };

  const handleViewClick = (row: any) => {
    setSelectedRowData(row.original);
    setModalType("view");
    setModalOpen(true);
  };

  const handleAddClick = () => {
    if (addLink) {
      router.push(addLink);
      return;
    }
    setSelectedRowData(null);
    setModalType("add");
    setModalOpen(true);
  };

  let actionsColumn = null;
  if (
    onDelete ||
    EditComponent ||
    ViewComponent ||
    onCancel ||
    CustomActionComponent
  ) {
    actionsColumn = {
      header: "Actions",
      id: "actions",
      meta: { tdClass: "text-center", thClass: "text-center" },
      cell: ({ row }: any) => (
        <div className="flex justify-start items-start cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <MoreVertical size={18} color="var(--color-primary)" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {ViewComponent && (
                <DropdownMenuItem
                  onClick={() => handleViewClick(row)}
                  className="flex items-center gap-2 text-blue-500! hover:bg-blue-100 focus:bg-blue-100"
                >
                  <Eye size={16} className="text-blue-500!" />
                  <span>View Details</span>
                </DropdownMenuItem>
              )}
              {(EditComponent || editLink) && (
                <DropdownMenuItem
                  onClick={() => handleEditClick(row)}
                  className="flex items-center gap-2 text-yellow-500! hover:bg-yellow-100 focus:bg-yellow-100"
                >
                  <Pencil size={16} className="text-yellow-500!" />
                  <span>Edit Item</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      handleDeleteClick(row.original.id || row.original._id);
                    }}
                    className="flex items-center gap-2 text-red-600! hover:bg-red-100 focus:bg-red-100"
                  >
                    <Trash2 size={16} className="text-red-600!" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </>
              )}
              {fieldPrint && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      fieldPrint(row.original);
                    }}
                    className="flex items-center gap-2 text-violet-600! hover:bg-violet-100 focus:bg-violet-100"
                  >
                    <Download size={16} className="text-violet-600!" />
                    <span>Print</span>
                  </DropdownMenuItem>
                </>
              )}
              {onCancel && (
                <DropdownMenuItem
                  onClick={() =>
                    handleCancelClick(row.original.id || row.original._id)
                  }
                  className="flex items-center gap-2 text-orange-600! hover:bg-orange-100 focus:bg-orange-100"
                >
                  <X size={16} className="text-orange-600!" />
                  <span>Cancel</span>
                </DropdownMenuItem>
              )}
              {CustomActionComponent && (
                <DropdownMenuItem
                  onClick={() => handleCustomActionClick(row)}
                  className="flex items-center gap-2 text-blue-600! hover:bg-blue-100 focus:bg-blue-100"
                >
                  <CustomActionIcon size={16} className="text-blue-600!" />
                  <span>{CustomActionTitle}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    };
  }

  const normalizeColumns = (columnsArray: any = []) => {
    return columnsArray.map((col: any) => ({
      ...col,
      meta: {
        ...(col.meta || {}),
        thClass: col.headerClassName || "",
        tdClass: col.cellClassName || col.className || "",
      },
    }));
  };

  const mappedColumnsConfig = columnsConfig.map((group: any) => ({
    ...group,
    columns: normalizeColumns(group.columns),
  }));

  const finalColumnsConfig: any[] = [];

  if (selectableRows) {
    finalColumnsConfig.push(selectColumn);
  }

  if (expandable) {
    finalColumnsConfig.push(expanderColumn);
  }

  finalColumnsConfig.push(...mappedColumnsConfig);

  if (actionsColumn) {
    finalColumnsConfig.push({
      header: "Actions",
      columns: [actionsColumn],
    });
  }

  const table = useReactTable({
    data: data ? data.rows : [],
    columns: finalColumnsConfig,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: data ? data.rowCount : 0,
    onPaginationChange: setPagination as any,
    onSortingChange: setSorting as any,
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    enableSorting: true,
    columnResizeMode: "onChange",
    manualExpanding: true,
    onExpandedChange: setExpanded as any,
    enableRowSelection: selectableRows,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => (Array.isArray(row.subRows) ? row.subRows : []),
    state: {
      expanded,
      pagination,
      sorting,
      columnVisibility: columns.reduce((acc: any, col: any) => {
        acc[col.value] = col.visible;
        return acc;
      }, {}),
    },
    defaultColumn,
  });

  const handleCheckboxChange = (e: any, colValue: any) => {
    const newColumns = columns.map((col: any) =>
      col.value === colValue ? { ...col, visible: e.target.checked } : col,
    );
    setColumns(newColumns);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!draggable || !over || active.id === over.id) return;

    const rows = table.getRowModel().rows;
    const oldIndex = rows.findIndex((r: any) => r.id === active.id);
    const newIndex = rows.findIndex((r: any) => r.id === over.id);
    const reordered = arrayMove(rows, oldIndex, newIndex).map(
      (r: any, i: number) => ({
        id: r.original.id,
        [draggable[0]]: i + 1,
      }),
    );

    const reorderApi = draggable[1];
    if (reorderApi) {
      reorderMutation.mutate({ order: reordered });
    }
  };

  const reorderApi = Array.isArray(draggable) ? draggable[1] : null;
  const reorderMutation = useApiMutation({
    endpoint: reorderApi?.url,
    method: reorderApi?.method,
    onSuccess: (data: any) => {
      toast.success(data.message || "Order updated successfully!");
      queryClient.invalidateQueries({ queryKey: [fetchData.key] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update order");
    },
  });

  if (isLoading) {
    return <LoadingDataTable />;
  }

  if (error) {
    return (
      <div className="w-full bg-card rounded-lg shadow-md overflow-hidden">
        <div
          className="px-6 py-4 bg-primary/10 flex flex-col md:flex-row md:justify-between md:items-center
        gap-4 border border-primary/25 rounded-t-lg"
        >
          <h2 className="text-xl font-semibold text-primary">
            Manage {title}
            {data && data.rowCount > 0 && (
              <Badge className="ml-3 bg-primary/20 text-primary font-semibold">
                {data.rowCount} items
              </Badge>
            )}
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {hasSelectedItems && rowSelectBtnTxt && RowSelectComponent && (
                <button
                  onClick={handleRowSelectButtonClick}
                  className="px-2 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition duration-300 ease-in-out flex items-center gap-1.5 text-sm font-medium"
                >
                  {rowSelectBtnIcon} {rowSelectBtnTxt}
                </button>
              )}
              {hasSelectedItems && (
                <button
                  onClick={clearSelection}
                  className="px-2 py-2 flex items-center gap-2 justify-center bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <LuX size={16} />
                </button>
              )}
            </div>
            {!dontShowColumnSelect && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 border border-primary text-primary rounded-md
                  flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition duration-300 ease-in-out  cursor-pointer"
                  >
                    <LayoutList size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 max-h-64 overflow-y-auto bg-primary/10 rounded-md shadow-lg backdrop-blur-lg"
                >
                  {columns.map((col: any) => (
                    <div key={col.value} className="px-2 py-1.5 ">
                      <label className="flex items-center space-x-2 text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={(e: any) =>
                            handleCheckboxChange(e, col.value)
                          }
                          className="rounded accent-primary focus:ring-primary"
                        />
                        <span className="text-primary">{col.label}</span>
                      </label>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1.5 border border-primary text-primary rounded-md
              flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition duration-300 ease-in-out
              cursor-pointer"
                    onClick={() => refetch()}
                  >
                    <RefreshCw size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Refetch</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {(onPDF || onCSV || onExcel) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 border border-primary text-primary rounded-md
                  flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition duration-300 ease-in-out  cursor-pointer"
                    title="Export"
                  >
                    <Download size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 p-2 bg-primary/10 rounded-md shadow-lg backdrop-blur-lg"
                >
                  {onPDF && (
                    <DropdownMenuItem
                      onClick={handlePDFClick}
                      className="flex items-center gap-2 text-primary cursor-pointer hover:bg-primary/20"
                    >
                      <FileText size={16} className="text-primary" />
                      <span>Export as PDF</span>
                    </DropdownMenuItem>
                  )}
                  {onCSV && (
                    <DropdownMenuItem
                      onClick={handleCSVClick}
                      className="flex items-center gap-2 text-primary cursor-pointer hover:bg-primary/20"
                    >
                      <FileBarChart2 size={16} className="text-primary" />
                      <span>Export as CSV</span>
                    </DropdownMenuItem>
                  )}
                  {onExcel && (
                    <DropdownMenuItem
                      onClick={handleExcelClick}
                      className="flex items-center gap-2 text-primary cursor-pointer hover:bg-primary/20"
                    >
                      <FileSpreadsheet size={16} className="text-primary" />
                      <span>Export as Excel</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {addButtonText && (AddComponent || addLink) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="px-2 py-2 bg-primary text-primary-foreground cursor-pointer rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={handleAddClick}
                    >
                      <Plus size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{addButtonText}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-red-100 text-red-600 rounded-full mb-4">
            <X size={24} />
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error Loading Data
          </h3>
          <p className="text-muted-foreground max-w-md">
            There was a problem fetching the requested data. Please try again or
            contact support.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: [fetchData.key] })
            }
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg shadow-md border border-primary/10 overflow-hidden">
        <div
          className="px-6 py-4 bg-primary/10 flex flex-col md:flex-row md:justify-between md:items-center
        gap-4 border border-primary/25 rounded-t-lg"
        >
          <h2 className="text-xl font-semibold text-primary">
            Manage {title}
            {data && data.rowCount > 0 && (
              <Badge className="ml-3 bg-primary/20 text-primary font-semibold">
                {data.rowCount} items
              </Badge>
            )}
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {hasSelectedItems && rowSelectBtnTxt && RowSelectComponent && (
                <button
                  onClick={handleRowSelectButtonClick}
                  className="px-2 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition duration-300 ease-in-out flex items-center gap-1.5 text-sm font-medium"
                >
                  {rowSelectBtnIcon} {rowSelectBtnTxt}
                </button>
              )}
              {hasSelectedItems && (
                <button
                  onClick={clearSelection}
                  className="px-2 py-2 flex items-center gap-2 justify-center bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <LuX size={16} />
                </button>
              )}
            </div>
            {!dontShowColumnSelect && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 border border-primary text-primary rounded-md
                  flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition duration-300 ease-in-out  cursor-pointer"
                  >
                    <LayoutList size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 max-h-64 overflow-y-auto bg-primary/10 rounded-md shadow-lg backdrop-blur-lg"
                >
                  {columns.map((col: any) => (
                    <div key={col.value} className="px-2 py-1.5 ">
                      <label className="flex items-center space-x-2 text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={(e: any) =>
                            handleCheckboxChange(e, col.value)
                          }
                          className="rounded accent-primary focus:ring-primary"
                        />
                        <span className="text-primary">{col.label}</span>
                      </label>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1.5 border border-primary text-primary rounded-md
              flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition duration-300 ease-in-out
              cursor-pointer"
                    onClick={() => refetch()}
                  >
                    <RefreshCw size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Refetch</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {(onPDF || onCSV || onExcel) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 border border-primary text-primary rounded-md
                  flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition duration-300 ease-in-out  cursor-pointer"
                    title="Export"
                  >
                    <Download size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 p-2 bg-primary/10 rounded-md shadow-lg backdrop-blur-lg"
                >
                  {onPDF && (
                    <DropdownMenuItem
                      onClick={handlePDFClick}
                      className="flex items-center gap-2 text-primary cursor-pointer hover:bg-primary/20"
                    >
                      <FileText size={16} className="text-primary" />
                      <span>Export as PDF</span>
                    </DropdownMenuItem>
                  )}
                  {onCSV && (
                    <DropdownMenuItem
                      onClick={handleCSVClick}
                      className="flex items-center gap-2 text-primary cursor-pointer hover:bg-primary/20"
                    >
                      <FileBarChart2 size={16} className="text-primary" />
                      <span>Export as CSV</span>
                    </DropdownMenuItem>
                  )}
                  {onExcel && (
                    <DropdownMenuItem
                      onClick={handleExcelClick}
                      className="flex items-center gap-2 text-primary cursor-pointer hover:bg-primary/20"
                    >
                      <FileSpreadsheet size={16} className="text-primary" />
                      <span>Export as Excel</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {addButtonText && (AddComponent || addLink) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="px-2 py-2 bg-primary text-primary-foreground cursor-pointer rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={handleAddClick}
                    >
                      <Plus size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{addButtonText}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {draggable ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={table.getRowModel().rows.map((r: any) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                <table className="w-full border-collapse">
                  <TableHeader table={table} draggable={draggable} />
                  <TableBody table={table} draggable={draggable} enableDrag />
                  <TableFooter table={table} />
                </table>
              </SortableContext>
            </DndContext>
          ) : (
            <table className="w-full border-collapse">
              <TableHeader table={table} draggable={draggable} />
              <TableBody
                table={table}
                draggable={draggable}
                subRowsConfig={subRowsConfig}
              />
              <TableFooter table={table} />
            </table>
          )}
        </div>

        <div className="px-6 border-t border-border">
          <TablePagination table={table} showPagination={showPagination} />
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="w-full max-w-4xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] overflow-y-auto p-4"
          showCloseButton={false}
        >
          <DialogHeader className={"text-primary bg-primary/10 p-4 rounded"}>
            <DialogTitle>
              {modalType === "edit"
                ? "Edit Item"
                : modalType === "view"
                  ? "View Details"
                  : modalType === "custom"
                    ? `${CustomActionTitle}`
                    : `Add New ${title}`}
            </DialogTitle>
            <DialogDescription className={"sr-only"}>
              {modalType === "edit"
                ? "Edit the item details."
                : modalType === "view"
                  ? "View the item details."
                  : "Add a new item."}
            </DialogDescription>
          </DialogHeader>
          <div className="">
            {modalType === "edit" && EditComponent && (
              <EditComponent
                type="edit"
                editData={selectedRowData}
                onClose={() => setModalOpen(false)}
              />
            )}
            {modalType === "view" && ViewComponent && (
              <ViewComponent
                type="view"
                viewData={selectedRowData}
                onClose={() => setModalOpen(false)}
              />
            )}
            {modalType === "add" && AddComponent && (
              <AddComponent type="add" onClose={() => setModalOpen(false)} />
            )}
            {modalType === "custom" && CustomActionComponent && (
              <CustomActionComponent
                type="custom"
                customData={selectedRowData}
                onClose={() => setModalOpen(false)}
              />
            )}
          </div>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/80">
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/80">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to cancel this item? This action cannot be
            undone.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/80">
                Close
              </button>
            </DialogClose>
            <button
              onClick={confirmCancel}
              className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white"
            >
              Cancel Item
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rowSelectModalOpen} onOpenChange={setRowSelectModalOpen}>
        <DialogContent className="w-full max-w-4xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] overflow-y-auto p-4">
          <DialogHeader className={"text-primary bg-primary/10 p-4 rounded"}>
            <DialogTitle>{rowSelectBtnTxt || "Selection"}</DialogTitle>
            <DialogDescription className={"sr-only"}>
              {rowSelectBtnTxt || "Selection"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RowSelectComponent
              selectedRows={selectedRowData}
              onClose={() => setRowSelectModalOpen(false)}
            />
          </div>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/80">
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: any) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      (ref.current as any).indeterminate = indeterminate && !rest.checked;
    }
  }, [indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={"cursor-pointer " + className}
      {...rest}
    />
  );
}

export { DataTable };
