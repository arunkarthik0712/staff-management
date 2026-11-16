import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ExportColumn } from "./exportUtils";

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

function parseFormattedNumber(val: any): number {
  if (val == null || val === "" || val === "—") return NaN;
  if (typeof val === "number") return val;
  const cleaned = String(val).replace(/,/g, "");
  return parseFloat(cleaned);
}

function fmtINR(n: number): string {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Groups rows by a given key field, then builds flat rows with subtotal rows
 * inserted after each group.
 *
 * Output row shape: same as input row, but subtotal rows have:
 *   - groupKeyField = "TOTAL"
 *   - numeric total columns summed
 *   - all other columns = ""
 *   - __isTotal = true  (used for styling in PDF)
 */
function buildGroupedData<TData>(
  rows: TData[],
  groupByKey: string,
  columns: ExportColumn[],
): {
  groupedRows: any[][];
  groupedBodies: { rows: any[][]; total: any[] }[];
} {
  // 1. Group rows by key
  const groups = new Map<string, TData[]>();
  for (const row of rows) {
    const key = String((row as any)[groupByKey] ?? "Unknown");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  const allFlatRows: any[][] = [];
  const groupedBodies: { rows: any[][]; total: any[] }[] = [];

  for (const [, groupRows] of groups) {
    const dataRows = groupRows.map((row) =>
      columns.map((col) => {
        const value = (row as any)[col.value];
        if (value instanceof Date) return value.toLocaleString();
        return value != null ? String(value) : "";
      }),
    );

    // Build subtotal row
    const totalRow = columns.map((col, idx) => {
      if (col.total) {
        const sum = groupRows.reduce((acc, row) => {
          const n = parseFormattedNumber((row as any)[col.value]);
          return acc + (isNaN(n) ? 0 : n);
        }, 0);
        return fmtINR(sum);
      }
      return idx === 0 ? "Total" : "";
    });

    allFlatRows.push(...dataRows, totalRow);
    groupedBodies.push({ rows: dataRows, total: totalRow });
  }

  // Grand total row
  const grandTotal = columns.map((col, idx) => {
    if (col.total) {
      const sum = rows.reduce((acc, row) => {
        const n = parseFormattedNumber((row as any)[col.value]);
        return acc + (isNaN(n) ? 0 : n);
      }, 0);
      return fmtINR(sum);
    }
    return idx === 0 ? "Grand Total" : "";
  });

  allFlatRows.push(grandTotal);
  groupedBodies.push({ rows: [], total: grandTotal });

  return { groupedRows: allFlatRows, groupedBodies };
}

/**
 * Export grouped data to CSV.
 * Rows are grouped by `groupByKey` with a "Party Total" row after each group
 * and a "Grand Total" row at the end.
 */
export async function exportGroupedToCSV<TData>(
  tag: string,
  rows: TData[],
  columns: ExportColumn[],
  groupByKey: string,
): Promise<void> {
  try {
    const headers = columns.map((col) => col.label || col.value || "");
    const { groupedRows } = buildGroupedData(rows, groupByKey, columns);

    const csvContent = [
      headers.join(","),
      ...groupedRows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", generateUniqueFilename(tag, "csv"));
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Grouped CSV export error:", error);
    throw new Error("Failed to export grouped CSV");
  }
}

/**
 * Export grouped data to Excel using ExcelJS.
 * Party total rows: bold + light grey background.
 * Grand total row: bold + light blue background.
 */
export async function exportGroupedToExcel<TData>(
  tag: string,
  rows: TData[],
  columns: ExportColumn[],
  groupByKey: string,
): Promise<void> {
  try {
    const headers = columns.map((col) => col.label || col.value || "");
    const { groupedBodies } = buildGroupedData(rows, groupByKey, columns);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Data");

    // Column widths
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

    const groups = groupedBodies.slice(0, -1);
    const grandTotalEntry = groupedBodies[groupedBodies.length - 1];

    // Data + party total rows
    for (const group of groups) {
      for (const r of group.rows) {
        ws.addRow(r);
      }
      // Party total row — grey
      const totalRow = ws.addRow(group.total);
      totalRow.font = { bold: true };
      totalRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
      totalRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFB0B0B0" } },
          bottom: { style: "thin", color: { argb: "FFB0B0B0" } },
        };
      });
    }

    // Grand total row — blue
    const grandRow = ws.addRow(grandTotalEntry.total);
    grandRow.font = { bold: true, color: { argb: "FF003366" } };
    grandRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD0E8FF" },
    };
    grandRow.eachCell((cell) => {
      cell.border = {
        top: { style: "medium", color: { argb: "FF4472C4" } },
        bottom: { style: "medium", color: { argb: "FF4472C4" } },
      };
    });

    // Download
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
    console.error("Grouped Excel export error:", error);
    throw new Error("Failed to export grouped Excel");
  }
}

/**
 * Export grouped data to PDF.
 * Each group's data rows are rendered, followed by a shaded "Party Total" row,
 * and finally a "Grand Total" row at the end.
 */
export async function exportGroupedToPDF<TData>(
  tag: string,
  rows: TData[],
  columns: ExportColumn[],
  groupByKey: string,
): Promise<void> {
  try {
    let orientation: "portrait" | "landscape" = "portrait";
    if (columns.length > 6) {
      const confirmed = window.confirm(
        `You have ${columns.length} columns. Switch to landscape orientation for a better fit?\n\nClick OK for landscape, Cancel to abort.`,
      );
      if (!confirmed) return;
      orientation = "landscape";
    }

    const headers = columns.map((col) => col.label || col.value || "");
    const { groupedBodies } = buildGroupedData(rows, groupByKey, columns);

    const doc = new jsPDF({ orientation });
    doc.setFontSize(16);
    doc.text(tag.replace(/-/g, " ").toUpperCase(), 14, 15);

    // Collect all body rows with styling metadata for autoTable
    const bodyRows: any[][] = [];
    const partyTotalRowIndices: number[] = [];
    const grandTotalRowIndex: number[] = [];

    const groups = groupedBodies.slice(0, -1);
    const grandTotalEntry = groupedBodies[groupedBodies.length - 1];

    for (const group of groups) {
      for (const r of group.rows) bodyRows.push(r);
      bodyRows.push(group.total);
      partyTotalRowIndices.push(bodyRows.length - 1);
    }

    bodyRows.push(grandTotalEntry.total);
    grandTotalRowIndex.push(bodyRows.length - 1);

    autoTable(doc, {
      head: [headers],
      body: bodyRows,
      startY: 25,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      didParseCell(data) {
        const { row, section } = data;
        if (section !== "body") return;

        if (grandTotalRowIndex.includes(row.index)) {
          data.cell.styles.fillColor = [208, 232, 255];
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.textColor = [0, 0, 0];
        } else if (partyTotalRowIndices.includes(row.index)) {
          data.cell.styles.fillColor = [230, 230, 230];
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.textColor = [0, 0, 0];
        }
      },
    });

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  } catch (error) {
    console.error("Grouped PDF export error:", error);
    throw new Error("Failed to export grouped PDF");
  }
}
