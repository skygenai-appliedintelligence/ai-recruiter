export function validateCompanySignup(input: { companyName: string; email: string; password: string }) {
  return (
    input.companyName.trim().length > 1 &&
    input.email.includes("@") &&
    input.password.length >= 6
  );
}
