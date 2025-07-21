import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginSignup = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    username: '',
    password: '',
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/login/', login);
      toast.success(response.data.msg, { position: "top-right" });
      navigate('/dashboard');
    } catch (error) {
      toast.error("Login failed. Please check your credentials.", { position: "top-right" });
      console.error(error);
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
        <h3 className="text-center text-light mb-3">Admin Login</h3>
        <div className="line mb-3" style={{ height: '2px', background: '#ddd' }}></div>

        <form onSubmit={submitHandler}>
          <div className="form-group mb-3">
            <label htmlFor="username" className="text-white">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              className="form-control shadow-sm"
              autoComplete="off"
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
              autoComplete="off"
              onChange={inputHandler}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-block shadow">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
