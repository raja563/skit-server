import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const CareerForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    position_applied: '',
    qualification: '',
    experience: '',
    resume: null,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const careerURL = `${import.meta.env.VITE_API_URL}/api/career/`;

    try {
      await axios.post(careerURL, data);
      toast.success('Application submitted!');
      navigate('/');
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        position_applied: '',
        qualification: '',
        experience: '',
        resume: null
      });
    } catch (err) {
      toast.error('Submission failed!');
    }
  };

  return (
    <div className="container-fluid mt-3">
      <h2 className="mb-4 text-light text-center bg-dark p-2 rounded">Apply for a Career</h2>
      <Link to='/' className='btn btn-warning mb-3'>Home</Link>

      <div className="row shadow rounded bg-white p-3">
        {/* Left side - Image */}
        <div className="col-md-6 d-flex align-items-center justify-content-center mb-3 mb-md-0">
          <img
            src='/img/career_ladder.jpg'
            alt="Career Opportunity"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '450px', objectFit: 'cover' }}
          />
        </div>

        {/* Right side - Form */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="form-control mb-2" required />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="form-control mb-2" required />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="form-control mb-2" required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control mb-2" required />
            <input name="position_applied" placeholder="Position" value={formData.position_applied} onChange={handleChange} className="form-control mb-2" required />
            <input name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} className="form-control mb-2" required />
            <input name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} className="form-control mb-2" required />
            <input type="file" onChange={handleFileChange} className="form-control mb-3" />
            <button type="submit" className="btn btn-success w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CareerForm;
