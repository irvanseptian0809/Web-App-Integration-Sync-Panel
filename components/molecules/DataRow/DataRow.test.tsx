import "@testing-library/jest-dom"
import React from "react"
import { render, screen } from "@testing-library/react"
import { DataRow } from "./DataRow"

describe("DataRow", () => {
  it("renders label and value", () => {
    render(<DataRow label="Provider" value="Salesforce" />)
    expect(screen.getByText("Provider")).toBeInTheDocument()
    expect(screen.getByText("Salesforce")).toBeInTheDocument()
  })

  it("does not render subValue when not provided", () => {
    render(<DataRow label="Status" value="Active" />)
    // Only label and value should appear
    expect(screen.queryByText("subvalue text")).not.toBeInTheDocument()
  })

  it("renders subValue when provided", () => {
    render(<DataRow label="Sync Time" value="12:00 PM" subValue="Verified 2 minutes ago" />)
    expect(screen.getByText("Verified 2 minutes ago")).toBeInTheDocument()
  })

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <DataRow label="Key" value="Value" className="custom-row" />,
    )
    expect(container.firstChild).toHaveClass("custom-row")
  })

  it("renders React node as value", () => {
    render(
      <DataRow
        label="Status"
        value={<span data-testid="node-value">Active Node</span>}
      />,
    )
    expect(screen.getByTestId("node-value")).toBeInTheDocument()
  })
})
