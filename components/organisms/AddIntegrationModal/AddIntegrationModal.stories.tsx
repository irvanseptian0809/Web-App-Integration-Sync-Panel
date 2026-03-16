import type { Meta, StoryObj } from "@storybook/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { AddIntegrationModal } from "./AddIntegrationModal"

const meta: Meta<typeof AddIntegrationModal> = {
  title: "Organisms/AddIntegrationModal",
  component: AddIntegrationModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AddIntegrationModal>

export const Open: Story = {
  args: { isOpen: true, onClose: () => {} },
}

export const Closed: Story = {
  args: { isOpen: false, onClose: () => {} },
}
