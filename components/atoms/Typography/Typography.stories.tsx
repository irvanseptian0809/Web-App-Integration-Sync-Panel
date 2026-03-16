import type { Meta, StoryObj } from "@storybook/react"
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographySmall,
  TypographyMuted,
} from "./Typography"

const meta: Meta = {
  title: "Atoms/Typography",
  tags: ["autodocs"],
}

export default meta

export const Heading1: StoryObj<typeof TypographyH1> = {
  render: () => <TypographyH1>The quick brown fox</TypographyH1>,
}

export const Heading2: StoryObj<typeof TypographyH2> = {
  render: () => <TypographyH2>The quick brown fox</TypographyH2>,
}

export const Heading3: StoryObj<typeof TypographyH3> = {
  render: () => <TypographyH3>The quick brown fox</TypographyH3>,
}

export const Paragraph: StoryObj<typeof TypographyP> = {
  render: () => (
    <TypographyP>
      This is a paragraph of body text. It uses a comfortable line height for readability.
    </TypographyP>
  ),
}

export const Small: StoryObj<typeof TypographySmall> = {
  render: () => <TypographySmall>Small label text</TypographySmall>,
}

export const Muted: StoryObj<typeof TypographyMuted> = {
  render: () => <TypographyMuted>Muted helper text</TypographyMuted>,
}

export const AllVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <TypographyH1>Heading 1</TypographyH1>
      <TypographyH2>Heading 2</TypographyH2>
      <TypographyH3>Heading 3</TypographyH3>
      <TypographyP>Paragraph body text with comfortable leading.</TypographyP>
      <TypographySmall>Small label text</TypographySmall>
      <TypographyMuted>Muted helper text</TypographyMuted>
    </div>
  ),
}
