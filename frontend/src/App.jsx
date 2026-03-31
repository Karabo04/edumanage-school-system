import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { TeacherDashboard } from "./pages/Dashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { setAuthToken } from "./Services/api";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore token from localStorage on app load
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
    // Set loading to false after token restoration
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/teacher" element={<ProtectedRoute roleRequired="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute roleRequired="student"><StudentDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}