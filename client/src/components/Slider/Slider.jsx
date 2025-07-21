import React, { useEffect, useRef, useState } from "react";
import "./slider.css";
import data from "../data/slider.json";

const Slider = () => {
  const [next, setNext] = useState(0);
  const [fade, setFade] = useState(true);
  const timer = useRef(null);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setNext(prev => (prev === 0 ? data.length - 1 : prev - 1));
      setFade(true);
    }, 200);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setNext(prev => (prev === data.length - 1 ? 0 : prev + 1));
      setFade(true);
    }, 200);
  };

  useEffect(() => {
    timer.current = setInterval(handleNext, 3000);
    return () => clearInterval(timer.current);
  }, []);

  const pause = () => clearInterval(timer.current);
  const resume = () => {
    timer.current = setInterval(handleNext, 3000);
  };

  return (
    <div
      className="slider-contaienr"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="slide-box">
        <img
          src={data[next].download_url}
          alt="slide"
          className={`slider-image ${fade ? "fade-in" : "fade-out"}`}
        />
      </div>

      <button className="nav-btn left" onClick={handlePrev}>
        &lt;
      </button>
      <button className="nav-btn right" onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};

export default Slider;
