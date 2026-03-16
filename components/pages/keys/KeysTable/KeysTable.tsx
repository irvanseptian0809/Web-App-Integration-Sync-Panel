import { Edit2, Trash2, Key as KeyIcon, User, DoorOpen } from "lucide-react"
import React from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { Key } from "@/interface/types"
import { useUserStore } from "@/stores/users/usersStore"
import { useDoorStore } from "@/stores/doors/doorsStore"
import { Column, DataTable } from "@/components/molecules/DataTable"
import { KeysTableProps } from "./interfaces"

export function KeysTable({ keysList, onEdit, onDelete }: KeysTableProps) {
  const router = useRouter()
  const users = useUserStore((state) => state.users)
  const doors = useDoorStore((state) => state.doors)

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || "Unknown User"
  const getDoorName = (doorId: string) => doors.find(d => d.id === doorId)?.name || "Unknown Door"

  const columns: Column<Key>[] = [
    {
      header: "Key Info",
      accessor: "key_type",
      render: (key) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <KeyIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">{key.key_type}</span>
            <span className="text-[10px] text-slate-400 font-mono uppercase">{key.id?.slice(0, 8) || "NEW"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Integration",
      accessor: "name",
      className: "px-4 py-4",
      render: (key) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="text-xs text-slate-500">{key?.provider || "-"}</div>
        </div>
      ),
    },
    {
      header: "User",
      accessor: "user_id",
      render: (key) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="w-4 h-4 text-slate-400" />
          {getUserName(key.user_id)}
        </div>
      ),
    },
    {
      header: "Door",
      accessor: "door_id",
      render: (key) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <DoorOpen className="w-4 h-4 text-slate-400" />
          {getDoorName(key.door_id)}
        </div>
      ),
    },
    {
      header: "Access Period",
      accessor: "access_start",
      render: (key) => (
        <div className="flex flex-col text-xs text-slate-500">
          <span>Start: {new Date(key.access_start).toLocaleDateString()}</span>
          <span>End: {new Date(key.access_end).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (key) => (
        <Badge variant={key.status === "active" ? "success" : "destructive"}>
          {key.status}
        </Badge>
      ),
    },
    {
      header: "",
      accessor: "actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (key) => (
        <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="default"
            size="icon"
            onClick={() => onEdit(key)}
          >
            <Edit2 className="w-4 h-4 text-white" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => key.id && onDelete(key.id)}
          >
            <Trash2 className="w-4 h-4 text-white" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={keysList}
      columns={columns}
      onRowClick={(key) => key.id && router.push(`/keys/${key.id}`)}
      emptyMessage="No access keys found."
    />
  )
}
