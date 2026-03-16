import { Edit2, MoreVertical, Trash2 } from "lucide-react"
import React, { useState } from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { User } from "@/interface/types"
import { cn } from "@/utils/cn"

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <div className="w-full overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                User
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Joined
              </th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => window.location.href = `/users/${user.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === "active" ? "success" : "warning"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(user)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(user.id)}
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
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
