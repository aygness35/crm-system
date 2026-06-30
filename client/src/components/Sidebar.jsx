import { Link, useLocation, useNavigate } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: "▣" },
  { name: "Customers", path: "/customers", icon: "◈" },
  { name: "Tasks", path: "/tasks", icon: "◆" },
  { name: "Profile", path: "/profile", icon: "◉" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        background: "#0a0f1f",
        borderRight: "1px solid #1a2744",
      }}
    >
      {/* LOGO */}
      <div style={{ padding: "28px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
              boxShadow: "0 0 14px rgba(37,99,235,0.4)",
            }}
          >
            C
          </div>
          <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16, letterSpacing: "0.5px" }}>
            CRM System
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#475569",
            paddingLeft: 42,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Admin Panel
        </div>
      </div>

      {/* DIVIDER */}
      <div style={{ height: "1px", background: "#1a2744", marginBottom: 12 }} />

      {/* USER BADGE */}
      <div
        style={{
          margin: "0 16px 16px",
          padding: "12px 14px",
          borderRadius: 10,
          background: "#0f172a",
          border: "1px solid #1e3a5f",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: "bold",
            color: "white",
            flexShrink: 0,
          }}
        >
          {user.name ? user.name[0].toUpperCase() : "U"}
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.name || "User"}
          </div>
          <div style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.email || ""}
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: "1px", padding: "4px 8px 10px", fontWeight: 600 }}>
          Navigation
        </div>

        {menu.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                marginBottom: 4,
                borderRadius: 8,
                background: active ? "rgba(37,99,235,0.18)" : "transparent",
                border: active ? "1px solid rgba(37,99,235,0.35)" : "1px solid transparent",
                color: active ? "#60a5fa" : "#64748b",
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                transition: "all 0.15s",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }
              }}
              onMouseLeave={e => {
                if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }
              }}
            >
              <span style={{ fontSize: 16, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.name}
              {active && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    boxShadow: "0 0 6px #3b82f6",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div style={{ padding: "16px 12px" }}>
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "transparent",
            border: "1px solid #7f1d1d",
            borderRadius: 8,
            color: "#ef4444",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.12)";
            e.currentTarget.style.borderColor = "#ef4444";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#7f1d1d";
          }}
        >
          ⏻ Logout
        </button>
      </div>
    </div>
  );
}
