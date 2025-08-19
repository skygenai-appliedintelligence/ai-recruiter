import { describe, it, expect } from "vitest";
import { POST } from "../route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/auth/login", () => {
  it("returns ok: true", async () => {
    const req = makeRequest({ email: "user@example.com", password: "secret" });
    const res = await POST(req);
    const json = await res.json();
    expect(res.ok).toBe(true);
    expect(json).toEqual({ ok: true });
  });
});


