// Client-side API calls (placeholder)
import { api } from "@/lib/fetcher";

export async function login(email: string, password: string) {
  return api<{ ok: true }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function companySignup(companyName: string, email: string, password: string) {
  return api<{ ok: true }>("/api/auth/company-signup", { method: "POST", body: JSON.stringify({ companyName, email, password }) });
}
