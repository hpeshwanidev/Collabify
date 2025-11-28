import { useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage({ user, token }) {
  const [activeChatId, setActiveChatId] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "1200px",
        height: "80vh",
        background: "#020617",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      }}
    >
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
      />
    </div>
  );
}
