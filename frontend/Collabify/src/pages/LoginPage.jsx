import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url =
      mode === "login"
        ? `${API_URL}/auth/login`
        : `${API_URL}/auth/register`;

    try {
      const res = await axios.post(url, { username, password });
      onLogin(res.data.user, res.data.token);
    } catch (err) {
    console.log("LOGIN ERROR:", err.response || err.message);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", color: "#e5e7eb" }}>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
        <button
          type="button"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
        >
          {mode === "login" ? "Need an account?" : "Have an account?"}
        </button>
      </form>
    </div>
  );
}
