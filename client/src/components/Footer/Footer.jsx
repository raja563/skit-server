import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="foot-container">
        <div className="skit-learn">
          <h1>SKIT</h1>
          <h2>Learn Here.</h2>
          <h2>Lead Everywhere.</h2>
        </div>

        <div className="useful-links">
          <h2>Useful Links</h2>
          <div className="footer-list">
            <a href="/">Home</a>
            <a href="#">CSJM University</a>
            <a href="#">Result</a>
            <a href="#">Scholarship (U.P.)</a>
            <a href="#">SWAYAM Notes</a>
          </div>
        </div>

        <div className="our-service">
          <h2>Our Service</h2>
          <div className="footer-list">
            <a href="#">Course</a>
            <a href="#">Notes</a>
            <a href="#">Old Paper</a>
            <a href="#">Formats</a>
            <a href="#">Mid‑term Results</a>
          </div>
        </div>

        <div className="contact-us">
          <h2>Contact Us</h2>
          <p>Campus — Bahabalpur, Kanpur Dehat‑209310, Uttar Pradesh</p>
          <p>Phone: +91 78000 48009</p>
          <p>City Office — 1 st Floor, Krishna Dham Flat, Kakadeo, Kanpur‑208025, Uttar Pradesh</p>
          <p>Phone: +91 84003 41541</p>
          <p>Email: skitkd64@gmail.com</p>
        </div>
      </div>

      <div className="copy">
        <p>&copy; SKIT — All Rights Reserved</p>
        <p>Designed by SKIT Faculty</p>
      </div>
    </footer>
  );
};

export default Footer;
