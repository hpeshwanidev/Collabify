export default function TaskCard({ task, onDragStart, onDelete }) {
    const priorityColors = {
      low: { bg: "#06b6d420", color: "#06b6d4" },
      medium: { bg: "#f59e0b20", color: "#f59e0b" },
      high: { bg: "#ef444420", color: "#ef4444" },
    };
  
    const priorityColor = priorityColors[task.priority] || priorityColors.medium;
  
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, task._id)}
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "8px",
          padding: "16px",
          cursor: "grab",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#3b82f6";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#334155";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Title */}
        <h4
          style={{
            margin: "0 0 8px 0",
            fontSize: "15px",
            fontWeight: "600",
            color: "#f1f5f9",
            lineHeight: "1.4",
          }}
        >
          {task.title}
        </h4>
  
        {/* Description */}
        {task.description && (
          <p
            style={{
              margin: "0 0 12px 0",
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: "1.5",
            }}
          >
            {task.description.length > 100
              ? task.description.substring(0, 100) + "..."
              : task.description}
          </p>
        )}
  
        {/* Priority Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            borderRadius: "6px",
            background: priorityColor.bg,
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: priorityColor.color,
            }}
          >
            {task.priority}
          </span>
        </div>
  
        {/* Assigned Users */}
        {task.assignedTo && task.assignedTo.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#64748b" }}>Assigned:</span>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {task.assignedTo.map((user) => (
                <div
                  key={user._id}
                  style={{
                    padding: "2px 8px",
                    borderRadius: "12px",
                    background: "#334155",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  {user.username}
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Due Date */}
        {task.dueDate && (
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            📅 Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
  
        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid #334155",
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            by {task.createdBy?.username}
          </div>
          <button
            onClick={() => onDelete(task._id)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "none",
              background: "#991b1b20",
              color: "#ef4444",
              fontSize: "11px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#991b1b40";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#991b1b20";
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }