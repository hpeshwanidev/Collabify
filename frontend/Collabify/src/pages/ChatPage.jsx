import { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import SprintBoard from "../components/SprintBoard";
import Sidebar from "../components/SideBar";
import axios from "axios";

const API_URL = "http://localhost:3001";

export default function ChatPage({ user, token, onLogout }) {
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'sprint'

  // Fetch active chat details when activeChatId changes
  useEffect(() => {
    const fetchChatDetails = async () => {
      if (!activeChatId || !token) {
        setActiveChat(null);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const chat = res.data.find(c => c._id === activeChatId);
        setActiveChat(chat || null);
      } catch (e) {
        console.error("Error fetching chat details:", e);
      }
    };

    fetchChatDetails();
  }, [activeChatId, token]);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: "#020617",
        overflow: "hidden",
      }}
    >
      {/* Logout Button - Top Right */}
      <button
        onClick={onLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid #334155",
          background: "#1e293b",
          color: "#e2e8f0",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          zIndex: 100,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#334155";
          e.target.style.borderColor = "#475569";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#1e293b";
          e.target.style.borderColor = "#334155";
        }}
      >
        Logout
      </button>

      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        user={user}
      />

      {/* Main Content */}
      {activeView === 'chat' ? (
        <>
          <ChatList
            user={user}
            token={token}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
          />
          <ChatWindow
            user={user}
            token={token}
            activeChatId={activeChatId}
            activeChat={activeChat}
          />
        </>
      ) : (
        <SprintBoard user={user} token={token} />
      )}
    </div>
  );
}