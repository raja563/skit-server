import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FacultyPortal = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('facultyToken');
    toast.success("Logged out");
    navigate('/faculty/login');
  };

  return (
    <div className="container-fluid text-white min-vh-100 bg-dark">
      <div className="row">
        <div className="col-12">
          <div className='mx-4 mt-4 d-flex justify-content-between'>
            <p className='fs-2 text-primary fw-bold'>Faculty</p>
            <div className='text-secondary'>
              Welcome to <span className='text-danger'> RajaBabu</span>
              <button className='btn btn-sm btn-danger ms-3' onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 col-lg-3 text-white">
              <ul className='sidebar'>
                <li className='bg-warning'><Link className='text-danger' to='/'>Back</Link></li>
                <li className='nested-list'>Syllabus
                  <ul className="nested-list-item">
                    <li><Link to='addSyl'>Add Syllabus</Link></li>
                    <li><Link to='sylList'>Syllabus List</Link></li>
                  </ul>
                </li>
                <li>Class Schedule</li>
                <li>Internal Exam Detail</li>
                <li>Notes</li>
                <li>External Exam Detail</li>
                <li><Link to='/student/events'>Events / Notices</Link></li>
              </ul>
            </div>
            <div className="col-sm-8 col-lg-7 mt-3">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyPortal;
