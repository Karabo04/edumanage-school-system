import { useEffect, useState } from "react";

export function Notifications({ count = 0 }) {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // WebSocket not available in Django dev server - disabled
    // For production, install Daphne: pip install daphne
    // Then update asgi.py and run: daphne -b 127.0.0.1 -p 8000 backend.asgi:application
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-2xl">
        🔔
        {count > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-3 z-50">
          <h3 className="font-semibold mb-2">Live Notifications</h3>

          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications yet</p>
          ) : (
            messages.slice(-5).reverse().map((msg, i) => (
              <div key={i} className="text-sm border-b py-2">
                {msg}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}