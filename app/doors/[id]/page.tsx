"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Cpu, Battery, Wifi, Clock } from "lucide-react"
import React from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyH3, TypographyMuted, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { useDoorStore } from "@/stores/doors/doorsStore"
import { cn } from "@/utils/cn"

export default function DoorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const doorId = params.id as string
  const door = useDoorStore((state) => state.doors.find((d) => d.id === doorId))

  if (!door) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <TypographyP className="text-slate-500 mb-4">Door not found.</TypographyP>
          <Button onClick={() => router.push("/doors")}>Back to Doors</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/doors")}
          className="pl-0 text-slate-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Doors
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white p-3">
              <Cpu className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <TypographyH2>{door.name}</TypographyH2>
                <Badge variant={door.status === "online" ? "success" : "destructive"}>
                  {door.status}
                </Badge>
              </div>
              <TypographyMuted className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {door.location}
              </TypographyMuted>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-slate-50 rounded-2xl">
                <Battery className={cn("w-8 h-8 mx-auto mb-2", door.battery_level > 20 ? "text-green-500" : "text-red-500")} />
                <span className="block text-2xl font-bold text-slate-900">{door.battery_level}%</span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Battery Level</span>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-2xl">
                <Wifi className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <span className="block text-2xl font-bold text-slate-900">{door.status.toUpperCase()}</span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Signal Status</span>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-2xl">
                <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                <span className="block text-xl font-bold text-slate-900">
                  {new Date(door.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-xs text-slate-500 uppercase font-semibold">Last Seen</span>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100">
              <TypographyH3 className="mb-6">Hardware Configuration</TypographyH3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl">
                  <span className="text-sm text-slate-500">Device Id</span>
                  <span className="text-sm font-semibold text-slate-900">Portier X-100</span>
                </div>
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl">
                  <span className="text-sm text-slate-500">Serial Number</span>
                  <span className="text-sm font-mono font-semibold text-slate-900 uppercase">{door.device_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <TypographyH3 className="text-lg mb-4">Location Meta</TypographyH3>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-blue-900 block">{door.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
