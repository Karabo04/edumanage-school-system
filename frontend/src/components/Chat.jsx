import { useEffect, useState } from "react";
import API from "../Services/api";

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !API.defaults.headers.common["Authorization"]) return;
      
      const res = await API.get("messages/");
      setMessages(Array.isArray(res.data?.results) ? res.data.results : []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("users/");
      const userList = (res.data?.results || []).map(user => ({
        id: user.id,
        name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username,
        username: user.username
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Get current username from localStorage
    const username = localStorage.getItem("username");
    if (username) {
      setCurrentUsername(username);
    }
  }, []);

  const sendMessage = async () => {
    try {
      if (!content.trim()) {
        alert("Please enter a message");
        return;
      }
      if (!receiver) {
        alert("Please select a recipient");
        return;
      }
      await API.post("messages/", { receiver: parseInt(receiver), content });
      setContent("");
      fetchMessages();
    } catch (error) {
      const errorDetail = error.response?.data?.receiver?.[0] || error.response?.data?.detail || error.message;
      console.error("Failed to send message:", errorDetail);
      alert(`Failed to send message: ${errorDetail}`);
    }
  };

  return (
    <div className="bg-white p-4 shadow mt-6">
      <h2 className="font-bold">Chat</h2>
      <div className="h-40 overflow-y-scroll border p-2 mb-2">
        {messages.map((m) => (
          <div key={m.id} className="mb-2">
            <b className="text-sm">
              {m.sender === currentUsername ? "you" : m.sender}
            </b>: <span className="text-sm">{m.content}</span>
          </div>
        ))}
      </div>
      <select 
        className="border p-2 w-full mb-1" 
        value={receiver} 
        onChange={(e) => setReceiver(e.target.value)}
      >
        <option value="">Select a recipient...</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <input 
        className="border p-2 w-full mb-2" 
        placeholder="Type your message..." 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Send</button>
    </div>
  );
}
