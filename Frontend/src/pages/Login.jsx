import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const res = await axios.post("http://localhost:4000/api/user/login", { email, password });

      if (res.data.success) {
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        if (onLogin) onLogin(res.data.user.role);
        
        if (res.data.user.role === "admin"){
          navigate("/admin");
        }
        else {
          navigate("/home");
        }
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      <div className="bg-[#121212] p-10 rounded-2xl shadow-lg w-[350px]">
        <h1 className="text-3xl font-bold mb-6 text-center">HKMusic Login</h1>

        <form onSubmit={handleLogin}>
          <label className="text-sm">Email</label>
          <input
            type="email"
            value={email}
            className="w-full p-3 rounded bg-[#1f1f1f] mt-1 mb-4 focus:outline-none"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-sm">Password</label>
          <input
            type="password"
            value={password}
            className="w-full p-3 rounded bg-[#1f1f1f] mt-1 mb-6 focus:outline-none"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit" 
            className="w-full p-3 bg-green-500 hover:bg-green-600 rounded font-bold transition-all"
          >
            Login
          </button>

          <p className="text-center mt-4 text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-400">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
