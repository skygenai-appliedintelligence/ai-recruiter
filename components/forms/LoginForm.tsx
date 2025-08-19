"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just show success message
      alert(`Login successful for ${email}`);
      
      // Reset form
      setEmail("");
      setPassword("");
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "0 auto",
      padding: "2rem",
      backgroundColor: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "1px solid #e5e7eb",
    }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{
          fontSize: "1.875rem",
          fontWeight: 700,
          color: "#111827",
          margin: 0,
          marginBottom: "0.5rem",
        }}>
          Welcome back
        </h1>
        <p style={{
          color: "#6b7280",
          margin: 0,
          fontSize: "0.875rem",
        }}>
          Sign in to your AI Recruiter account
        </p>
      </div>

      {errors.general && (
        <div style={{
          padding: "0.75rem",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 8,
          marginBottom: "1rem",
          color: "#dc2626",
          fontSize: "0.875rem",
        }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="email"
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="Enter your email"
          required
        />

        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
          required
        />

        <div style={{ marginTop: "1.5rem" }}>
          <Button 
            type="submit" 
            loading={loading}
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      <div style={{
        marginTop: "1.5rem",
        textAlign: "center",
        fontSize: "0.875rem",
        color: "#6b7280",
      }}>
                  <p style={{ margin: "0.5rem 0" }}>
            Don&apos;t have an account?{" "}
          <a 
            href="/signup" 
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign up
          </a>
        </p>
        <p style={{ margin: "0.5rem 0" }}>
          <a 
            href="/forgot-password" 
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
}
