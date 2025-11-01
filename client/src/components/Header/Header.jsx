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

          <div className='login-btn'>
            Login ▾
            <div className="dropdown">
              <ul>
                <li><Link to="/login">Admin</Link></li>
                <li><Link to="/student/login">Student</Link></li>
                <li><Link to="/faculty/login">Faculty</Link></li>
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

          <li className='text-light'>
           Gallery ▾
            <div className="dropdown">
            <ul>
              <li><Link to="/infra">Infra</Link></li>
              <li><Link to="/event">Event</Link></li>
            </ul>
            </div>
          </li>

          <li className='text-light'>
            Performer ▾
            <div className="dropdown">
            <ul>
              <li><Link to="/performer/result">Result</Link></li>
              <li><Link to="/performer/placement">Placement</Link></li>
            </ul>
            </div>
          </li>

          <li><Link to="/notice">News&Notice</Link></li>
          <li><Link to="/career">Career</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/attdash">Attendance</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
