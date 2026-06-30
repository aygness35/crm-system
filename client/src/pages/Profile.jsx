import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import api from "../services/api";

const inputStyle = {
  width: "100%", padding: "10px 14px",
  borderRadius: 8, border: "1px solid #1e3a5f",
  background: "#0d1626", color: "#e2e8f0",
  fontSize: 14, boxSizing: "border-box",
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setName(res.data.name || "");
        setEmail(res.data.email || "");
      } catch (err) {
        // fallback to localStorage
        const local = (() => {
          try { return JSON.parse(localStorage.getItem("user")) || {}; }
          catch { return {}; }
        })();
        setUser(local);
        setName(local.name || "");
        setEmail(local.email || "");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    setError("");
    setSuccess("");
    if (!name || !email) {
      setError("Name and email cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      const res = await api.put(`/users/${user._id}`, { name, email });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: 40, textAlign: "center", color: "#334155" }}>Loading...</div>
      </Layout>
    );
  }

  const initials = (name || "U").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>Profile</h1>
        <p style={{ color: "#475569", margin: 0, fontSize: 14 }}>Manage your account settings</p>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* AVATAR CARD */}
        <div style={{
          width: 220,
          background: "#0a0f1f",
          border: "1px solid #1a2744",
          borderRadius: 12,
          padding: "28px 20px",
          textAlign: "center",
          alignSelf: "flex-start",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: "white",
            margin: "0 auto 16px",
            boxShadow: "0 0 30px rgba(37,99,235,0.35)",
          }}>
            {initials}
          </div>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{name}</div>
          <div style={{ color: "#475569", fontSize: 13 }}>{email}</div>
          <div style={{
            marginTop: 14,
            padding: "4px 12px",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 20,
            display: "inline-block",
            fontSize: 12, color: "#10b981", fontWeight: 500,
          }}>
            Active
          </div>
        </div>

        {/* EDIT FORM */}
        <div style={{
          flex: 1,
          background: "#0a0f1f",
          border: "1px solid #1a2744",
          borderRadius: 12,
          padding: "28px 28px",
        }}>
          <h3 style={{ margin: "0 0 20px", color: "#94a3b8", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Account Information
          </h3>

          {success && (
            <div style={{
              padding: "12px 16px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: 8, color: "#34d399", fontSize: 14, marginBottom: 18,
            }}>
              ✓ {success}
            </div>
          )}

          {error && (
            <div style={{
              padding: "12px 16px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, color: "#f87171", fontSize: 14, marginBottom: 18,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                Email address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
              User ID
            </label>
            <input
              value={user._id || "—"}
              readOnly
              style={{ ...inputStyle, color: "#334155", cursor: "not-allowed" }}
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            style={{
              padding: "11px 24px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white", fontWeight: 700, fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.8 : 1,
              boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
