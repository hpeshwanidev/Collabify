import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

export default function CreateTaskModal({ token, currentUser, onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await axios.get(
        `${API_URL}/users/search?query=${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(res.data.filter(u => u._id !== currentUser?.id));
    } catch (e) {
      console.error("Error searching users:", e);
    }
  };

  const toggleUser = (user) => {
    setAssignedUsers((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      if (exists) {
        return prev.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_URL}/tasks`,
        {
          title,
          description,
          priority,
          dueDate: dueDate || undefined,
          assignedTo: assignedUsers.map(u => u._id),
          team: assignedUsers.map(u => u._id),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onTaskCreated(res.data);
    } catch (e) {
      console.error("Error creating task:", e);
      setError(e.response?.data?.error || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "20px",
          padding: "32px",
          background: "#1e293b",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 24px 0",
            fontSize: "24px",
            fontWeight: "600",
            color: "#f1f5f9",
          }}
        >
          Create New Task
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#e2e8f0",
              }}
            >
              Task Title *
            </label>
            <input
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#e2e8f0",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#e2e8f0",
              }}
            >
              Description
            </label>
            <textarea
              placeholder="Add task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#e2e8f0",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Priority and Due Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#e2e8f0",
                }}
              >
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#e2e8f0",
                }}
              >
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Assign Users */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#e2e8f0",
              }}
            >
              Assign to Team Members
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={handleSearch}
                style={{
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#3b82f6",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  background: "#0f172a",
                  marginBottom: "12px",
                }}
              >
                {searchResults.map((user) => {
                  const isSelected = assignedUsers.find(u => u._id === user._id);
                  return (
                    <div
                      key={user._id}
                      onClick={() => toggleUser(user)}
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        background: isSelected ? "#334155" : "transparent",
                        borderBottom: "1px solid #1e293b",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: "2px solid #3b82f6",
                          background: isSelected ? "#3b82f6" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          fontSize: "12px",
                        }}
                      >
                        {isSelected && "✓"}
                      </div>
                      <span style={{ fontSize: "14px", color: "#f1f5f9" }}>
                        {user.username}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected Users */}
            {assignedUsers.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {assignedUsers.map((user) => (
                  <div
                    key={user._id}
                    style={{
                      padding: "6px 12px",
                      background: "#334155",
                      borderRadius: "16px",
                      fontSize: "13px",
                      color: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{user.username}</span>
                    <span
                      onClick={() => toggleUser(user)}
                      style={{
                        cursor: "pointer",
                        color: "#94a3b8",
                        fontWeight: "bold",
                      }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "8px",
                background: "#991b1b20",
                border: "1px solid #dc2626",
                color: "#fca5a5",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "transparent",
                color: "#94a3b8",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: loading ? "#334155" : "#3b82f6",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}