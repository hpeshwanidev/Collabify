import { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:3001";

export default function ChatWindow({ user, token, activeChatId, activeChat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Get chat display name
  const getChatName = () => {
    if (!activeChat) return "Chat";
    
    if (activeChat.isGroup) {
      return activeChat.name || "Group Chat";
    } else {
      const otherUser = activeChat.users?.find(u => u._id !== user?.id);
      return otherUser?.username || "Chat";
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io(API_URL);

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("newMessage", (message) => {
      console.log("📨 New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("messageError", (error) => {
      console.error("❌ Message error:", error);
      alert("Failed to send message");
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      socketRef.current?.disconnect();
    };
  }, []);

  // Join chat room when activeChatId changes
  useEffect(() => {
    if (activeChatId && socketRef.current) {
      console.log("🚪 Joining chat room:", activeChatId);
      socketRef.current.emit("joinChat", activeChatId);
    }
  }, [activeChatId]);

  // Fetch messages when chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId || !token) return;

      try {
        console.log("🔄 Fetching messages for chat:", activeChatId);
        setLoading(true);
        
        const res = await axios.get(`${API_URL}/messages/${activeChatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("✅ Messages received:", res.data);
        setMessages(res.data);
      } catch (e) {
        console.error("❌ Error fetching messages:", e.response || e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    setNewMessage("");
  }, [activeChatId, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeChatId || !user) return;

    console.log("📤 Sending message:", {
      chatId: activeChatId,
      senderId: user.id,
      content: newMessage,
    });

    socketRef.current.emit("sendMessage", {
      chatId: activeChatId,
      senderId: user.id,
      content: newMessage,
    });

    setNewMessage("");
  };

  // If no chat selected
  if (!activeChatId) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "#e2e8f0",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
            }}
          >
            💬
          </div>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            Select a chat
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              color: "#94a3b8",
            }}
          >
            Choose a conversation from the left to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        color: "#e2e8f0",
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #334155",
          background: "#1e293b",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          {getChatName().charAt(0).toUpperCase()}
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#f1f5f9",
            }}
          >
            {getChatName()}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            {activeChat?.isGroup 
              ? `${activeChat.users?.length || 0} members`
              : "Direct message"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: "#94a3b8",
              padding: "20px",
            }}
          >
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#64748b",
              padding: "40px 20px",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
            <div style={{ fontSize: "15px" }}>No messages yet</div>
            <div style={{ fontSize: "13px", marginTop: "4px" }}>
              Start the conversation!
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg) => {
              const isOwnMessage = msg.sender?._id === user?.id;
              
              return (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: "16px",
                      background: isOwnMessage ? "#3b82f6" : "#334155",
                      color: "#ffffff",
                    }}
                  >
                    {!isOwnMessage && (
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          marginBottom: "4px",
                          color: "#93c5fd",
                        }}
                      >
                        {msg.sender?.username || "Unknown"}
                      </div>
                    )}
                    <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                      {msg.content}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        marginTop: "4px",
                        color: isOwnMessage ? "#bfdbfe" : "#94a3b8",
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #334155",
          background: "#1e293b",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "24px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#e2e8f0",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#3b82f6";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#334155";
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          style={{
            padding: "12px 24px",
            borderRadius: "24px",
            border: "none",
            background: newMessage.trim() ? "#3b82f6" : "#334155",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: newMessage.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minWidth: "80px",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            if (newMessage.trim()) {
              e.target.style.background = "#2563eb";
              e.target.style.transform = "scale(1.02)";
            }
          }}
          onMouseLeave={(e) => {
            if (newMessage.trim()) {
              e.target.style.background = "#3b82f6";
              e.target.style.transform = "scale(1)";
            }
          }}
        >
          <span>Send</span>
          <span style={{ fontSize: "16px" }}>→</span>
        </button>
      </form>
    </div>
  );
}