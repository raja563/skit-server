import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState({ username: '', password: '' });
  const [resetForm, setResetForm] = useState({
    email: '',
    new_password: '',
    confirm_password: '',
  });
  const [showReset, setShowReset] = useState(false);

  const loginURL = `${import.meta.env.VITE_API_URL}/api/login/`;
  const forgotURL = `${import.meta.env.VITE_API_URL}/api/users/forget-password/`;

  // Clear old token if user visits login page
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    if (showReset) {
      setResetForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setLogin((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!login.username || !login.password) {
      toast.error("Please fill all fields", { position: 'top-right' });
      return;
    }

    try {
      const res = await axios.post(loginURL, login);
      const { token, user_id, username } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);

      axios.defaults.headers.common['Authorization'] = `Token ${token}`;

      toast.success("Login successful", { position: 'top-right' });

      setLogin({ username: '', password: '' });

      // navigate('/dashboard');
      navigate('/attdash');

    } catch (error) {
      const errData = error.response?.data;
      const errMsg =
        (errData?.non_field_errors && errData.non_field_errors[0]) ||
        errData?.detail ||
        Object.values(errData || {})[0] ||
        "Login failed";

      toast.error(errMsg, { position: 'top-right' });
    }
  };

  const handleForgotPassword = async () => {
    const { email, new_password, confirm_password } = resetForm;

    if (!email || !new_password || !confirm_password) {
      toast.error("Please fill all fields", { position: 'top-right' });
      return;
    }

    if (new_password !== confirm_password) {
      toast.error("Passwords do not match", { position: 'top-right' });
      return;
    }

    try {
      const res = await axios.post(forgotURL, resetForm);
      toast.success(res.data.message || "Password reset successful", { position: 'top-right' });

      setResetForm({ email: '', new_password: '', confirm_password: '' });
      setShowReset(false);
    } catch (error) {
      const errData = error.response?.data;
      const errMsg =
        errData?.error ||
        errData?.detail ||
        "Failed to reset password";

      toast.error(errMsg, { position: 'top-right' });
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
        padding: '30px',
        overflow: 'hidden'
      }}
    >
      <div
        className="col-sm-10 col-md-6 col-lg-4 p-4 rounded"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          color: '#fff'
        }}
      >
        <Link to="/" className="btn btn-warning mb-3">← Back</Link>
        <h3 className="text-center text-light mb-3">
          {showReset ? 'Reset Password' : 'Admin Login'}
        </h3>
        <div className="line mb-3" style={{ height: '2px', background: '#ddd' }}></div>

        {!showReset ? (
          <form onSubmit={submitHandler}>
            <div className="form-group mb-3">
              <label htmlFor="username" className="text-white">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                className="form-control shadow-sm"
                value={login.username}
                onChange={inputHandler}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password" className="text-white">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="form-control shadow-sm"
                value={login.password}
                onChange={inputHandler}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary shadow">Login</button>
            </div>

            <div className="text-end mt-2">
              <button
                type="button"
                className="btn btn-link text-light btn-sm"
                onClick={() => setShowReset(true)}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="form-group mb-3">
              <label htmlFor="email" className="text-white">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your registered email"
                className="form-control shadow-sm"
                value={resetForm.email}
                onChange={inputHandler}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="text-white">New Password</label>
              <input
                type="password"
                name="new_password"
                placeholder="Enter new password"
                className="form-control shadow-sm"
                value={resetForm.new_password}
                onChange={inputHandler}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label className="text-white">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm new password"
                className="form-control shadow-sm"
                value={resetForm.confirm_password}
                onChange={inputHandler}
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-success" onClick={handleForgotPassword}>
                Reset Password
              </button>
              <button type="button" className="btn btn-outline-light" onClick={() => setShowReset(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
