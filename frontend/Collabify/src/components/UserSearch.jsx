import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

export default function UserSearch({ token, currentUserId, onChatCreated }) {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a username to search");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log("🔍 Searching for:", searchQuery);
      console.log("📡 Full URL:", `${API_URL}/users/search?query=${searchQuery}`);
      console.log("🔑 Token present:", token ? "YES" : "NO");
      
      const res = await axios.get(
        `${API_URL}/users/search?query=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("✅ Search response status:", res.status);
      console.log("✅ Search response data:", res.data);
      
      // Filter out current user from results
      const filtered = res.data.filter(user => user._id !== currentUserId);
      
      console.log("📊 Filtered results count:", filtered.length);
      
      if (filtered.length === 0) {
        setError(`No users found matching "${searchQuery}". Try a different username.`);
      }
      
      setSearchResults(filtered);
    } catch (e) {
      console.error("❌ Search error:", e);
      console.error("❌ Error response:", e.response);
      
      let errorMessage;
      
      if (e.response) {
        // Server responded with error
        if (e.response.status === 404) {
          errorMessage = "User search endpoint not found. Backend may need to be restarted.";
        } else if (e.response.status === 401) {
          errorMessage = "Authentication failed. Please logout and login again.";
        } else if (e.response.status === 500) {
          errorMessage = e.response.data?.message || "Server error. Check backend logs.";
        } else {
          errorMessage = e.response.data?.error || e.response.data?.message || `Error ${e.response.status}`;
        }
      } else if (e.request) {
        // Request made but no response
        errorMessage = "Cannot reach backend server. Is it running on port 3001?";
      } else {
        // Something else happened
        errorMessage = e.message || "Unknown error occurred";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.find((u) => u._id === user._id);
      if (isSelected) {
        return prev.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      setError("Please select at least one user");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userIds = selectedUsers.map((u) => u._id);
      
      const res = await axios.post(
        `${API_URL}/chats/create`,
        {
          userIds,
          isGroup: isGroup || selectedUsers.length > 1,
          name: isGroup ? groupName : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Chat created with users:", res.data);
      
      // Reset and close
      setShowModal(false);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUsers([]);
      setGroupName("");
      setIsGroup(false);
      
      if (onChatCreated) {
        onChatCreated(res.data);
      }
    } catch (e) {
      console.error("❌ Error creating chat:", e);
      setError(e.response?.data?.error || "Failed to create chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* New Chat Button */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #334155",
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#3b82f6",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#2563eb";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#3b82f6";
          }}
        >
          <span style={{ fontSize: "18px" }}>+</span>
          <span>New Chat</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
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
          onClick={() => {
            setShowModal(false);
            setError("");
            setSearchQuery("");
            setSearchResults([]);
            setSelectedUsers([]);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              margin: "20px",
              padding: "32px",
              background: "#1e293b",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: "0 0 24px 0",
                fontSize: "20px",
                fontWeight: "600",
                color: "#f1f5f9",
              }}
            >
              Start New Chat
            </h3>

            {/* Search Users */}
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
                Search Users
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
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
                  onClick={handleSearch}
                  disabled={loading}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#3b82f6",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "..." : "Search"}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
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
                  Select Users
                </label>
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    background: "#0f172a",
                  }}
                >
                  {searchResults.map((user) => {
                    const isSelected = selectedUsers.find(
                      (u) => u._id === user._id
                    );
                    return (
                      <div
                        key={user._id}
                        onClick={() => toggleUserSelection(user)}
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
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#f1f5f9",
                              fontWeight: "500",
                            }}
                          >
                            {user.username}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
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
                  Selected ({selectedUsers.length})
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {selectedUsers.map((user) => (
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
                        onClick={() => toggleUserSelection(user)}
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
              </div>
            )}

            {/* Group Chat Options */}
            {selectedUsers.length > 1 && (
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    color: "#e2e8f0",
                    fontSize: "14px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isGroup}
                    onChange={(e) => setIsGroup(e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                  <span>Create as Group Chat</span>
                </label>

                {isGroup && (
                  <input
                    type="text"
                    placeholder="Group name (optional)"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
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
                )}
              </div>
            )}

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
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                  setSearchQuery("");
                  setSearchResults([]);
                  setSelectedUsers([]);
                  setGroupName("");
                  setIsGroup(false);
                }}
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
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#334155";
                  e.target.style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#94a3b8";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChat}
                disabled={loading || selectedUsers.length === 0}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  background:
                    loading || selectedUsers.length === 0
                      ? "#334155"
                      : "#3b82f6",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor:
                    loading || selectedUsers.length === 0
                      ? "not-allowed"
                      : "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!loading && selectedUsers.length > 0) {
                    e.target.style.background = "#2563eb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && selectedUsers.length > 0) {
                    e.target.style.background = "#3b82f6";
                  }
                }}
              >
                {loading ? "Creating..." : "Create Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}