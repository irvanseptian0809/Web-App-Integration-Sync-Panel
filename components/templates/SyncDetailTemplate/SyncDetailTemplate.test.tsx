import "@testing-library/jest-dom"
import React from "react"
import { render, screen } from "@testing-library/react"
import { SyncDetailTemplate } from "./SyncDetailTemplate"

const mockIntegration = {
  id: "1",
  name: "Salesforce",
  logo: "https://example.com/logo.png",
  status: "synced" as const,
  version: "1.0.0",
}

describe("SyncDetailTemplate", () => {
  it("renders integration name and version", () => {
    render(
      <SyncDetailTemplate integration={mockIntegration}>
        <div>Content</div>
      </SyncDetailTemplate>,
    )
    expect(screen.getByText("Salesforce")).toBeInTheDocument()
    expect(screen.getByText("Version 1.0.0")).toBeInTheDocument()
  })

  it("renders the back link", () => {
    render(
      <SyncDetailTemplate integration={mockIntegration}>
        <div>Content</div>
      </SyncDetailTemplate>,
    )
    expect(screen.getByText("Back to Integrations")).toBeInTheDocument()
  })

  it("renders children content", () => {
    render(
      <SyncDetailTemplate integration={mockIntegration}>
        <div data-testid="child-content">Main Body</div>
      </SyncDetailTemplate>,
    )
    expect(screen.getByTestId("child-content")).toBeInTheDocument()
  })

  it("renders action button when provided", () => {
    render(
      <SyncDetailTemplate
        integration={mockIntegration}
        action={<button>Sync Now</button>}
      >
        <div>Content</div>
      </SyncDetailTemplate>,
    )
    expect(screen.getByRole("button", { name: "Sync Now" })).toBeInTheDocument()
  })

  it("renders status indicator", () => {
    render(
      <SyncDetailTemplate integration={mockIntegration}>
        <div>Content</div>
      </SyncDetailTemplate>,
    )
    expect(screen.getByText("Synced")).toBeInTheDocument()
  })
})
