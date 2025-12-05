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
    

      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        user={user}
        onLogout={onLogout}
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