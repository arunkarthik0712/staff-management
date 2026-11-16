"use client";

import { useMemo, useState } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { printHTMLContent } from "@/lib/printUtility";
import { users } from "@/actions";
import { Badge } from "@/components/ui";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

function SelectedRowsPanel({ selectedRows }: { selectedRows: UserRow[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Selected rows: {selectedRows.length}
      </p>
      <ul className="list-disc pl-5 text-sm">
        {selectedRows.map((row) => (
          <li key={row.id}>{row.name}</li>
        ))}
      </ul>
    </div>
  );
}

function RowCustomAction({ customData }: { customData: UserRow | null }) {
  if (!customData) return null;
  return (
    <div className="space-y-2 text-sm">
      <p className="font-semibold">Custom row action</p>
      <p>
        {customData.name} - {customData.email}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [columns, setColumns] = useState([
    { label: "Name", value: "name", visible: true },
    { label: "Email", value: "email", visible: true },
    { label: "Role", value: "role", visible: true },
    { label: "Status", value: "status", visible: true },
    { label: "Created", value: "createdAt", visible: true },
  ]);

  const columnHelper = createColumnHelper<any>();

  const COLUMNS_CONFIG = [
    {
      header: "  Details",
      columns: [
        columnHelper.accessor("name", {
          header: "Name",
          cell: (info: any) => (
            <div className="font-semibold text-primary">{info.getValue()}</div>
          ),
        }),
        columnHelper.accessor("email", {
          header: "Email",
          cell: (info: any) => {
            const email = info.getValue();
            return email ? email : "-";
          },
        }),
        columnHelper.accessor("role", {
          header: "Role",
          cell: (info: any) => {
            const role = info.getValue();
            return <Badge variant="default">{role}</Badge>;
          },
        }),
        columnHelper.accessor("status", {
          header: "Status",
          cell: (info: any) => {
            const status = info.getValue();
            return (
              <Badge
                variant={status === "cancelled" ? "destructive" : "default"}
              >
                {status}
              </Badge>
            );
          },
        }),
        columnHelper.accessor("createdAt", {
          header: "Created",
          cell: (info: any) => {
            const date = info.getValue();
            return date ? new Date(date).toLocaleDateString("en-IN") : "-";
          },
        }),
      ],
    },
  ];

  return (
    <main className="p-6">
      <DataTable
        tag="users"
        title="Users"
        fetchData={users.getPaginated}
        columnsConfig={COLUMNS_CONFIG}
        columns={columns}
        setColumns={setColumns}
        selectableRows
        rowSelectBtnTxt="Bulk Action"
        RowSelectComponent={SelectedRowsPanel}
        fieldPrint={(row: any) =>
          printHTMLContent(`
            <html>
              <body style="font-family: Arial; padding:16px">
                <h2>User Preview</h2>
                <p><strong>Name:</strong> ${row.name}</p>
                <p><strong>Email:</strong> ${row.email}</p>
                <p><strong>Role:</strong> ${row.role}</p>
              </body>
            </html>
          `)
        }
        CustomActionComponent={RowCustomAction}
        CustomActionTitle="Row Action"
      />
    </main>
  );
}
