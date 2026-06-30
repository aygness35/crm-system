import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | todo | done

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await api.post("/tasks", { title: title.trim() });
      setTasks([res.data, ...tasks]);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await api.put(`/tasks/${id}`);
      setTasks(tasks.map((t) => t._id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = tasks.filter((t) => {
    if (filter === "todo") return t.status === "todo";
    if (filter === "done") return t.status === "done";
    return true;
  });

  const done = tasks.filter((t) => t.status === "done").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const filterBtn = (val, label) => (
    <button
      onClick={() => setFilter(val)}
      style={{
        padding: "7px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer",
        border: filter === val ? "1px solid #2563eb" : "1px solid #1a2744",
        background: filter === val ? "rgba(37,99,235,0.15)" : "transparent",
        color: filter === val ? "#60a5fa" : "#475569",
      }}
    >
      {label}
    </button>
  );

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>Tasks</h1>
          <p style={{ color: "#475569", margin: 0, fontSize: 14 }}>{tasks.length} total · {done} done · {todo} pending</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* MAIN TASK LIST */}
        <div style={{ flex: 1 }}>
          {/* ADD INPUT */}
          <div style={{
            display: "flex", gap: 10, marginBottom: 20,
            padding: "16px 20px",
            background: "#0a0f1f", border: "1px solid #1a2744", borderRadius: 12,
          }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a new task... (press Enter)"
              style={{
                flex: 1, padding: "10px 14px",
                borderRadius: 8, border: "1px solid #1e3a5f",
                background: "#0d1626", color: "#e2e8f0",
                fontSize: 14,
              }}
            />
            <button
              onClick={addTask}
              style={{
                padding: "10px 20px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}
            >
              + Add
            </button>
          </div>

          {/* FILTER BAR */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {filterBtn("all", `All (${tasks.length})`)}
            {filterBtn("todo", `To Do (${todo})`)}
            {filterBtn("done", `Done (${done})`)}
          </div>

          {/* TASKS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#334155" }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{
                padding: "48px 24px", textAlign: "center",
                background: "#0a0f1f", border: "1px solid #1a2744",
                borderRadius: 12, color: "#334155",
              }}>
                {filter === "all" ? "No tasks yet. Add one above!" : "No tasks in this category."}
              </div>
            ) : (
              filtered.map((t) => (
                <div key={t._id} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 18px",
                  borderRadius: 10,
                  background: t.status === "done" ? "rgba(16,185,129,0.04)" : "#0a0f1f",
                  border: t.status === "done" ? "1px solid rgba(16,185,129,0.15)" : "1px solid #1a2744",
                  transition: "all 0.15s",
                }}>
                  {/* CHECKBOX */}
                  <div
                    onClick={() => toggleTask(t._id)}
                    style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      border: t.status === "done" ? "none" : "2px solid #334155",
                      background: t.status === "done" ? "#10b981" : "transparent",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {t.status === "done" && (
                      <span style={{ color: "white", fontSize: 12, lineHeight: 1 }}>✓</span>
                    )}
                  </div>

                  {/* TITLE */}
                  <span style={{
                    flex: 1, fontSize: 14,
                    color: t.status === "done" ? "#4b5563" : "#e2e8f0",
                    textDecoration: t.status === "done" ? "line-through" : "none",
                  }}>
                    {t.title}
                  </span>

                  {/* STATUS BADGE */}
                  {t.status === "done" ? (
                    <span style={{
                      fontSize: 11, color: "#10b981",
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      borderRadius: 20, padding: "2px 10px", fontWeight: 500,
                    }}>
                      Done
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 11, color: "#f59e0b",
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: 20, padding: "2px 10px", fontWeight: 500,
                    }}>
                      To Do
                    </span>
                  )}

                  {/* DELETE */}
                  <button
                    onClick={() => deleteTask(t._id)}
                    style={{
                      padding: "5px 12px", borderRadius: 6,
                      border: "1px solid #7f1d1d",
                      background: "transparent", color: "#ef4444",
                      fontSize: 12, cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SIDEBAR SUMMARY */}
        <div style={{ width: 220 }}>
          <div style={{
            background: "#0a0f1f", border: "1px solid #1a2744",
            borderRadius: 12, padding: "20px", marginBottom: 16,
          }}>
            <h4 style={{ margin: "0 0 14px", color: "#94a3b8", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Progress
            </h4>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#3b82f6" }}>{pct}%</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Completed</div>
            </div>
            <div style={{ height: 8, background: "#1a2744", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${pct}%`,
                background: "linear-gradient(90deg, #2563eb, #10b981)",
                borderRadius: 4, transition: "width 0.5s",
              }} />
            </div>
          </div>

          <div style={{
            background: "#0a0f1f", border: "1px solid #1a2744",
            borderRadius: 12, padding: "16px 20px",
          }}>
            {[
              { label: "Total", value: tasks.length, color: "#94a3b8" },
              { label: "Done", value: done, color: "#10b981" },
              { label: "To Do", value: todo, color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: s.label !== "To Do" ? "1px solid #0d1626" : "none",
              }}>
                <span style={{ fontSize: 13, color: "#475569" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
