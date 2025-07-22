import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const FacultyLogin = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showReset, setShowReset] = useState(false);

const loginURL = `${import.meta.env.VITE_API_URL}/api/faculty/login/`;
const resetURL = `${import.meta.env.VITE_API_URL}/api/faculty/reset-password/`;


  const inputHandler = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!login.email || !login.password) {
      toast.error("Please fill all fields", { position: 'top-right' });
      return;
    }

    try {
      const res = await axios.post(loginURL, login);
      localStorage.setItem('facultyToken', res.data.token);
      toast.success("Login Successful!", { position: 'top-right' });
      setLogin({ email: '', password: '' }); // Clear form after login
      navigate('/facultyPortal');
    } catch (err) {
      toast.error("Invalid credentials or server error", { position: 'top-right' });
    }
  };

  const handleReset = async () => {
    if (!resetEmail || !newPassword) {
      toast.error("Please fill all reset fields", { position: 'top-right' });
      return;
    }

    try {
      const res = await axios.post(resetURL, {
        email: resetEmail,
        new_password: newPassword,
      });
      toast.success(res.data.msg || "Password reset successful", { position: 'top-right' });
      setShowReset(false);
      setResetEmail('');
      setNewPassword('');
    } catch (err) {
      toast.error("Reset failed", { position: 'top-right' });
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(to right, #2c3e50, #4ca1af)',
        padding: '30px',
      }}
    >
      <div
        className="col-sm-10 col-md-6 col-lg-4 p-4 rounded"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Link to="/" className="btn btn-warning mb-3">← Back</Link>
        <h3 className="text-center text-white mb-3">
          {showReset ? 'Reset Password' : 'Faculty Login'}
        </h3>
        <div className="line mb-3" style={{ height: '2px', background: '#ccc' }} />

        {/* 🔒 Login Form */}
        {!showReset && (
          <form onSubmit={submitHandler}>
            <div className="form-group mb-3">
              <label className="text-white">Email</label>
              <input
                type="email"
                name="email"
                className="form-control shadow-sm"
                placeholder="Enter your email"
                value={login.email}
                onChange={inputHandler}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label className="text-white">Password</label>
              <input
                type="password"
                name="password"
                className="form-control shadow-sm"
                placeholder="Enter your password"
                value={login.password}
                onChange={inputHandler}
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">Login</button>
              <Link to="/faculty/register" className="btn btn-info text-white">Register</Link>
            </div>

            <div className="text-end mt-2">
              <button
                onClick={() => setShowReset(true)}
                type="button"
                className="btn btn-link text-danger btn-sm"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {/* 🔁 Reset Password Form */}
        {showReset && (
          <div className="mt-3">
            <div className="form-group mb-3">
              <label className="text-white">Email</label>
              <input
                type="email"
                className="form-control shadow-sm"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label className="text-white">New Password</label>
              <input
                type="password"
                className="form-control shadow-sm"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button onClick={handleReset} className="btn btn-success">Submit</button>
              <button onClick={() => setShowReset(false)} className="btn btn-outline-light">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyLogin;
