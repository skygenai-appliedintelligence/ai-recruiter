import LoginForm from "@/components/forms/LoginForm";

export const metadata = { title: "Login - AI Recruiter" };

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 500,
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}>
          <div style={{
            width: 64,
            height: 64,
            backgroundColor: "#fff",
            borderRadius: "50%",
            margin: "0 auto 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          }}>
            <span style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#667eea",
            }}>
              AI
            </span>
          </div>
          <h1 style={{
            fontSize: "2.25rem",
            fontWeight: "700",
            color: "#fff",
            margin: 0,
            marginBottom: "0.5rem",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}>
            AI Recruiter
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
            fontSize: "1.125rem",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}>
            Intelligent recruitment solutions
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
