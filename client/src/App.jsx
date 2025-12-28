import { useState } from "react";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;
  return <ChatRoom user={user} />;
}

export default App;
