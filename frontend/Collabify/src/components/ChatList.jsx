import { useEffect, useState } from "react";
import axios from "axios";
console.log("RENDERING ChatList COMPONENT");
const API_URL = "http://localhost:3001";
export default function ChatList({ token, activeChatId, onSelectChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API_URL}/chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("CHATS FROM API:", res.data);
        setChats(res.data);
      } catch (e) {
        console.error("FETCH CHATS ERROR:", e.response || e.message);
      }
    };
    if (token) fetchChats();
  }, [token]);
  

  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #1e293b",
        background: "#020617",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "16px", borderBottom: "1px solid #1e293b" }}>
        <h2 style={{ margin: 0, fontSize: "18px" }}>Chats</h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {chats.length === 0 ? (
          <p style={{ color: "#6b7280", padding: "8px" }}>No chats yet</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                background:
                  activeChatId === chat._id ? "#1e293b" : "transparent",
              }}
            >
              <div style={{ fontSize: "14px" }}>
                {chat.name || "Chat"}
              </div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                {(chat.users || []).map((u) => u.username).join(", ")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
