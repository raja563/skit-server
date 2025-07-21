import React, { useState } from 'react';
import './darkslider.css';
import data from '../data/student.json';

const DarkSlider = () => {
  const [next, setNext] = useState(0);

  const handlePrev = () => {
    setNext(prev => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setNext(prev => (prev === data.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="slide-container">
      <div className="slide-box">
        <div className="heading">
          <h2>Success Stories</h2>
          <div className="line"></div>
        </div>

        <div className="slide-text fade-animate">
          <div className="slide-img hover-tilt">
            <img src={data[next].image} alt="" />
          </div>
          <div className="content">
            <p className="text">{data[next].des}</p>
            <p className="name">{data[next].name} - {data[next].course}</p>
            <p className="company">Placed at - {data[next].placed}</p>
          </div>
        </div>

        <div className="slide-btn">
          <button className="prev" onClick={handlePrev}>&gt;</button>
          <button className="next" onClick={handleNext}>&lt;</button>
        </div>
      </div>
    </div>
  );
};

export default DarkSlider;
