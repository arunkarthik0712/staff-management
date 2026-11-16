import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingFormProps {
  count?: number;
  columns?: number;
  className?: string;
}

export function LoadingForm({ count = 2, columns = 3, className = "" }: LoadingFormProps) {
  return (
    <div
      className={`grid gap-4 grid-cols-1 sm:grid-cols-${columns} ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

interface LoadingDataTableProps {
  rows?: number;
  className?: string;
}

export function LoadingDataTable({ rows = 3, className = "" }: LoadingDataTableProps) {
  return (
    <div
      className={[
        "rounded-lg border bg-white shadow-sm dark:bg-neutral-950 dark:border-neutral-800",
        className,
      ].join(" ")}
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-44" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      <div className="w-full overflow-x-auto ">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b text-left dark:border-neutral-800">
              <th className="px-4 py-3">
                <Skeleton className="h-3 w-24" />
              </th>
              <th className="px-4 py-3">
                <Skeleton className="h-3 w-24" />
              </th>
              <th className="px-4 py-3 max-sm:hidden">
                <Skeleton className="h-3 w-20" />
              </th>
              <th className="w-16 px-4 py-3 text-right">
                <Skeleton className="ml-auto h-3 w-12" /> {/* Actions */}
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr
                key={i}
                className="border-b last:border-0 dark:border-neutral-900"
              >
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>

                <td className="px-4 py-4 max-sm:hidden">
                  <Skeleton className="h-4 w-24" />
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-2.5 w-2.5 rounded-full" />
                    <Skeleton className="h-2.5 w-2.5 rounded-full" />
                    <Skeleton className="h-2.5 w-2.5 rounded-full" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between gap-2 border-t p-3 dark:border-neutral-800">
        {/* Left: rows per page */}
        <div className="flex items-center gap-2">
          {/* Label hidden on the smallest screens to save space */}
          <div className="hidden xs:block">
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>

        {/* Right: pager — condense on mobile */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" /> {/* First */}
          <Skeleton className="h-8 w-8 rounded-md" /> {/* Prev */}
          <div className="hidden sm:block">
            <Skeleton className="h-8 w-12 rounded-md" /> {/* 1 of 1 */}
          </div>
          <Skeleton className="h-8 w-8 rounded-md" /> {/* Next */}
          <Skeleton className="h-8 w-8 rounded-md" /> {/* Last */}
        </div>
      </div>
    </div>
  );
}

// export const LoadingDashboard = () => (
//   <div className="p-3 space-y-6 animate-in fade-in-50">
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//       {Array.from({ length: 4 }).map((_, i) => (
//         <div
//           key={i}
//           className="bg-primary rounded-2xl p-px shadow-sm animate-pulse"
//         >
//           <div className="flex justify-between items-center p-2">
//             <Skeleton className="w-10 h-10 rounded-full bg-gray-300/80" />
//             <Skeleton className="w-10 h-10 rounded-full bg-gray-300/80" />
//           </div>
//           <div className="bg-white rounded-2xl p-3 flex flex-col items-center space-y-2">
//             <Skeleton className="h-4 w-20 bg-gray-300/70" />
//             <Skeleton className="h-3 w-24 bg-gray-200/70" />
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

interface LoadingDashboardProps {
  count?: number;
}

export const LoadingDashboard = ({ count = 4 }: LoadingDashboardProps) => {
  return (
    <div className="p-3 space-y-6 animate-in fade-in-50">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="group block border border-primary rounded-2xl p-px overflow-hidden animate-pulse"
          >
            <div className="flex justify-between items-center p-2">
              {/* Icon Skeleton */}
              <Skeleton className="w-10 h-10 rounded-full bg-gray-300/80" />

              {/* Title Skeleton */}
              <div className="bg-white rounded-2xl p-2 flex flex-col items-center">
                <Skeleton className="h-4 w-20 bg-gray-300/70" />
              </div>

              {/* Count Badge Skeleton */}
              <Skeleton className="w-8 h-8 rounded-full bg-gray-300/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
