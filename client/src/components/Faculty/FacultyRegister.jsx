import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './facultyregister.css';

const FacultyRegister = () => {
  const navigate = useNavigate();

  const initialState = {
    fullname: '',
    fname: '',
    gender: '',
    dobirth: '',
    address: '',
    mobile: '',
    email: '',
    qualification: '',
    department: '',
    dojoin: '',
    password: '',
  };

  const [faculty, setFaculty] = useState(initialState);
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFaculty({ ...faculty, [name]: value });
  };

  const fileHandler = (e) => {
    const { name, files } = e.target;
    if (name === 'profile') {
      setProfile(files[0]);
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else if (name === 'resume') {
      setResume(files[0]);
    }
  };

  const registerURL = 'https://skit-backend.onrender.com/api/faculty/register/';

  const validateForm = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!faculty.fullname || !faculty.fname || !faculty.gender || !faculty.dobirth ||
        !faculty.address || !faculty.mobile || !faculty.email || !faculty.qualification ||
        !faculty.department || !faculty.dojoin || !faculty.password) {
      toast.error("All fields are required!");
      return false;
    }

    if (!emailRegex.test(faculty.email)) {
      toast.error("Invalid email format!");
      return false;
    }

    if (!mobileRegex.test(faculty.mobile)) {
      toast.error("Mobile number must be 10 digits!");
      return false;
    }

    if (faculty.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(faculty).forEach(([key, value]) => formData.append(key, value));
    if (profile) formData.append('profile', profile);
    if (resume) formData.append('resume', resume);

    try {
      const response = await axios.post(registerURL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.msg || "Faculty registered successfully!", { position: 'top-right' });
      navigate('/faculty/login');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Registration failed.", { position: 'top-right' });
    }
  };

  return (
    <div className="fluid dark">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0 faculty-card-3d">
            <div className="card-header bg-success text-white text-center  rounded-top">
              <h3 className="mb-0">Faculty Registration</h3>
            </div>
            <div className="card-body bg-secondary text-light">
              <form onSubmit={submitHandler} encType="multipart/form-data">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" name="fullname" className="form-control" placeholder="Full Name" onChange={inputHandler} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="fname" className="form-control" placeholder="Father's Name" onChange={inputHandler} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-block">Gender:</label>
                    <div className="form-check form-check-inline text-light">
                      <input className="form-check-input" type="radio" name="gender" value="Male" onChange={inputHandler} required />
                      <label className="form-check-label">Male</label>
                    </div>
                    <div className="form-check form-check-inline text-light">
                      <input className="form-check-input" type="radio" name="gender" value="Female" onChange={inputHandler} required />
                      <label className="form-check-label">Female</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of Birth:</label>
                    <input type="date" name="dobirth" className="form-control" onChange={inputHandler} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="address" className="form-control" placeholder="Address" onChange={inputHandler} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="mobile" className="form-control" placeholder="Mobile No." onChange={inputHandler} required />
                  </div>
                  <div className="col-md-6">
                    <input type="email" name="email" className="form-control" placeholder="Email" onChange={inputHandler} required />
                  </div>
                  <div className="col-md-6">
                    <input type="password" name="password" className="form-control" placeholder="Password" onChange={inputHandler} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="qualification" className="form-control" placeholder="Higher Qualification" onChange={inputHandler} required />
                  </div>
                  <div className="col-md-6">
                    <select name="department" className="form-select" onChange={inputHandler} required>
                      <option value="">Select Department</option>
                      <option value="BBA">BBA</option>
                      <option value="BCA">BCA</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of Joining:</label>
                    <input type="date" name="dojoin" className="form-control" onChange={inputHandler} required />
                  </div>

                  {/* Profile Image */}
                  <div className="col-md-6">
                    <label className="form-label">Upload Profile Image</label>
                    <input type="file" name="profile" accept="image/*" className="form-control" onChange={fileHandler} />
                    {previewUrl && (
                      <img src={previewUrl} alt="Preview" className="img-preview mt-2 rounded border" width="100" />
                    )}
                  </div>

                  {/* Resume Upload */}
                  <div className="col-md-6">
                    <label className="form-label">Upload Resume (PDF)</label>
                    <input type="file" name="resume" accept="application/pdf" className="form-control" onChange={fileHandler} />
                  </div>

                  <div className="col-12 text-center mt-1">
                    <button type="submit" className="btn btn-success w-50 shadow">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegister;
