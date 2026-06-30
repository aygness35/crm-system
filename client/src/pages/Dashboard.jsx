import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import api from "../services/api";

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{
      flex: 1, padding: "20px 24px",
      borderRadius: 12,
      background: "#0a0f1f",
      border: "1px solid #1a2744",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80,
        borderRadius: "50%",
        background: `${color}18`,
      }} />
      <div style={{ fontSize: 22, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  useEffect(() => {
    const load = async () => {
      try {
        const [custRes, taskRes] = await Promise.all([
          api.get("/customers"),
          api.get("/tasks"),
        ]);
        setCustomers(custRes.data);
        setTasks(taskRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;
  const recentCustomers = customers.slice(0, 5);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>
          {greeting}, {user.name || "User"} 👋
        </h1>
        <p style={{ color: "#475569", margin: 0, fontSize: 14 }}>
          {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        <StatCard
          label="Total Customers"
          value={loading ? "..." : customers.length}
          icon="◈"
          color="#3b82f6"
          sub="Registered in CRM"
        />
        <StatCard
          label="Tasks Done"
          value={loading ? "..." : doneTasks}
          icon="◆"
          color="#10b981"
          sub={`${pendingTasks} remaining`}
        />
        <StatCard
          label="Pending Tasks"
          value={loading ? "..." : pendingTasks}
          icon="◇"
          color="#f59e0b"
          sub="To complete"
        />
        <StatCard
          label="System"
          value="Online"
          icon="◉"
          color="#8b5cf6"
          sub="All services OK"
        />
      </div>

      {/* BOTTOM PANELS */}
      <div style={{ display: "flex", gap: 20 }}>
        {/* RECENT CUSTOMERS */}
        <div style={{
          flex: 1,
          background: "#0a0f1f",
          border: "1px solid #1a2744",
          borderRadius: 12,
          padding: "20px 24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, color: "#cbd5e1", fontSize: 15, fontWeight: 600 }}>
              Recent Customers
            </h3>
            <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer" }}>View all →</span>
          </div>

          {loading ? (
            <p style={{ color: "#334155", fontSize: 14 }}>Loading...</p>
          ) : recentCustomers.length === 0 ? (
            <p style={{ color: "#334155", fontSize: 14 }}>No customers yet.</p>
          ) : (
            recentCustomers.map((c) => (
              <div key={c._id} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid #0f172a",
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: "bold", color: "white", flexShrink: 0,
                }}>
                  {c.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 14, color: "#cbd5e1", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.company || c.email}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, color: "#10b981",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 20, padding: "2px 8px",
                }}>
                  Active
                </span>
              </div>
            ))
          )}
        </div>

        {/* TASK STATUS PANEL */}
        <div style={{
          width: 260,
          background: "#0a0f1f",
          border: "1px solid #1a2744",
          borderRadius: 12,
          padding: "20px 24px",
        }}>
          <h3 style={{ margin: "0 0 18px", color: "#cbd5e1", fontSize: 15, fontWeight: 600 }}>
            Task Overview
          </h3>

          {[
            { label: "Completed", value: doneTasks, color: "#10b981", total: tasks.length },
            { label: "Pending", value: pendingTasks, color: "#f59e0b", total: tasks.length },
          ].map((item) => {
            const pct = tasks.length ? Math.round((item.value / tasks.length) * 100) : 0;
            return (
              <div key={item.label} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: "#94a3b8" }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 600 }}>{item.value}</span>
                </div>
                <div style={{ height: 6, background: "#1a2744", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: item.color,
                    borderRadius: 3,
                    transition: "width 0.4s",
                  }} />
                </div>
                <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{pct}% of total</div>
              </div>
            );
          })}

          <div style={{
            marginTop: 24, padding: "14px",
            background: "#0d1626",
            borderRadius: 8, border: "1px solid #1e3a5f",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6" }}>{tasks.length}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Total tasks</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
