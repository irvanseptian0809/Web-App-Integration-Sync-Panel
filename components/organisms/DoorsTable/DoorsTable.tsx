import { Edit2, MoreVertical, Trash2, MapPin, Cpu } from "lucide-react"
import React from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { Door } from "@/interface/types"
import { cn } from "@/utils/cn"

interface DoorsTableProps {
  doors: Door[]
  onEdit: (door: Door) => void
  onDelete: (doorId: string) => void
}

export function DoorsTable({ doors, onEdit, onDelete }: DoorsTableProps) {
  return (
    <div className="w-full overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Door Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Location
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Battery
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doors.length > 0 ? (
              doors.map((door) => (
                <tr 
                  key={door.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => window.location.href = `/doors/${door.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{door.name}</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Cpu className="w-3 h-3" />
                        {door.device_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {door.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={door.status === "online" ? "success" : "destructive"}>
                      {door.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(door)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(door.id)}
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
                  No doors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
