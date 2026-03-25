import { useState } from "react";

export function Sidebar({ role }) {
  const [active, setActive] = useState("");

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

      {/* Footer */}
      <div className="mt-auto text-xs text-gray-400">
        © School System
      </div>
    </div>
  );
}