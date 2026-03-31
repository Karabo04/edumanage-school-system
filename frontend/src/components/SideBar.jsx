import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../Services/api";

export function Sidebar({ role }) {
  const [active, setActive] = useState("");
  const navigate = useNavigate();

  const teacherLinks = [
    "Classes",
    "Attendance",
    "Chat",
  ];

  const studentLinks = [
    "Results",
    "Fees",
    "Chat",
  ];

  const links = role === "teacher" ? teacherLinks : studentLinks;

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthToken(null);
    
    // Navigate back to login
    navigate("/");
  };

  return (
    <div className="w-60 min-h-screen bg-gray-900 text-white p-5 flex flex-col">
      
      {/* Logo / Title */}
      <h2 className="text-2xl font-bold mb-8">
        {role === "teacher" ? "Teacher Panel" : "Student Panel"}
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {links.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`text-left px-3 py-2 rounded-lg transition ${
              active === item
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition mb-4"
        >
          Logout
        </button>
        
        {/* Footer */}
        <div className="text-xs text-gray-400">
          © School System
        </div>
      </div>
    </div>
  );
}