import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <>
      <div className="container-fluid bg-dark text-white min-vh-100">
        <div className="row">
          {/* Header */}
          <div className="col-12 d-flex justify-content-between align-items-center py-3 px-4 border-bottom">
            <h2 className="text-primary m-0">Student Dashboard</h2>
            <div className="text-secondary">
              Welcome to <span className="text-danger">Admin</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-sm-4 col-lg-3 text-white">
            <ul className="sidebar">
              <li>
                <Link className="text-warning" to="/">Home</Link> / <Link className="text-warning" to="/attdash">Dashboard</Link>
              </li>
              <li>
                <Link className="text-warning" to="stuadd">Add Student</Link>
              </li>
              <li>
                <Link className="text-warning" to="stulist">Student List</Link>
              </li>
            </ul>
          </div>

          {/* Content Area */}
          <div className="col-sm-8 col-lg-9">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
