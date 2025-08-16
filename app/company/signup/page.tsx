import CompanySignupForm from "@/components/forms/CompanySignupForm";

export const metadata = { title: "Company Signup - AI Recruiter" };

export default function CompanySignupPage() {
  return (
    <main>
      <h1>Company Signup</h1>
      <CompanySignupForm />
    </main>
  );
}
