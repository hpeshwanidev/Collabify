export default function ChatWindow() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(circle at top, #1e293b, #020617)",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px" }}>Select a chat</h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
          Choose a conversation from the left or start a new one
        </p>
      </div>
      <div style={{ flex: 1, padding: "16px" }}>
        {/* messages will go here */}
      </div>
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #1e293b",
        }}
      >
        {/* input will go here */}
      </div>
    </div>
  );
}
