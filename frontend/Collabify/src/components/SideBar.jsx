export default function Sidebar({ activeView, onViewChange, user }) {
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
  
        {/* User Avatar */}
        <div
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
          }}
          title={user?.username}
        >
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    );
  }