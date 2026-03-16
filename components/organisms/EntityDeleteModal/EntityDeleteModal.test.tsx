import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { EntityDeleteModal } from "./EntityDeleteModal"

describe("EntityDeleteModal", () => {
  it("renders correctly with entity information", () => {
    render(
      <EntityDeleteModal 
        isOpen={true} 
        onClose={jest.fn()} 
        onConfirm={jest.fn()} 
        entityName="Sample Entity" 
        entityType="User" 
      />
    )
    expect(screen.getByText(/Delete User/i)).toBeInTheDocument()
    expect(screen.getByText(/Sample Entity/i)).toBeInTheDocument()
  })

  it("calls onConfirm when delete is clicked", () => {
    const onConfirm = jest.fn()
    render(
      <EntityDeleteModal 
        isOpen={true} 
        onClose={jest.fn()} 
        onConfirm={onConfirm} 
        entityName="Trash" 
        entityType="Key" 
      />
    )
    fireEvent.click(screen.getByText(/^Delete$/i))
    expect(onConfirm).toHaveBeenCalled()
  })

  it("calls onClose when cancel is clicked", () => {
    const onClose = jest.fn()
    render(
      <EntityDeleteModal 
        isOpen={true} 
        onClose={onClose} 
        onConfirm={jest.fn()} 
        entityName="Wait" 
        entityType="Door" 
      />
    )
    fireEvent.click(screen.getByText(/Cancel/i))
    expect(onClose).toHaveBeenCalled()
  })
})
