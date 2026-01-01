import { useState } from "react";
import api from "../services/api";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const submit = async () => {
    if (!username.trim()) return;

    const res = await api.post("/auth/login", { username });
    onLogin(res.data.user);

    localStorage.setItem("token", res.data.token);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Join Chat</h2>
      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={submit}>Enter</button>
    </div>
  );
};

export default Login;
