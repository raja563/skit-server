import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

const StudentSignup = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit mode

  const registerURL = 'http://127.0.0.1:8000/api/student/';
  const fetchURL = `http://127.0.0.1:8000/api/student/${id}/`;

  const initialStudent = {
    session: '',
    course: '',
    name: '',
    father: '',
    gender: '',
    dob: '',
    address: '',
    mobile: '',
    email: '',
    image: '',
    sign: ''
  };

  const [student, setStudent] = useState(initialStudent);

  useEffect(() => {
    if (id) {
      axios.get(fetchURL).then(res => {
        const data = res.data;
        setStudent({
          session: data.session,
          course: data.course,
          name: data.name,
          father: data.father,
          gender: data.gender,
          dob: data.dob,
          address: data.address,
          mobile: data.mobile,
          email: data.email,
          image: '',
          sign: ''
        });
      });
    }
  }, [id]);

  const inputHandler = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (name === 'image' && file.size > 200 * 1024) {
        toast.error("Profile image must be less than 200 KB", { position: "top-center" });
        return;
      }
      if (name === 'sign' && file.size > 100 * 1024) {
        toast.error("Signature must be less than 100 KB", { position: "top-center" });
        return;
      }
      setStudent({ ...student, [name]: file });
    } else {
      setStudent({ ...student, [name]: value });
    }
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidMobile = (mobile) =>
    /^[6-9]\d{9}$/.test(mobile);

  const isValidSession = (session) =>
    /^\d{4}-\d{2}$/.test(session);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name, father, dob, address, mobile, email,
      course, session
    } = student;

    if (!name || !father || !dob || !address || !mobile || !email || !course || !session) {
      toast.error("Please fill all the required fields!", { position: "top-center" });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format!", { position: "top-center" });
      return;
    }

    if (!isValidMobile(mobile)) {
      toast.error("Mobile must be a 10-digit valid Indian number", { position: "top-center" });
      return;
    }

    if (!isValidSession(session)) {
      toast.error("Session must be in format YYYY-YY (e.g., 2025-26)", { position: "top-center" });
      return;
    }

    const formData = new FormData();
    for (let key in student) {
      if (student[key]) formData.append(key, student[key]);
    }

    try {
      if (id) {
        await axios.patch(fetchURL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Student updated successfully!", { position: "top-right" });
      } else {
        await axios.post(registerURL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Registered successfully!", { position: "top-right" });
      }

      navigate('/fees');
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again!", { position: "top-right" });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center">
              <h3 className="mb-0">{id ? 'Edit Student' : 'Student Registration'}</h3>
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" name="name" className="form-control" value={student.name} placeholder="Full Name" onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="father" className="form-control" value={student.father} placeholder="Father's Name" onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-block">Gender:</label>
                    <div className="form-check form-check-inline">
                      <input type="radio" className="form-check-input" name="gender" value="male" checked={student.gender === 'male'} onChange={inputHandler} />
                      <label className="form-check-label">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input type="radio" className="form-check-input" name="gender" value="female" checked={student.gender === 'female'} onChange={inputHandler} />
                      <label className="form-check-label">Female</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Date of Birth:</label>
                    <input type="date" name="dob" className="form-control" value={student.dob} onChange={inputHandler} />
                  </div>

                  <div className="col-md-6">
                    <input type="text" name="address" className="form-control" value={student.address} placeholder="Address" onChange={inputHandler} />
                  </div>

                  <div className="col-md-6">
                    <input type="email" name="email" className="form-control" value={student.email} placeholder="Email" onChange={inputHandler} />
                  </div>

                  <div className="col-md-6">
                    <input type="text" name="mobile" className="form-control" value={student.mobile} placeholder="Mobile No." onChange={inputHandler} />
                  </div>

                  <div className="col-md-6">
                    <input type="text" name="session" className="form-control" value={student.session} placeholder="Session (e.g., 2025-26)" onChange={inputHandler} />
                  </div>

                  <div className="col-md-6">
                    <select name="course" className="form-select" value={student.course} onChange={inputHandler}>
                      <option value="">Select Course</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Upload Image:</label>
                    <input type="file" name="image" className="form-control" onChange={inputHandler} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Upload Signature:</label>
                    <input type="file" name="sign" className="form-control" onChange={inputHandler} />
                  </div>

                  <div className="col-12 text-center mt-3">
                    <button type="submit" className="btn btn-primary w-50">
                      {id ? 'Update' : 'Submit'}
                    </button>
                  </div>

                  <div className="col-12 text-center mt-2">
                    <Link to="/" className="btn btn-danger">Cancel</Link>
                  </div>
                </div>
              </form>
            </div>
            <div className="card-footer text-muted text-center">
              &copy; {new Date().getFullYear()} Student Management System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
