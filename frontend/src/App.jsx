import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { TeacherDashboard } from "./pages/Dashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher" element={<ProtectedRoute roleRequired="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute roleRequired="student"><StudentDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}