import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/atoms/Button"
import { ModalWrapper } from "./ModalWrapper"

const meta: Meta<typeof ModalWrapper> = {
  title: "Molecules/ModalWrapper",
  component: ModalWrapper,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    isOpen: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof ModalWrapper>

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "Sample Modal",
    description: "This is an example of a modal wrapper with description.",
    footer: (
      <div className="flex gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    ),
    children: <p className="text-sm text-slate-600">This is the body content of the modal.</p>,
  },
}

export const OpenNoDescription: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "No Description Modal",
    children: <p className="text-sm text-slate-600">No description is shown above.</p>,
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    title: "Hidden Modal",
    children: <p>You cannot see this.</p>,
  },
}
