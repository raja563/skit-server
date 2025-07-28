import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const api = `${import.meta.env.VITE_API_URL}/api/register/`;

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { username, email, password, confirm_password } = form;
    if (!username || !email || !password || !confirm_password) {
      toast.error("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (password !== confirm_password) {
      toast.error("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(api, form);
      toast.success("User registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const errorData = err.response?.data;
      if (errorData && typeof errorData === "object") {
        Object.entries(errorData).forEach(([key, value]) =>
          toast.error(`${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        );
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#0f2027", minHeight: "100vh" }}>
      <div className="mx-auto p-4 rounded shadow-lg text-white" style={{ background: "#1e1e2f", maxWidth: "500px" }}>
        <h3 className="text-center bg-success p-2 rounded-pill text-white shadow mb-4">
          User Signup
        </h3>
        <form onSubmit={handleSubmit} className="text-light">
          {["username", "email", "password", "confirm_password"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label text-capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                className="form-control bg-dark text-white border-info shadow-sm"
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.replace("_", " ")}`}
              />
            </div>
          ))}
          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-success">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
