import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportColumn {
  label: string;
  value: string;
  visible?: boolean;
  total?: boolean;
}

function generateUniqueFilename(tag: string, ext: string) {
  const now = new Date();
  const formatted = now
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");

  const random = Math.floor(Math.random() * 1000);

  return `${tag}-${formatted}-${random}.${ext}`;
}

/**
 * Parse a formatted number string like "1,23,456.78" back to a number.
 * Returns NaN if unparseable.
 */
function parseFormattedNumber(val: any): number {
  if (val == null || val === "" || val === "—") return NaN;
  if (typeof val === "number") return val;
  const cleaned = String(val).replace(/,/g, "");
  return parseFloat(cleaned);
}

/**
 * Build a totals row for columns that have total:true.
 * Returns null if no column has total:true.
 */
function buildTotalsRow<TData>(
  rows: TData[],
  visibleColumns: ExportColumn[],
): string[] | null {
  const hasTotalCol = visibleColumns.some((col) => col.total);
  if (!hasTotalCol) return null;

  return visibleColumns.map((col, idx) => {
    if (col.total) {
      const sum = rows.reduce((acc, row) => {
        const n = parseFormattedNumber((row as any)[col.value]);
        return acc + (isNaN(n) ? 0 : n);
      }, 0);
      return sum.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    // Label the totals row in the first column
    return idx === 0 ? "TOTAL" : "";
  });
}

/**
 * Export table data to CSV format
 */
export async function exportToCSV<TData>(
  tag: string,
  rows: TData[],
  visibleColumns: ExportColumn[],
): Promise<void> {
  try {
    const headers = visibleColumns.map((col) => col.label || col.value || "");

    const data = rows.map((row) =>
      visibleColumns.map((col) => {
        const value = (row as any)[col.value];
        if (value instanceof Date) return value.toLocaleString();
        return value != null ? String(value) : "";
      }),
    );

    const totalsRow = buildTotalsRow(rows, visibleColumns);

    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
      ...(totalsRow
        ? [totalsRow.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")]
        : []),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const filename = generateUniqueFilename(tag, "csv");

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV export error:", error);
    throw new Error("Failed to export CSV");
  }
}

/**
 * Export table data to Excel format
 */
export async function exportToExcel<TData>(
  tag: string,
  rows: TData[],
  visibleColumns: ExportColumn[],
): Promise<void> {
  try {
    const headers = visibleColumns.map((col) => col.label || col.value || "");

    const data = rows.map((row) =>
      visibleColumns.map((col) => {
        const value = (row as any)[col.value];
        if (value instanceof Date) return value.toLocaleString();
        return value != null ? value : "";
      }),
    );

    const totalsRow = buildTotalsRow(rows, visibleColumns);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Data");

    ws.columns = headers.map((h) => ({ header: h, width: 22 }));

    // Header row styling
    const headerRow = ws.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF424242" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Data rows
    for (const row of data) {
      ws.addRow(row);
    }

    // Totals row
    if (totalsRow) {
      const tRow = ws.addRow(totalsRow);
      tRow.font = { bold: true };
      tRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD0E8FF" },
      };
      tRow.eachCell((cell) => {
        cell.border = {
          top: { style: "medium", color: { argb: "FF4472C4" } },
          bottom: { style: "medium", color: { argb: "FF4472C4" } },
        };
      });
    }

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = generateUniqueFilename(tag, "xlsx");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Excel export error:", error);
    throw new Error("Failed to export Excel");
  }
}

/**
 * Export table data to PDF format.
 * If visible columns > 6, asks user to confirm landscape orientation before proceeding.
 */
export async function exportToPDF<TData>(
  tag: string,
  rows: TData[],
  visibleColumns: ExportColumn[],
): Promise<void> {
  try {
    let orientation: "portrait" | "landscape" = "portrait";

    if (visibleColumns.length > 6) {
      const confirmed = window.confirm(
        `You have ${visibleColumns.length} columns selected. Switch to landscape orientation for a better fit?\n\nClick OK to export in landscape, or Cancel to abort.`,
      );
      if (!confirmed) return;
      orientation = "landscape";
    }

    const headers = visibleColumns.map((col) => col.label || col.value || "");

    const data = rows.map((row) =>
      visibleColumns.map((col) => {
        const value = (row as any)[col.value];
        if (value instanceof Date) return value.toLocaleString();
        return value != null ? String(value) : "";
      }),
    );

    const totalsRow = buildTotalsRow(rows, visibleColumns);

    const doc = new jsPDF({ orientation });

    doc.setFontSize(16);
    doc.text(tag.replace(/-/g, " ").toUpperCase(), 14, 15);

    autoTable(doc, {
      head: [headers],
      body: data,
      foot: totalsRow ? [totalsRow] : undefined,
      showFoot: totalsRow ? "everyPage" : "never",
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("Failed to export PDF");
  }
}
