import { useEffect, useState } from "react";
import axios from "axios";
import UserSearch from "./UserSearch";

const API_URL = "http://localhost:3001";

export default function ChatList({ user, token, activeChatId, onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingChatId, setDeletingChatId] = useState(null);

  useEffect(() => {
    fetchChats();
  }, [token]);

  const fetchChats = async () => {
    if (!token) {
      console.log("❌ No token available");
      return;
    }

    try {
      console.log("🔄 Fetching chats...");
      setLoading(true);
      
      const res = await axios.get(`${API_URL}/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("✅ CHATS RECEIVED:", res.data);
      console.log("📊 Number of chats:", res.data.length);
      
      setChats(res.data);
    } catch (e) {
      console.error("❌ FETCH CHATS ERROR:");
      console.error("Response:", e.response?.data);
      console.error("Status:", e.response?.status);
      console.error("Message:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatCreated = (newChat) => {
    console.log("🎉 New chat created:", newChat);
    fetchChats(); // Refresh the chat list
    onSelectChat(newChat._id); // Auto-select the new chat
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete

    if (!window.confirm('Are you sure you want to delete this chat? All messages will be permanently deleted.')) {
      return;
    }

    try {
      setDeletingChatId(chatId);
      console.log("🗑️ Deleting chat:", chatId);

      await axios.delete(`${API_URL}/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Chat deleted successfully");

      // Remove chat from local state
      setChats(chats.filter(chat => chat._id !== chatId));

      // If deleted chat was active, clear selection
      if (activeChatId === chatId) {
        onSelectChat(null);
      }
    } catch (e) {
      console.error("❌ Error deleting chat:", e);
      alert(e.response?.data?.error || "Failed to delete chat");
    } finally {
      setDeletingChatId(null);
    }
  };

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        borderRight: "1px solid #334155",
        background: "#0f172a",
        color: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #334155",
          background: "#1e293b",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
            color: "#f1f5f9",
          }}
        >
          Messages
        </h2>
      </div>

      {/* Create Chat Button */}
      <UserSearch 
        token={token} 
        currentUserId={user?.id}
        onChatCreated={handleChatCreated} 
      />

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            Loading chats...
          </div>
        ) : chats.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              No chats yet
            </div>
            <div style={{ fontSize: "12px" }}>
              Start a conversation to get started
            </div>
          </div>
        ) : (
          chats.map((chat) => {
            // Determine chat display name
            let chatName;
            if (chat.isGroup) {
              chatName = chat.name || "Group Chat";
            } else {
              // For direct chats, show the other user's name
              const otherUser = chat.users?.find(u => u._id !== user?.id);
              chatName = otherUser?.username || "Unknown User";
            }

            const isDeleting = deletingChatId === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  if (!isDeleting) {
                    console.log("📱 Selected chat:", chat._id);
                    onSelectChat(chat._id);
                  }
                }}
                style={{
                  padding: "16px 20px",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  background:
                    activeChatId === chat._id ? "#1e293b" : "transparent",
                  borderBottom: "1px solid #1e293b",
                  transition: "background 0.2s ease",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: isDeleting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (activeChatId !== chat._id && !isDeleting) {
                    e.currentTarget.style.background = "#1e293b50";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeChatId !== chat._id && !isDeleting) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "500",
                      color: "#f1f5f9",
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chatName}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#94a3b8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.latestMessage?.content || "No messages yet"}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                  disabled={isDeleting}
                  style={{
                    marginLeft: "12px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#991b1b20",
                    color: "#ef4444",
                    fontSize: "12px",
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeleting) {
                      e.target.style.background = "#991b1b40";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDeleting) {
                      e.target.style.background = "#991b1b20";
                    }
                  }}
                >
                  {isDeleting ? "..." : "🗑️"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}