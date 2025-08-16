import "./globals.css";
import Link from "next/link";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "AI Recruiter",
  description: "AI-powered recruiting platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div style={{ maxWidth: 960, margin: "1rem auto", padding: "0 1rem" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
