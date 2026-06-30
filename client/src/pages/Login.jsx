import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#080d1a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND GLOW */}
      <div style={{
        position: "absolute", top: -200, left: -200,
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -150, right: -150,
        width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* LEFT PANEL */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 60,
      }}>
        <div style={{ maxWidth: 420, width: "100%" }}>
          {/* LOGO */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: "bold", color: "white",
              boxShadow: "0 0 20px rgba(37,99,235,0.4)",
            }}>C</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>CRM System</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, margin: "0 0 8px" }}>
            Welcome back
          </h1>
          <p style={{ color: "#64748b", marginBottom: 36, margin: "0 0 36px" }}>
            Sign in to your account to continue
          </p>

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

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: 8, border: "1px solid #1e3a5f",
                background: "#0d1626", color: "#e2e8f0",
                fontSize: 14, boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 6, fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: 8, border: "1px solid #1e3a5f",
                background: "#0d1626", color: "#e2e8f0",
                fontSize: 14, boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              borderRadius: 8, border: "none",
              background: loading ? "#1d3a7a" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white", fontWeight: 700, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
            }}
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>

          <p style={{ marginTop: 24, textAlign: "center", color: "#475569", fontSize: 14 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#3b82f6", fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL (decorative) */}
      <div style={{
        width: "45%",
        background: "linear-gradient(135deg, #0f172a, #0d1b3e)",
        borderLeft: "1px solid #1a2744",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 60,
        gap: 24,
      }}>
        {[
          { icon: "▣", label: "Dashboard", desc: "Real-time metrics" },
          { icon: "◈", label: "Customers", desc: "Manage your CRM data" },
          { icon: "◆", label: "Tasks", desc: "Track to-dos" },
        ].map((item) => (
          <div key={item.label} style={{
            width: "100%", maxWidth: 280, padding: "16px 20px",
            borderRadius: 12, background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontSize: 22, color: "#3b82f6" }}>{item.icon}</span>
            <div>
              <div style={{ color: "#cbd5e1", fontWeight: 600, fontSize: 14 }}>{item.label}</div>
              <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
