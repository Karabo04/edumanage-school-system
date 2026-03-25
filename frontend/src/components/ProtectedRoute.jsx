import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  if (role !== roleRequired) return <Navigate to="/" />;

  return children;
}