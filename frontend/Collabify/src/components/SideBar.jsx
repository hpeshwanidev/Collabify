import { useState, useRef, useEffect } from "react";

export default function Sidebar({ activeView, onViewChange, user, onLogout }) {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    };

    if (showLogoutMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogoutMenu]);

  return (
    <div
      style={{
        width: "70px",
        minWidth: "70px",
        background: "#020617",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        paddingBottom: "20px",
        position: "relative",
      }}
    >
      {/* Chat Icon */}
      <div
        onClick={() => onViewChange('chat')}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "12px",
          background: activeView === 'chat' ? "#3b82f6" : "#1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginBottom: "12px",
          transition: "all 0.2s ease",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (activeView !== 'chat') {
            e.currentTarget.style.background = "#334155";
          }
        }}
        onMouseLeave={(e) => {
          if (activeView !== 'chat') {
            e.currentTarget.style.background = "#1e293b";
          }
        }}
        title="Messages"
      >
        <span style={{ fontSize: "24px" }}>💬</span>
      </div>

      {/* Sprint Board Icon */}
      <div
        onClick={() => onViewChange('sprint')}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "12px",
          background: activeView === 'sprint' ? "#3b82f6" : "#1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginBottom: "12px",
          transition: "all 0.2s ease",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (activeView !== 'sprint') {
            e.currentTarget.style.background = "#334155";
          }
        }}
        onMouseLeave={(e) => {
          if (activeView !== 'sprint') {
            e.currentTarget.style.background = "#1e293b";
          }
        }}
        title="Sprint Board"
      >
        <span style={{ fontSize: "24px" }}>📋</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User Avatar with Logout Menu */}
      <div ref={menuRef} style={{ position: "relative" }}>
        <div
          onClick={() => setShowLogoutMenu(!showLogoutMenu)}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          title={user?.username}
        >
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>

        {/* Logout Popup Menu */}
        {showLogoutMenu && (
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: "10px",
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
              padding: "8px",
              minWidth: "160px",
              zIndex: 1000,
              animation: "fadeIn 0.2s ease",
            }}
          >
            {/* User Info */}
            <div
              style={{
                padding: "12px",
                borderBottom: "1px solid #334155",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#f1f5f9",
                  marginBottom: "2px",
                }}
              >
                {user?.username}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                {user?.email}
              </div>
            </div>

            {/* Logout Button */}
            <div
              onClick={() => {
                setShowLogoutMenu(false);
                onLogout();
              }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#f87171",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#991b1b20";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "16px" }}>🚪</span>
              <span style={{ fontWeight: "500" }}>Logout</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}