import React, { useState } from 'react';
import axios from 'axios';
import './home.css';
import toast from 'react-hot-toast';

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
      await axios.post(enqPost, formData); // ✅ No auth headers

      toast.success('Submitted successfully!');
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
        className="en btn btn-dark shadow-lg rounded-4 px-4 py-2"
        onClick={() => setModelStatus(!modelStatus)}
      >
        Enquiry Now
      </button>

      <div className={`model-overlay ${modelStatus ? 'model_show' : ''}`}>
        <div
          className={`model-container shadow-lg p-4 rounded-4 bg-white border ${
            modelStatus ? 'modelShowContainer animate-scale-in' : ''
          }`}
        >
          <div className="model-btn d-flex justify-content-between align-items-center">
            <div className="heading model-hed">
              <h2 className="text-primary fw-bold">Quick Inquiry</h2>
              <div className="line bg-primary rounded-pill" style={{ height: '4px', width: '60px' }} />
            </div>
            <button className="btn btn-close" onClick={() => setModelStatus(!modelStatus)}></button>
          </div>

          <form onSubmit={handleSubmit} className="mt-3">
            <input
              type="text"
              className="form-control shadow-sm my-2"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="form-control shadow-sm my-2"
              placeholder="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              className="form-control shadow-sm my-2"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="course"
              className="form-control shadow-sm my-2"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Please Select your Course</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
            </select>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4 py-2 mt-2 shadow-sm rounded-3">
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
