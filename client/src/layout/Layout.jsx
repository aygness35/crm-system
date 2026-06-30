import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <main
        style={{
          marginLeft: "260px",
          flex: 1,
          padding: "32px",
          background: "#080d1a",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
