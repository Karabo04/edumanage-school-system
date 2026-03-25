import { useEffect, useState } from "react";
import API from "../services/api";

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState("");

  const fetchMessages = async () => {
    const res = await API.get("messages/");
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    await API.post("messages/", { receiver, content });
    setContent("");
    fetchMessages();
  };

  return (
    <div className="bg-white p-4 shadow mt-6">
      <h2 className="font-bold">Chat</h2>
      <div className="h-40 overflow-y-scroll border p-2 mb-2">
        {messages.map((m) => (
          <div key={m.id}><b>{m.sender}</b>: {m.content}</div>
        ))}
      </div>
      <input className="border p-1 w-full mb-1" placeholder="Receiver ID" onChange={(e) => setReceiver(e.target.value)} />
      <input className="border p-1 w-full mb-2" placeholder="Message" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-3 py-1">Send</button>
    </div>
  );
}
