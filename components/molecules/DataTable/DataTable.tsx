import React from "react"
import { cn } from "@/utils/cn"
import { DataTableProps } from "./interface"

export function DataTable<T extends { id?: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data found.",
  className,
  tableClassName,
  rowClassName,
  renderSubRow
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className={cn("w-full text-left border-collapse", tableClassName)}>
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((item, rowIdx) => (
                <React.Fragment key={item.id || rowIdx}>
                  <tr
                    className={cn(
                      "hover:bg-slate-50/50 transition-colors group",
                      onRowClick && "cursor-pointer",
                      typeof rowClassName === "function" ? rowClassName(item) : rowClassName
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column, colIdx) => (
                      <td key={colIdx} className={cn("px-6 py-4", column.className)}>
                        {column.render
                          ? column.render(item)
                          : column.accessor in item
                            ? (item[column.accessor as keyof T] as unknown as React.ReactNode)
                            : null}
                      </td>
                    ))}
                  </tr>
                  {renderSubRow && renderSubRow(item)}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
