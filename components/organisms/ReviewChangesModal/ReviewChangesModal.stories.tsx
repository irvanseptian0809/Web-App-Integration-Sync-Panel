import type { Meta, StoryObj } from "@storybook/react"
import { ReviewChangesModal } from "./ReviewChangesModal"
import { SyncChange } from "@/interface/types"

const mockChanges: SyncChange[] = [
  {
    id: "chg_1",
    field_name: "email",
    change_type: "UPDATE",
    current_value: "alice@old.com",
    new_value: "alice@new.com",
  },
  {
    id: "chg_2",
    field_name: "phone",
    change_type: "UPDATE",
    current_value: "+12345",
    new_value: "+54321",
  },
  {
    id: "chg_3",
    field_name: "department",
    change_type: "CREATE",
    current_value: "",
    new_value: "Engineering",
  },
]

const meta: Meta<typeof ReviewChangesModal> = {
  title: "Organisms/ReviewChangesModal",
  component: ReviewChangesModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ReviewChangesModal>

function ReviewModalDemo({
  integration,
  changes,
  resolutions,
  isOpen = true,
}: {
  integration: any
  changes: SyncChange[]
  resolutions: Record<string, string>
  isOpen?: boolean
}) {
  const { setPendingChanges, setResolution } = useIntegrationStore()
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    setPendingChanges(integration.id, changes)
    Object.entries(resolutions).forEach(([field, choice]) => {
      setResolution(integration.id, field, choice)
    })
    setReady(true)
  }, [integration.id, changes, resolutions, setPendingChanges, setResolution])

  if (!ready) return <div className="p-8 text-slate-400 italic">Initializing store...</div>

  return (
    <ReviewChangesModal
      isOpen={isOpen}
      integration={integration}
      onClose={() => console.log("Close")}
    />
  )
}

import { useIntegrationStore } from "@/stores/integrations/integrationsStore"
import React from "react"

const mockIntegration = {
  id: "1",
  name: "Salesforce",
  provider: "salesforce",
  logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
  status: "conflict" as const,
  version: 1,
}

export const Unresolved: Story = {
  render: () => (
    <ReviewModalDemo
      integration={mockIntegration}
      changes={mockChanges}
      resolutions={{}}
    />
  ),
}

export const PartiallyResolved: Story = {
  render: () => (
    <ReviewModalDemo
      integration={mockIntegration}
      changes={mockChanges}
      resolutions={{ email: "chg_1" }}
    />
  ),
}
