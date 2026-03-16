import { Edit2, MoreVertical, Trash2, Key as KeyIcon, User, DoorOpen } from "lucide-react"
import React from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { Key } from "@/interface/types"
import { useUserStore } from "@/stores/users/usersStore"
import { useDoorStore } from "@/stores/doors/doorsStore"
import { cn } from "@/utils/cn"

interface KeysTableProps {
  keysList: Key[]
  onEdit: (key: Key) => void
  onDelete: (keyId: string) => void
}

export function KeysTable({ keysList, onEdit, onDelete }: KeysTableProps) {
  const users = useUserStore((state) => state.users)
  const doors = useDoorStore((state) => state.doors)

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || "Unknown User"
  const getDoorName = (doorId: string) => doors.find(d => d.id === doorId)?.name || "Unknown Door"

  return (
    <div className="w-full overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Key Info
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                User
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Door
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Access Period
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {keysList.length > 0 ? (
              keysList.map((key) => (
                <tr
                  key={key.id}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => window.location.href = `/keys/${key.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <KeyIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{key.key_type}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">{key.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      {getUserName(key.user_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <DoorOpen className="w-4 h-4 text-slate-400" />
                      {getDoorName(key.door_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs text-slate-500">
                      <span>Start: {new Date(key.access_start).toLocaleDateString()}</span>
                      <span>End: {new Date(key.access_end).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={key.status === "active" ? "success" : "destructive"}>
                      {key.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(key)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(key.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No access keys found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
