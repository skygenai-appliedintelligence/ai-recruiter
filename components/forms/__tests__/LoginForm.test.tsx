import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../LoginForm";

// Helper to get inputs and button
const getControls = () => ({
  email: screen.getByLabelText(/email address/i) as HTMLInputElement,
  password: screen.getByLabelText(/password/i) as HTMLInputElement,
  submit: screen.getByRole("button", { name: /sign in/i }),
});

describe("LoginForm", () => {
  beforeEach(() => {
    // Mock window.alert to avoid popups in tests
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("renders inputs and submit button", () => {
    render(<LoginForm />);
    const { email, password, submit } = getControls();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
  });

  it("validates required fields and formats", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const { submit } = getControls();

    await user.click(submit);
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    // Enter invalid email and short password
    await user.type(screen.getByLabelText(/email address/i), "invalid");
    await user.type(screen.getByLabelText(/password/i), "123");
    await user.click(submit);

    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("submits successfully and resets form", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    const { email, password, submit } = getControls();

    await user.type(email, "user@example.com");
    await user.type(password, "secret123");

    await user.click(submit);

    // While submitting, button shows loading text
    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();

    // After the simulated delay, success alert is called and button resets
    expect(await screen.findByRole("button", { name: /sign in/i }, { timeout: 4000 })).toBeEnabled();
    expect(window.alert).toHaveBeenCalledWith("Login successful for user@example.com");

    // Inputs reset
    expect(email.value).toBe("");
    expect(password.value).toBe("");
  });
});


