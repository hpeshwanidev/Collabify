import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('chatAppToken');
    const savedUser = localStorage.getItem('chatAppUser');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        console.log('✅ Restored session from localStorage');
      } catch (e) {
        console.error('Failed to restore session:', e);
        localStorage.removeItem('chatAppToken');
        localStorage.removeItem('chatAppUser');
      }
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    
    // Save to localStorage
    localStorage.setItem('chatAppToken', userToken);
    localStorage.setItem('chatAppUser', JSON.stringify(userData));
    console.log('✅ Session saved to localStorage');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('chatAppToken');
    localStorage.removeItem('chatAppUser');
    console.log('👋 Logged out');
  };

  if (!user) {
    return (
      <div className="app-root">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app-root">
      <ChatPage user={user} token={token} onLogout={handleLogout} />
    </div>
  );
}

export default App;