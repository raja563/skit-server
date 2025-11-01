import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';

const StudentSignup = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const API = import.meta.env.VITE_API_URL;
  const registerURL = `${API}/api/student/`;
  const fetchURL = `${API}/api/student/${id}/`;

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
        toast.error("Profile image must be less than 200 KB");
        return;
      }
      if (name === 'sign' && file.size > 100 * 1024) {
        toast.error("Signature must be less than 100 KB");
        return;
      }
      setStudent({ ...student, [name]: file });
    } else {
      setStudent({ ...student, [name]: value });
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
  const isValidSession = (session) => /^\d{4}-\d{2}$/.test(session);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, father, dob, address, mobile, email, course, session } = student;

    if (!name || !father || !dob || !address || !mobile || !email || !course || !session) {
      toast.error("Please fill all required fields!");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Invalid email format!");
      return;
    }
    if (!isValidMobile(mobile)) {
      toast.error("Invalid Indian mobile number!");
      return;
    }
    if (!isValidSession(session)) {
      toast.error("Session format: YYYY-YY (e.g., 2025-26)");
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
        toast.success("Student updated successfully!");
      } else {
        await axios.post(registerURL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Registered successfully!");
      }

      navigate('/attdash');
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center">
              <h3>{id ? 'Edit Student' : 'Student Registration'}</h3>
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input name="name" className="form-control" value={student.name} placeholder="Full Name" onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <input name="father" className="form-control" value={student.father} placeholder="Father's Name" onChange={inputHandler} />
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
                    <label>Date of Birth:</label>
                    <input type="date" name="dob" className="form-control" value={student.dob} onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <input name="address" className="form-control" value={student.address} placeholder="Address" onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <input name="email" className="form-control" value={student.email} placeholder="Email" onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <input name="mobile" className="form-control" value={student.mobile} placeholder="Mobile No." onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <input name="session" className="form-control" value={student.session} placeholder="Session (e.g., 2025-26)" onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <select
  name="course"
  className="form-select"
  value={student.course}
  onChange={inputHandler}
>
  <option value="">Select Department & Course</option>

  {/* Computer Application */}
  <optgroup label="Department of Computer Application">
    <option value="BCA">Bachelor of Computer Application (BCA)</option>
    <option value="MCA">Master of Computer Application (MCA)</option>
    <option value="PhD in Computer Application">Ph.D. in Computer Application</option>
  </optgroup>

  {/* Pharmacy */}
  <optgroup label="Department of Pharmacy">
    <option value="D.Pharm">Diploma in Pharmacy (D.Pharm)</option>
    <option value="B.Pharm">Bachelor of Pharmacy (B.Pharm)</option>
    <option value="M.Pharm">Master of Pharmacy (M.Pharm)</option>
    <option value="PhD in Pharmacy">Ph.D. in Pharmacy</option>
  </optgroup>

  {/* Management */}
  <optgroup label="Department of Management">
    <option value="BBA">Bachelor of Business Administration (BBA)</option>
    <option value="MBA">Master of Business Administration (MBA)</option>
    <option value="PhD in Management">Ph.D. in Management</option>
  </optgroup>

  {/* Hotel Management */}
  <optgroup label="Department of Hotel Management">
    <option value="BHM">Bachelor of Hotel Management (BHM)</option>
    <option value="MHM">Master of Hotel Management (MHM)</option>
    <option value="PhD in Hotel Management">Ph.D. in Hotel Management</option>
  </optgroup>

  {/* Agriculture */}
  <optgroup label="Department of Agriculture">
    <option value="B.Sc Agriculture">Bachelor of Science in Agriculture (B.Sc Agri)</option>
    <option value="M.Sc Agriculture">Master of Science in Agriculture (M.Sc Agri)</option>
    <option value="PhD in Agriculture">Ph.D. in Agriculture</option>
  </optgroup>

  {/* Arts and Law */}
  <optgroup label="Department of Arts and Law">
    <option value="BA">Bachelor of Arts (BA)</option>
    <option value="MA">Master of Arts (MA)</option>
    <option value="LLB">Bachelor of Law (LLB)</option>
    <option value="LLM">Master of Law (LLM)</option>
    <option value="PhD in Arts and Law">Ph.D. in Arts and Law</option>
  </optgroup>

  {/* Library Science */}
  <optgroup label="Department of Library Science">
    <option value="B.Lib">Bachelor of Library Science (B.Lib)</option>
    <option value="M.Lib">Master of Library Science (M.Lib)</option>
    <option value="PhD in Library Science">Ph.D. in Library Science</option>
  </optgroup>
</select>

                  </div>
                  <div className="col-md-6">
                    <label>Upload Image:</label>
                    <input type="file" name="image" className="form-control" onChange={inputHandler} />
                  </div>
                  <div className="col-md-6">
                    <label>Upload Signature:</label>
                    <input type="file" name="sign" className="form-control" onChange={inputHandler} />
                  </div>
                  <div className="col-12 text-center mt-3">
                    <button type="submit" className="btn btn-primary w-50">{id ? 'Update' : 'Submit'}</button>
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
