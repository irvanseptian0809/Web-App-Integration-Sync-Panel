"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Key as KeyIcon, User, DoorOpen, Calendar, ShieldCheck, Activity } from "lucide-react"
import React from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyH3, TypographyMuted, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { useKeyStore } from "@/stores/keys/keysStore"
import { useUserStore } from "@/stores/users/usersStore"
import { useDoorStore } from "@/stores/doors/doorsStore"

export default function KeyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const keyId = params.id as string

  const keys = useKeyStore((state) => state.keys)
  const users = useUserStore((state) => state.users)
  const doors = useDoorStore((state) => state.doors)

  const key = keys.find((k) => k.id === keyId)
  const user = users.find((u) => u.id === key?.user_id)
  const door = doors.find((d) => d.id === key?.door_id)

  if (!key) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <TypographyP className="text-slate-500 mb-4">Key not found.</TypographyP>
          <Button onClick={() => router.push("/keys")}>Back to Keys</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/keys")}
          className="pl-0 text-slate-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Keys
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white p-4">
              <KeyIcon className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <TypographyH2>Key Details</TypographyH2>
                <Badge variant={key.status === "active" ? "success" : "destructive"}>
                  {key.status}
                </Badge>
              </div>
              <TypographyMuted className="flex items-center gap-2 font-mono">
                ID: {key.id}
              </TypographyMuted>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm h-full">
            <TypographyH3 className="mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Entity Linkage
            </TypographyH3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">User Access</span>
                    <span className="font-bold text-slate-900">{user?.name || "Deleted User"}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => user && router.push(`/users/${user.id}`)}>View</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Assigned Door</span>
                    <span className="font-bold text-slate-900">{door?.name || "Deleted Door"}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => door && router.push(`/doors/${door.id}`)}>View</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm h-full">
            <TypographyH3 className="mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Validity Period
            </TypographyH3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 block uppercase font-semibold mb-1">Grant Date</span>
                <div className="p-3 border border-slate-100 rounded-lg text-slate-900 font-medium">
                  {new Date(key.access_start).toLocaleDateString()} at {new Date(key.access_start).toLocaleTimeString()}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 block uppercase font-semibold mb-1">Expiration Date</span>
                <div className="p-3 border border-slate-100 rounded-lg text-slate-900 font-medium">
                  {new Date(key.access_end).toLocaleDateString()} at {new Date(key.access_end).toLocaleTimeString()}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Key Type</span>
                <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 capitalize">
                  {key.key_type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
