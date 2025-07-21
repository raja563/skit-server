import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header-3d header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="left-info social-icons">
          <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
        </div>

        <div className="right-topbar">
          <Link to={'https://csjmuadm.samarth.edu.in/'} target='blank' className="admission-btn btn-glow">🎓 Register for Admission 2025-26</Link>

          <div className="login-wrapper nav-item">
            <div className="nested-list">Login ▾
              <ul className="dropdown login-dropdown nested-list-item">
                <li><Link to="/login">Admin Login</Link></li>
                <li><Link to="/student/login">Student Login</Link></li>
                <li><Link to="/faculty/login">Faculty Login</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="menu-bar menu-colored">
        <div className="logo">
          <img src="img/skit logo.png" alt="logo" />
        </div>

        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <div></div><div></div><div></div>
        </div>

        <ul className={`menu-list ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/course">Course</Link></li>
          <li><Link to="/faculty">Faculty</Link></li>

          <li className="nav-item nested-list">
            <span className="nav-link">Gallery ▾</span>
            <ul className="dropdown gallery-menu nested-list-item">
              <li><Link to="/gallery/infra">Infra</Link></li>
              <li><Link to="/gallery/event">Event</Link></li>
            </ul>
          </li>

          <li className="nav-item nested-list">
            <span className="nav-link">Performer ▾</span>
            <ul className="dropdown per-menu nested-list-item">
              <li><Link to="/performer/result">Result</Link></li>
              <li><Link to="/performer/placement">Placement</Link></li>
            </ul>
          </li>

          <li><Link to="/notice">News&Notice</Link></li>
          <li><Link to="/career">Career</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
