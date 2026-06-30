import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080d1a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: -200, right: -150,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: 420, padding: "40px 36px",
        borderRadius: 16,
        background: "#0a0f1f",
        border: "1px solid #1a2744",
        boxShadow: "0 0 60px rgba(0,0,0,0.5)",
        position: "relative",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: "bold", color: "white",
            boxShadow: "0 0 16px rgba(37,99,235,0.4)",
          }}>C</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>Create account</span>
        </div>

        {error && (
          <div style={{
            padding: "12px 16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            color: "#f87171",
            fontSize: 14,
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {[
          { label: "Full name", value: name, setValue: setName, placeholder: "John Doe", type: "text" },
          { label: "Email address", value: email, setValue: setEmail, placeholder: "name@company.com", type: "email" },
          { label: "Password", value: password, setValue: setPassword, placeholder: "Min. 6 characters", type: "password" },
        ].map((field) => (
          <div key={field.label} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: 8, border: "1px solid #1e3a5f",
                background: "#0d1626", color: "#e2e8f0",
                fontSize: 14, boxSizing: "border-box",
              }}
            />
          </div>
        ))}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%", padding: 13,
            marginTop: 8,
            borderRadius: 8, border: "none",
            background: loading ? "#1d3a7a" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white", fontWeight: 700, fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
          }}
        >
          {loading ? "Creating account..." : "Create account →"}
        </button>

        <p style={{ marginTop: 24, textAlign: "center", color: "#475569", fontSize: 14 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#3b82f6", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
