import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const StudentPortal = () => {
  return (
    <div className="container-fluid bg-dark text-white min-vh-100">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center py-3 px-4 border-bottom">
          <h2 className="text-primary m-0">Student Portal</h2>
          <div className="text-secondary">
            Welcome to <span className="text-danger"></span>
          </div>
        </div>


        {/* Sidebar */}
        <div className="col-sm-5 col-md-4 text-white">
          <ul className='sidebar'>
                          <li><Link className='text-warning' to={'/'}>Back</Link></li>
                          <li><Link>Profile</Link></li>
                          <li className='nested-list'> <Link to={'syllabus'}>Syllabus</Link>
                          </li>
                          <li><Link to={'notes'}>Notes</Link></li>
                          <li>Activity</li>
                          <li>Assignment</li>
                          <li>Assignment Submission</li>
                          <li><Link to={'events'}>Events / Notices</Link></li>
          </ul>
        </div>

        {/* Right-hand Content Area */}
        <div className="col-sm-6 col-md-7 mt-3">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default StudentPortal;
