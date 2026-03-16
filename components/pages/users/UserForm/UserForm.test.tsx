import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { UserForm } from "./UserForm"

describe("UserForm", () => {
  it("renders all form fields", () => {
    render(<UserForm onSubmit={jest.fn()} onCancel={jest.fn()} />)
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument()
  })

  it("populates initial data when provided", () => {
    const initialData = { name: "Jane Doe", email: "jane@test.com" }
    render(<UserForm initialData={initialData} onSubmit={jest.fn()} onCancel={jest.fn()} />)
    expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument()
    expect(screen.getByDisplayValue("jane@test.com")).toBeInTheDocument()
  })

  it("calls onSubmit with form data", () => {
    const onSubmit = jest.fn()
    render(<UserForm onSubmit={onSubmit} onCancel={jest.fn()} />)
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "New User" } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "new@user.com" } })
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: "Member" } })
    
    fireEvent.click(screen.getByText(/Create User/i))
    
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: "New User",
      email: "new@user.com",
      role: "Member"
    }))
  })

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = jest.fn()
    render(<UserForm onSubmit={jest.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByText(/Cancel/i))
    expect(onCancel).toHaveBeenCalled()
  })
})
