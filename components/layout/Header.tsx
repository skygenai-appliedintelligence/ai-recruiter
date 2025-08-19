import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "1.125rem" }}>AI Recruiter</Link>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login">Login</Link>
          <Link href="/company/signup">Company Signup</Link>
        </nav>
      </div>
    </header>
  );
}


