"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem", height: 56 }}>
        <Link href="/" style={{ fontWeight: 700 }}>AI Recruiter</Link>
        <nav style={{ marginLeft: "auto", display: "flex", gap: "0.75rem" }}>
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/company/signup">Company Signup</Link>
        </nav>
      </div>
    </header>
  );
}
