import { useState, useEffect } from "react";
import axios from "axios";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";

const API_URL = "http://localhost:3001";

export default function SprintBoard({ user, token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Tasks received:", res.data);
      setTasks(res.data);
    } catch (e) {
      console.error("❌ Error fetching tasks:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
    setShowCreateModal(false);
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/tasks/${taskId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (e) {
      console.error("❌ Error updating task:", e);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (e) {
      console.error("❌ Error deleting task:", e);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    handleTaskStatusChange(taskId, newStatus);
  };

  const notStartedTasks = tasks.filter(t => t.status === 'not_started');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const finishedTasks = tasks.filter(t => t.status === 'finished');

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        color: "#e2e8f0",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid #334155",
          background: "#1e293b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 4px 0",
              fontSize: "28px",
              fontWeight: "700",
              color: "#f1f5f9",
            }}
          >
            📋 Sprint Board Planner
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#94a3b8",
            }}
          >
            Manage your tasks and track progress
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: "12px 24px",
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
          <span>Create Task</span>
        </button>
      </div>

      {/* Board Columns */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          overflowY: "auto",
        }}
      >
        {/* Not Started Column */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'not_started')}
          style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "2px solid #334155",
            }}
          >
            <span style={{ fontSize: "20px" }}>⭕</span>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: "#f1f5f9",
              }}
            >
              Not Started
            </h3>
            <span
              style={{
                marginLeft: "auto",
                padding: "2px 8px",
                borderRadius: "12px",
                background: "#334155",
                fontSize: "12px",
                fontWeight: "600",
                color: "#94a3b8",
              }}
            >
              {notStartedTasks.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {notStartedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDragStart={handleDragStart}
                onDelete={handleTaskDelete}
              />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'in_progress')}
          style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "2px solid #3b82f6",
            }}
          >
            <span style={{ fontSize: "20px" }}>🔄</span>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: "#f1f5f9",
              }}
            >
              In Progress
            </h3>
            <span
              style={{
                marginLeft: "auto",
                padding: "2px 8px",
                borderRadius: "12px",
                background: "#3b82f620",
                fontSize: "12px",
                fontWeight: "600",
                color: "#3b82f6",
              }}
            >
              {inProgressTasks.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDragStart={handleDragStart}
                onDelete={handleTaskDelete}
              />
            ))}
          </div>
        </div>

        {/* Finished Column */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'finished')}
          style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "2px solid #10b981",
            }}
          >
            <span style={{ fontSize: "20px" }}>✅</span>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "600",
                color: "#f1f5f9",
              }}
            >
              Finished
            </h3>
            <span
              style={{
                marginLeft: "auto",
                padding: "2px 8px",
                borderRadius: "12px",
                background: "#10b98120",
                fontSize: "12px",
                fontWeight: "600",
                color: "#10b981",
              }}
            >
              {finishedTasks.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {finishedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDragStart={handleDragStart}
                onDelete={handleTaskDelete}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          token={token}
          currentUser={user}
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}