import "@testing-library/jest-dom"
import React from "react"
import { render, screen } from "@testing-library/react"
import { StatusIndicator } from "./StatusIndicator"

describe("StatusIndicator", () => {
  it("renders 'Synced' badge for synced status", () => {
    render(<StatusIndicator status="synced" />)
    expect(screen.getByText("Synced")).toBeInTheDocument()
  })

  it("renders 'Syncing...' badge for syncing status", () => {
    render(<StatusIndicator status="syncing" />)
    expect(screen.getByText("Syncing...")).toBeInTheDocument()
  })

  it("renders 'Review Needed' badge for conflict status", () => {
    render(<StatusIndicator status="conflict" />)
    expect(screen.getByText("Review Needed")).toBeInTheDocument()
  })

  it("renders 'Failed' badge for error status", () => {
    render(<StatusIndicator status="error" />)
    expect(screen.getByText("Failed")).toBeInTheDocument()
  })

  it("renders 'Unknown' badge for unknown/default status", () => {
    render(<StatusIndicator status={"unknown" as any} />)
    expect(screen.getByText("Unknown")).toBeInTheDocument()
  })

  it("applies success variant for synced status", () => {
    const { container } = render(<StatusIndicator status="synced" />)
    const badge = container.querySelector(".bg-emerald-100")
    expect(badge).toBeInTheDocument()
  })

  it("applies warning variant for conflict status", () => {
    const { container } = render(<StatusIndicator status="conflict" />)
    const badge = container.querySelector(".bg-amber-100")
    expect(badge).toBeInTheDocument()
  })

  it("applies destructive variant for error status", () => {
    const { container } = render(<StatusIndicator status="error" />)
    const badge = container.querySelector(".bg-red-100")
    expect(badge).toBeInTheDocument()
  })
})
