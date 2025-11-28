import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  if (!user) {
    return (
      <div className="app-root">
        <LoginPage onLogin={(u, t) => { setUser(u); setToken(t); }} />
      </div>
    );
  }

  return (
    <div className="app-root">
      <ChatPage user={user} token={token} />
    </div>
  );
}

export default App;
