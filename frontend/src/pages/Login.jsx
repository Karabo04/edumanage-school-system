import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../Services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Sending login request:", form);
      const res = await API.post("login/", form);
      console.log("Login response:", res);
      
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setAuthToken(token);

      navigate(role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        <input 
          className="border p-2 w-full mb-2" 
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} 
        />
        <input 
          className="border p-2 w-full mb-4" 
          type="password" 
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
        />
        <button className="bg-blue-500 text-white w-full p-2">Login</button>
        <p className="text-sm text-gray-500 mt-4">Test: teacher1 / password123</p>
      </form>
    </div>
  );
}
