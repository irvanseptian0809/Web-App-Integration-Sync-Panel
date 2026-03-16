import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./Input"

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: "Enter text..." },
}

export const WithValue: Story = {
  args: { defaultValue: "Hello world", placeholder: "Enter text..." },
}

export const EmailType: Story = {
  args: { type: "email", placeholder: "user@example.com" },
}

export const PasswordType: Story = {
  args: { type: "password", placeholder: "••••••••" },
}

export const Disabled: Story = {
  args: { disabled: true, value: "Cannot edit", placeholder: "Disabled", onChange: () => {} },
}

export const WithError: Story = {
  args: {
    placeholder: "Enter provider name",
    className: "border-red-500 focus-visible:ring-red-500",
  },
}
