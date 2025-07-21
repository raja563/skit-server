import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentLogin = () => {
  const navigate = useNavigate();

  /* ── state ─────────────────────────────────────────────── */
  const [login, setLogin] = useState({
    email: '',
    dob: '',
  });

  /* ── handlers ──────────────────────────────────────────── */
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!login.email || !login.dob) {
      toast.error('Please enter both email and date of birth', { position: 'top-right' });
      return;
    }

    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/student/login/',
        login
      );

      /* Persist minimal session info */
      sessionStorage.setItem('studentEmail', login.email);
      sessionStorage.setItem('studentDOB',   login.dob);

      toast.success(data.msg, { position: 'top-right' });
      navigate('/student/portal');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Email or date of birth is incorrect', { position: 'top-right' });
      } else {
        toast.error('Something went wrong. Please try again later.', { position: 'top-right' });
        console.error(error);
      }
    }
  };

  /* ── UI ────────────────────────────────────────────────── */
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
        <Link to="/" className="btn btn-warning mb-3">← Back</Link>
        <h3 className="text-center text-white mb-3">Student Login</h3>
        <div className="line mb-3" style={{ height: '2px', background: '#ccc' }} />

        <form onSubmit={submitHandler}>
          <div className="form-group mb-3">
            <label className="text-white">Email</label>
            <input
              type="email"
              name="email"
              className="form-control shadow-sm"
              placeholder="Enter your email"
              onChange={inputHandler}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="text-white">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="form-control shadow-sm"
              onChange={inputHandler}
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            {/* The button now submits the form correctly */}
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
