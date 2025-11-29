import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

export default function CreateChat({ token, onChatCreated }) {
  const [showModal, setShowModal] = useState(false);
  const [chatName, setChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateChat = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/chats`,
        { name: chatName || "New Chat" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Chat created:", res.data);
      
      // Close modal and reset
      setShowModal(false);
      setChatName("");
      
      // Notify parent component
      if (onChatCreated) {
        onChatCreated(res.data);
      }
    } catch (e) {
      console.error("❌ Error creating chat:", e);
      setError(e.response?.data?.error || "Failed to create chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Create Chat Button */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #334155",
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#3b82f6",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#2563eb";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#3b82f6";
          }}
        >
          <span style={{ fontSize: "18px" }}>+</span>
          <span>New Chat</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setShowModal(false);
            setError("");
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              margin: "20px",
              padding: "32px",
              background: "#1e293b",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: "0 0 24px 0",
                fontSize: "20px",
                fontWeight: "600",
                color: "#f1f5f9",
              }}
            >
              Create New Chat
            </h3>

            <form onSubmit={handleCreateChat}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#e2e8f0",
                  }}
                >
                  Chat Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter chat name..."
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    background: "#0f172a",
                    color: "#e2e8f0",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#334155";
                  }}
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: "12px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    background: "#991b1b20",
                    border: "1px solid #dc2626",
                    color: "#fca5a5",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setChatName("");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    background: "transparent",
                    color: "#94a3b8",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#334155";
                    e.target.style.color = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#94a3b8";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: loading ? "#334155" : "#3b82f6",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = "#2563eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = "#3b82f6";
                    }
                  }}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}