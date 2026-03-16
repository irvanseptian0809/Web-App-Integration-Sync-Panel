import { Edit2, Trash2, CheckCircle, Clock } from "lucide-react"
import React from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { User } from "@/interface/types"
import { Column, DataTable } from "@/components/molecules/DataTable"

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  selectedIds?: Set<string>
  onToggleRow?: (id: string) => void
  onToggleAll?: () => void
}

export function UsersTable({
  users,
  onEdit,
  onDelete,
  selectedIds = new Set(),
  onToggleRow,
  onToggleAll
}: UsersTableProps) {
  const router = useRouter()

  const columns: Column<User>[] = [
    {
      header: onToggleAll ? (
        <input
          type="checkbox"
          checked={users.length > 0 && selectedIds.size === users.length}
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
      render: (user) => (
        <input
          type="checkbox"
          checked={selectedIds.has(user.id || "")}
          onChange={(e) => {
            e.stopPropagation()
            if (user.id) onToggleRow?.(user.id)
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
    },
    {
      header: "User",
      accessor: "name",
      className: "px-4",
      render: (user) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{user.name || "Unnamed User"}</span>
          <span className="text-xs text-slate-500">{user.email || "—"}</span>
        </div>
      ),
    },
    {
      header: "Integration",
      accessor: "provider",
      render: (user) => (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
            {user?.provider || "Local"}
          </span>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      render: (user) => <span className="text-sm text-slate-600">{user.role || "Member"}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      render: (user) => (
        <Badge variant={user.status === "active" ? "success" : "warning"}>
          {user.status || "active"}
        </Badge>
      ),
    },
    {
      header: "Joined",
      accessor: "created_at",
      render: (user) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</span>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "actions",
      headerClassName: "text-right pr-6",
      className: "text-right pr-6",
      render: (user) => (
        <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="default"
            size="icon"
            onClick={() => onEdit(user)}
            title="Edit User"
          >
            <Edit2 className="w-4 h-4 text-white" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => user.id && onDelete(user.id)}
            title="Delete User"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={users}
      columns={columns}
      onRowClick={(user) => {
        if (onToggleRow && user.id) {
          onToggleRow(user.id)
        } else if (user.id) {
          router.push(`/users/${user.id}`)
        }
      }}
      rowClassName={(user) => selectedIds.has(user.id || "") ? "bg-blue-50/40 hover:bg-blue-50/60" : ""}
      emptyMessage="No users found."
      className="border-none shadow-none rounded-none"
    />
  )
}
