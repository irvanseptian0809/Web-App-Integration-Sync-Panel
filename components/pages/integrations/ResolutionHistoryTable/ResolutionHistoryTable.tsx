import { ChevronLeft, ChevronRight, History } from "lucide-react"
import React, { useState } from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { TypographyH3, TypographyMuted } from "@/components/atoms/Typography"
import { ResolutionHistoryEntry } from "@/interface/types"
import { Column, DataTable } from "@/components/molecules/DataTable"

import { ResolutionHistoryTableProps } from "./interfaces"

const PAGE_SIZE_DEFAULT = 5

export function ResolutionHistoryTable({
  entries,
  pageSize = PAGE_SIZE_DEFAULT,
}: ResolutionHistoryTableProps) {
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const visibleEntries = entries.slice(start, start + pageSize)

  const toggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  const columns: Column<ResolutionHistoryEntry>[] = [
    {
      header: "Resolved At",
      accessor: "resolvedAt",
      render: (entry) => (
        <span className="text-slate-700">
          {new Date(entry.resolvedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      ),
    },
    {
      header: "Previous Version",
      accessor: "previousVersion",
      render: (entry) => <Badge variant="outline">v{entry.previousVersion}</Badge>,
    },
    {
      header: "Resolved Version",
      accessor: "resolvedVersion",
      render: (entry) => <Badge variant="success">v{entry.resolvedVersion}</Badge>,
    },
    {
      header: "Fields Changed",
      accessor: "fields",
      render: (entry) => (
        <span className="text-slate-700">
          {entry.fields.length} field{entry.fields.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      header: "Details",
      accessor: "details",
      headerClassName: "text-right",
      className: "text-right",
      render: (entry) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation()
            toggleExpand(entry.id)
          }}
        >
          {expandedId === entry.id ? "Hide" : "View"} details
        </Button>
      ),
    },
  ]

  const renderSubRow = (entry: ResolutionHistoryEntry) => {
    if (expandedId !== entry.id) return null
    return (
      <tr>
        <td colSpan={5} className="px-6 pb-5 bg-slate-50/60">
          <div className="rounded-lg border border-slate-100 overflow-hidden mt-1">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium text-left">Field</th>
                  <th className="px-4 py-2 font-medium text-left">Previous Value</th>
                  <th className="px-4 py-2 font-medium text-left">Resolved Value</th>
                  <th className="px-4 py-2 font-medium text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entry.fields.map((f) => (
                  <tr key={f.fieldName} className="bg-white">
                    <td className="px-4 py-2 font-semibold text-slate-800">{f.fieldName}</td>
                    <td className="px-4 py-2 text-slate-500 line-through">
                      {f.previousValue ?? <span className="not-italic text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-2 text-emerald-700 font-medium">
                      {f.resolvedValue ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-2">
                      {f.choice === "local" ? (
                        <Badge variant="outline">Kept local</Badge>
                      ) : (
                        <Badge variant="default">Accepted incoming</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <TypographyH3 className="text-lg">Resolution History</TypographyH3>
        </div>
        <TypographyMuted className="text-xs">{entries.length} total records</TypographyMuted>
      </div>

      <DataTable
        data={visibleEntries}
        columns={columns}
        onRowClick={(entry) => toggleExpand(entry.id)}
        renderSubRow={renderSubRow}
        emptyMessage="No conflict resolutions recorded yet."
        className="border-none shadow-none rounded-none"
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/40">
          <TypographyMuted className="text-xs">
            Page {safePage} of {totalPages} ({entries.length} records)
          </TypographyMuted>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === safePage ? "default" : "ghost"}
                size="sm"
                onClick={() => setPage(p)}
                className={`px-2.5 ${p === safePage ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-600"}`}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
