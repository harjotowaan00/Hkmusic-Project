import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/user/register", {
        name,
        email,
        password,
        role: "user", // ensure default role
      });

      if (res.data.success) {
        alert("Account created successfully! You can now log in.");
        navigate("/"); // redirect to login
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      <div className="bg-[#121212] p-10 rounded-2xl shadow-lg w-[350px]">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        <form onSubmit={handleRegister}>
          <label className="text-sm">Name</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-[#1f1f1f] mt-1 mb-4 focus:outline-none"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="text-sm">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded bg-[#1f1f1f] mt-1 mb-4 focus:outline-none"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-sm">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded bg-[#1f1f1f] mt-1 mb-6 focus:outline-none"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full p-3 bg-green-500 hover:bg-green-600 rounded font-bold transition-all"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/" className="text-green-400">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
