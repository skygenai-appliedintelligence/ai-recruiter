// Placeholder validator example (swap to zod/yup if desired)
export function validateLogin(input: { email: string; password: string }) {
  return input.email.includes("@") && input.password.length >= 6;
}
