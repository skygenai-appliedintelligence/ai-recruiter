"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login with ${email}`);
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
      <label htmlFor="email">Email</label>
      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label htmlFor="password">Password</label>
      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <div style={{ marginTop: "1rem" }}>
        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}
