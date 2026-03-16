import { Edit2, Trash2, MapPin, Cpu } from "lucide-react"
import React from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { Door } from "@/interface/types"
import { cn } from "@/utils/cn"
import { Column, DataTable } from "@/components/molecules/DataTable"
import { DoorsTableProps } from "./interface"

export function DoorsTable({
  doors,
  onEdit,
  onDelete,
  selectedIds = new Set(),
  onToggleRow,
  onToggleAll
}: DoorsTableProps) {
  const router = useRouter()

  const columns: Column<Door>[] = [
    {
      header: onToggleAll ? (
        <input
          type="checkbox"
          checked={doors.length > 0 && selectedIds.size === doors.length}
          onChange={(e) => {
            e.stopPropagation()
            onToggleAll()
          }}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ) : "",
      accessor: "select",
      headerClassName: "w-10 pl-6 pr-2",
      className: "pl-6 pr-2",
      render: (door) => (
        <input
          type="checkbox"
          checked={selectedIds.has(door.id || "")}
          onChange={(e) => {
            e.stopPropagation()
            if (door.id) onToggleRow?.(door.id)
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
    },
    {
      header: "Door Name",
      accessor: "name",
      className: "px-4",
      render: (door) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{door.name}</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Cpu className="w-3 h-3" />
            {door.device_id}
          </div>
        </div>
      ),
    },
    {
      header: "Integration",
      accessor: "name",
      className: "px-4 py-4",
      render: (door) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="text-xs text-slate-500">{door?.provider || "-"}</div>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      render: (door) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400" />
          {door.location}
        </div>
      ),
    },
    {
      header: "Battery",
      accessor: "battery_level",
      render: (door) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                door.battery_level > 50 ? "bg-green-500" : door.battery_level > 20 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${door.battery_level}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600">{door.battery_level}%</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (door) => (
        <Badge variant={door.status === "online" ? "success" : "destructive"}>
          {door.status}
        </Badge>
      ),
    },
    {
      header: "Action",
      accessor: "actions",
      headerClassName: "text-right pr-6",
      className: "text-right pr-6",
      render: (door) => (
        <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="default"
            size="icon"
            onClick={() => onEdit(door)}
            title="Edit Door"
          >
            <Edit2 className="w-4 h-4 text-white" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => door.id && onDelete(door.id)}
            title="Delete Door"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={doors}
      columns={columns}
      onRowClick={(door) => {
        router.push(`/doors/${door.id}`)
      }}
      rowClassName={(door) => selectedIds.has(door.id || "") ? "bg-blue-50/40 hover:bg-blue-50/60" : ""}
      emptyMessage="No doors found."
      className="border-none shadow-none rounded-none"
    />
  )
}
