import "./globals.css";

export const metadata = {
  title: "AI Recruiter",
  description: "AI-powered recruiting platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
