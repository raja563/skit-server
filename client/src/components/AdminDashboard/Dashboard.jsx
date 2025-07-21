import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css'; // make sure to add fade-in-up animation here or via inline style

const Dashboard = () => {
  const [total, setTotal] = useState(0);
  const [paid, setPaid] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const [
          acadDec, examDec, hostDec, transDec,
          acadDep, examDep, hostDep, transDep
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/decideFees/"),
          axios.get("http://127.0.0.1:8000/api/dEfee/"),
          axios.get("http://127.0.0.1:8000/api/dHfee/"),
          axios.get("http://127.0.0.1:8000/api/dTfee/"),
          axios.get("http://127.0.0.1:8000/api/dpfees/"),
          axios.get("http://127.0.0.1:8000/api/dpefee/"),
          axios.get("http://127.0.0.1:8000/api/dphfee/"),
          axios.get("http://127.0.0.1:8000/api/dptfee/"),
        ]);

        const sum = (arr, key) =>
          arr.reduce((acc, cur) => acc + parseFloat(cur[key] || 0), 0);

        const totalDecided =
          sum(acadDec.data, "decidedamt") +
          sum(examDec.data, "decidedexamfee") +
          sum(hostDec.data, "decidedhostelfee") +
          sum(transDec.data, "decidedtransportfee");

        const totalPaid =
          sum(acadDep.data, "dpfees") +
          sum(examDep.data, "dpexamfees") +
          sum(hostDep.data, "dphostelfees") +
          sum(transDep.data, "dptransportfees");

        setTotal(totalDecided);
        setPaid(totalPaid);
        setPending(totalDecided - totalPaid);
      } catch (error) {
        console.error("Failed to fetch dashboard fee stats", error);
      }
    };

    fetchFees();
  }, []);

  const fmt = (n) => (isNaN(n) ? "0.00" : Number(n).toFixed(2));

  return (
    <div className="container-fluid dark text-white min-vh-100">
      <div className="row">
        {/* Header */}
        <div className="col-12 d-flex justify-content-between align-items-center py-3 px-4 border-bottom">
          {/* <h2 className="text-primary m-0">Admin Panel</h2> */}
          <div className="text-secondary">
            Welcome to <span className="text-danger">Admin</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-sm-4 col-lg-3 text-white mt-3">
          <h4 className='text-white text-center'>Admin</h4>
          <ul className='sidebar'>
            <li><Link to={'/'} className="text-warning">Back</Link></li>
            <li className='nested-list'>Dashboard
              <ul className='nested-list-item'>
                <li><Link to={'/faculty/dashboard'}>Faculty</Link></li>
                <li><Link to={'/studash'}>Student</Link></li>
              </ul>
            </li>
            <li>Faculty</li>
            <li><Link to={'/stpl'}>Staff</Link></li>
            <li>Library</li>
            <li>Department</li>
            <li>Courses</li>
            <li>Holiday</li>
          </ul>
        </div>

        {/* Content */}
        <div className="col-sm-8 col-lg-9 mt-3">
          {/* <h2 className='text-white text-center mb-4'>Dashboard</h2> */}

          {/* ▼ New Summary Cards ▼ */}
          <div className="row g-4 mb-4 px-3 fade-in-up">
            <div className="col-md-4 col-sm-6">
              <Link to="/fees" className="text-decoration-none">
                <div className="card text-white bg-dark shadow-lg border-0 rounded-4 p-3 h-100 text-center">
                  <i className="fas fa-calculator fa-2x mb-1 text-warning"></i>
                  <h5>Total Amount</h5>
                  <h6 className="fw-bold text-success">₹ {fmt(total)}</h6>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-sm-6">
              <Link to="/fees" className="text-decoration-none">
                <div className="card text-white bg-dark shadow-lg border-0 rounded-4 p-3 h-100 text-center">
                  <i className="fas fa-wallet fa-2x mb-1 text-info"></i>
                  <h5>Paid Amount</h5>
                  <h6 className="fw-bold text-primary">₹ {fmt(paid)}</h6>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-sm-6">
              <Link to="/fees" className="text-decoration-none">
                <div className="card text-white bg-dark shadow-lg border-0 rounded-4 p-3 h-100 text-center">
                  <i className="fas fa-hourglass-half fa-2x mb-1 text-danger"></i>
                  <h5>Pending Amount</h5>
                  <h6 className="fw-bold text-danger">₹ {fmt(pending)}</h6>
                </div>
              </Link>
            </div>
          </div>
          {/* ▲ End of Summary Cards ▲ */}

          <div className="row g-4 px-3">
            {/* Original dashboard cards remain below */}
            <div className="col-md-4 col-sm-6">
              <Link to="/studash" className="dash-card-link">
                <div className="dash-card bg-gradient-primary">
                  <i className="fas fa-user-graduate fa-2x mb-1"></i>
                  <h5>Student</h5>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-sm-6">
              <Link to="/fees" className="dash-card-link">
                <div className="dash-card bg-gradient-warning">
                  <i className="fas fa-rupee-sign fa-2x mb-1"></i>
                  <h5>Fees</h5>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-sm-6">
              <Link to="/faculty/dashboard" className="dash-card-link">
                <div className="dash-card bg-gradient-success">
                  <i className="fas fa-chalkboard-teacher fa-2x mb-1"></i>
                  <h5>Faculty</h5>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="dash-card bg-gradient-info">
                <i className="fas fa-users fa-2x mb-1"></i>
                <h5><Link to={'/stpl'}>Staff</Link></h5>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="dash-card bg-gradient-danger">
                <i className="fas fa-question-circle fa-2x mb-1"></i>
                <h5><Link to={'/enq'}>Enquiry</Link></h5>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="dash-card bg-gradient-dark">
                <i className="fas fa-book fa-2x mb-1"></i>
                <h5><Link to={'/career_list'}>Career</Link></h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
