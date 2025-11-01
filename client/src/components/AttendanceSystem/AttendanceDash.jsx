import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AttendanceDash = () => {
  return (
    <>
      <div className="container-fluid bg-dark text-white min-vh-100">
        <div className="row">

          {/* Header */}
          <div className="col-12 d-flex justify-content-between align-items-center py-3 px-4 border-bottom">
            <h2 className="text-success m-0">Attendance Dashboard</h2>
            <div className="text-secondary">
              Welcome to <span className="text-info">Attendance Panel</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-sm-4 col-lg-3 border-end border-secondary">
            <ul className="list-unstyled p-3">
              <li className="mb-3">
                <Link className="text-warning text-decoration-none" to="/">Home</Link>
              </li>
              <li className='mb-3'>
                <Link className="text-warning text-decoration-none" to="/admin">User Panel</Link>
              </li>
              <li className='mb-3'>
                <Link className="text-warning text-decoration-none" to="/studash">Student Record</Link>
              </li>
              <li className="mb-3">
                <Link className="text-warning text-decoration-none" to="markAtt">Mark Attendance</Link>
              </li>
              <li className="mb-3">
                <Link className="text-warning text-decoration-none" to="records">Attendance Records</Link>
              </li>
              <li className="mb-3">
                <Link className="text-warning text-decoration-none" to="report">Generate Report</Link>
              </li>
            </ul>
          </div>

          {/* Main Content Area */}
          <div className="col-sm-8 col-lg-9 p-4">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  );
};

export default AttendanceDash;
