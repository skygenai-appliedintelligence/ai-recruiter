"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CompanySignupForm() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signup ${companyName} / ${email}`);
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 480 }}>
      <label htmlFor="companyName">Company Name</label>
      <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />

      <label htmlFor="email">Work Email</label>
      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label htmlFor="password">Password</label>
      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <div style={{ marginTop: "1rem" }}>
        <Button type="submit">Create Account</Button>
      </div>
    </form>
  );
}
