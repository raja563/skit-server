import React, { useState } from 'react';
import axios from 'axios';
import './home.css';
import toast from 'react-hot-toast'

const QuickEnquiry = () => {
  const [modelStatus, setModelStatus] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    course: '',
  });

  let enqPost = `${import.meta.env.VITE_API_URL}/api/quickenq/`;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(enqPost, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('submitted successfully!');
      setFormData({ name: '', mobile: '', email: '', course: '' });
      setModelStatus(false);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="model">
      <button
        className="en btn btn-dark"
        onClick={() => setModelStatus(!modelStatus)}
      >
        Enquiry Now
      </button>

      <div className={`model-overlay ${modelStatus ? 'model_show' : ''}`}>
        <div className={`model-container ${modelStatus ? 'modelShowContainer' : ''}`}>
          <div className="model-btn">
            <div className="heading model-hed">
              <h2>Quick Inquiry</h2>
              <div className="line" />
            </div>
            <button onClick={() => setModelStatus(!modelStatus)}>&times;</button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="course"
              className="form-control"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Please Select your Course</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
            </select>
            <div className="text-center">
              <button type="submit" className="btn btn-primary m-1">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickEnquiry;
