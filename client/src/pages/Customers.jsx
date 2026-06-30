import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import api from "../services/api";

const inputStyle = {
  width: "100%", padding: "10px 12px",
  borderRadius: 8, border: "1px solid #1e3a5f",
  background: "#0d1626", color: "#e2e8f0",
  fontSize: 14, boxSizing: "border-box",
};

const btnPrimary = {
  padding: "10px 20px",
  borderRadius: 8, border: "none",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer",
  boxShadow: "0 2px 10px rgba(37,99,235,0.25)",
};

const btnDanger = {
  padding: "7px 14px",
  borderRadius: 6, border: "1px solid #7f1d1d",
  background: "transparent", color: "#ef4444",
  fontWeight: 500, fontSize: 13, cursor: "pointer",
};

const btnEdit = {
  padding: "7px 14px",
  borderRadius: 6, border: "1px solid #1e3a5f",
  background: "transparent", color: "#60a5fa",
  fontWeight: 500, fontSize: 13, cursor: "pointer", marginRight: 8,
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [addError, setAddError] = useState("");

  // Edit modal
  const [editCustomer, setEditCustomer] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCompany, setEditCompany] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const addCustomer = async () => {
    setAddError("");
    if (!name || !email) {
      setAddError("Name and email are required.");
      return;
    }
    try {
      await api.post("/customers", { name, email, phone, company });
      setName(""); setEmail(""); setPhone(""); setCompany("");
      fetchCustomers();
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add customer.");
    }
  };

  const deleteCustomer = async (id) => {
    if (!confirm("Delete this customer?")) return;
    await api.delete(`/customers/${id}`);
    fetchCustomers();
  };

  const openEdit = (c) => {
    setEditCustomer(c);
    setEditName(c.name); setEditEmail(c.email);
    setEditPhone(c.phone || ""); setEditCompany(c.company || "");
  };

  const saveEdit = async () => {
    try {
      await api.put(`/customers/${editCustomer._id}`, {
        name: editName, email: editEmail,
        phone: editPhone, company: editCompany,
      });
      setEditCustomer(null);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed.");
    }
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>Customers</h1>
          <p style={{ color: "#475569", margin: 0, fontSize: 14 }}>{customers.length} total customers</p>
        </div>
      </div>

      {/* ADD FORM */}
      <div style={{
        background: "#0a0f1f", border: "1px solid #1a2744",
        borderRadius: 12, padding: "20px 24px", marginBottom: 24,
      }}>
        <h3 style={{ margin: "0 0 16px", color: "#94a3b8", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Add New Customer
        </h3>
        {addError && (
          <div style={{
            padding: "10px 14px", background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8,
            color: "#f87171", fontSize: 13, marginBottom: 14,
          }}>
            {addError}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          {[
            { placeholder: "Full name *", value: name, setValue: setName },
            { placeholder: "Email address *", value: email, setValue: setEmail },
            { placeholder: "Phone", value: phone, setValue: setPhone },
            { placeholder: "Company", value: company, setValue: setCompany },
          ].map((f) => (
            <div key={f.placeholder}>
              <input
                placeholder={f.placeholder}
                value={f.value}
                onChange={(e) => f.setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomer()}
                style={inputStyle}
              />
            </div>
          ))}
          <button onClick={addCustomer} style={btnPrimary}>
            + Add
          </button>
        </div>
      </div>

      {/* SEARCH + TABLE */}
      <div style={{
        background: "#0a0f1f", border: "1px solid #1a2744",
        borderRadius: 12, overflow: "hidden",
      }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #1a2744", display: "flex", gap: 12 }}>
          <input
            placeholder="Search by name, email or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: 320 }}
          />
        </div>

        {/* TABLE HEADER */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 120px",
          padding: "12px 24px", borderBottom: "1px solid #1a2744",
          fontSize: 11, color: "#334155", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600,
        }}>
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Company</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {/* TABLE ROWS */}
        {loading ? (
          <div style={{ padding: "40px 24px", color: "#334155", textAlign: "center" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "40px 24px", color: "#334155", textAlign: "center" }}>
            {search ? "No results found." : "No customers yet. Add one above."}
          </div>
        ) : (
          filtered.map((c, i) => (
            <div key={c._id} style={{
              display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 120px",
              padding: "14px 24px",
              borderBottom: i < filtered.length - 1 ? "1px solid #0d1626" : "none",
              alignItems: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: "bold", color: "white", flexShrink: 0,
                }}>
                  {c.name[0].toUpperCase()}
                </div>
                <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>{c.name}</span>
              </div>
              <span style={{ color: "#64748b", fontSize: 14 }}>{c.email}</span>
              <span style={{ color: "#64748b", fontSize: 14 }}>{c.phone || "—"}</span>
              <span style={{ color: "#64748b", fontSize: 14 }}>{c.company || "—"}</span>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => openEdit(c)} style={btnEdit}>Edit</button>
                <button onClick={() => deleteCustomer(c._id)} style={btnDanger}>Del</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editCustomer && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            width: 440, padding: "28px",
            background: "#0a0f1f",
            border: "1px solid #1a2744",
            borderRadius: 14,
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}>
            <h3 style={{ margin: "0 0 20px", color: "#f1f5f9", fontSize: 16, fontWeight: 700 }}>
              Edit Customer
            </h3>

            {[
              { label: "Full name", value: editName, setValue: setEditName },
              { label: "Email", value: editEmail, setValue: setEditEmail },
              { label: "Phone", value: editPhone, setValue: setEditPhone },
              { label: "Company", value: editCompany, setValue: setEditCompany },
            ].map((f) => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 5, fontWeight: 500 }}>
                  {f.label}
                </label>
                <input
                  value={f.value}
                  onChange={(e) => f.setValue(e.target.value)}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={saveEdit} style={{ ...btnPrimary, flex: 1 }}>Save Changes</button>
              <button
                onClick={() => setEditCustomer(null)}
                style={{
                  padding: "10px 20px", borderRadius: 8,
                  border: "1px solid #1e3a5f", background: "transparent",
                  color: "#64748b", cursor: "pointer", fontSize: 14,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
