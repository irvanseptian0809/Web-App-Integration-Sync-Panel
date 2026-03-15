import "@testing-library/jest-dom"
import React from "react"
import { render, screen } from "@testing-library/react"
import { Badge } from "./Badge"

describe("Badge", () => {
  it("renders children correctly", () => {
    render(<Badge>Hello</Badge>)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })

  it("applies default variant classes", () => {
    const { container } = render(<Badge>Default</Badge>)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass("bg-slate-900", "text-slate-50")
  })

  it("applies success variant classes", () => {
    const { container } = render(<Badge variant="success">Success</Badge>)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass("bg-emerald-100", "text-emerald-800")
  })

  it("applies warning variant classes", () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass("bg-amber-100", "text-amber-800")
  })

  it("applies destructive variant classes", () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass("bg-red-100", "text-red-800")
  })

  it("applies outline variant classes", () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass("text-slate-950", "border-slate-200")
  })

  it("merges custom className", () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass("custom-class")
  })

  it("passes through additional HTML attributes", () => {
    render(<Badge data-testid="badge-el">Test</Badge>)
    expect(screen.getByTestId("badge-el")).toBeInTheDocument()
  })
})
