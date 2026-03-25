import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post("login/", form);
    const token = res.data.token;

    localStorage.setItem("token", token);
    setAuthToken(token);

    const userRes = await API.get("user-profile/");
    const role = userRes.data.role;

    localStorage.setItem("role", role);
    navigate(role === "teacher" ? "/teacher" : "/student");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input className="border p-2 w-full mb-2" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-blue-500 text-white w-full p-2">Login</button>
      </form>
    </div>
  );
}
