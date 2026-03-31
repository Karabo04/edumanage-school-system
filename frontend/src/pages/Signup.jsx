import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../Services/api";

export default function Signup() {
  const [form, setForm] = useState({ 
    username: "", 
    password: "", 
    confirmPassword: "",
    role: "student" 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!form.username || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      console.log("Sending signup request:", { 
        username: form.username, 
        password: form.password, 
        role: form.role 
      });
      
      const res = await API.post("sign-up/", {
        username: form.username,
        password: form.password,
        role: form.role
      });
      
      console.log("Signup response:", res);
      
      const { token, role, username } = res.data;

      // Auto-login after successful signup
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      setAuthToken(token);

      setSuccess("Account created successfully! Redirecting...");
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(role === "teacher" ? "/teacher" : "/student");
      }, 1500);

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Create Account</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
        
        <input 
          className="border p-2 w-full mb-2" 
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} 
        />
        
        <input 
          className="border p-2 w-full mb-2" 
          type="password" 
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
        />
        
        <input 
          className="border p-2 w-full mb-2" 
          type="password" 
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
        />
        
        <select 
          className="border p-2 w-full mb-4"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        
        <button className="bg-green-500 text-white w-full p-2 mb-2 hover:bg-green-600">
          Create Account
        </button>
        
        <button 
          type="button"
          onClick={() => navigate("/")}
          className="text-blue-500 w-full p-2 hover:text-blue-700"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}