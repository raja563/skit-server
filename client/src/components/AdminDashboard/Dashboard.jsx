import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './dashboard.css';

const Dashboard = () => {
  const [total, setTotal] = useState(0);
  const [paid, setPaid] = useState(0);
  const [pending, setPending] = useState(0);
  const navigate = useNavigate();

  const logoutURL = `${import.meta.env.VITE_API_URL}/api/logout/`;

  const decidedFeesURLs = {
    acad: `${import.meta.env.VITE_API_URL}/api/decideFees/`,
    exam: `${import.meta.env.VITE_API_URL}/api/dEfee/`,
    host: `${import.meta.env.VITE_API_URL}/api/dHfee/`,
    trans: `${import.meta.env.VITE_API_URL}/api/dTfee/`,
  };

  const paidFeesURLs = {
    acad: `${import.meta.env.VITE_API_URL}/api/dpfees/`,
    exam: `${import.meta.env.VITE_API_URL}/api/dpefee/`,
    host: `${import.meta.env.VITE_API_URL}/api/dphfee/`,
    trans: `${import.meta.env.VITE_API_URL}/api/dptfee/`,
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Not logged in");
      navigate('/login');
      return;
    }

    const fetchFees = async () => {
      try {
        const [
          acadDec, examDec, hostDec, transDec,
          acadDep, examDep, hostDep, transDep
        ] = await Promise.all([
          axios.get(decidedFeesURLs.acad),
          axios.get(decidedFeesURLs.exam),
          axios.get(decidedFeesURLs.host),
          axios.get(decidedFeesURLs.trans),
          axios.get(paidFeesURLs.acad),
          axios.get(paidFeesURLs.exam),
          axios.get(paidFeesURLs.host),
          axios.get(paidFeesURLs.trans),
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

  // ✅ Enhanced logout confirmation using toast
  const handleLogout = async () => {
    toast((t) => (
      <span>
        Are you sure you want to logout?
        <div className="mt-2 d-flex justify-content-end gap-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.post(logoutURL, null, {
                  headers: {
                    Authorization: `Token ${token}`,
                  },
                });

                localStorage.removeItem('token');
                toast.success("Successfully logged out!");
                navigate('/');
              } catch (err) {
                toast.error("Logout failed. Please try again.");
              }
            }}
          >
            Yes
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </span>
    ), {
      duration: 10000,
    });
  };

  const fmt = (n) => (isNaN(n) ? "0.00" : Number(n).toFixed(2));

  return (
    <div className="container-fluid dark text-white min-vh-100">
      <div className="row">
        {/* Header */}
        <div className="col-12 d-flex justify-content-between align-items-center py-3 px-4 border-bottom">
          <div className="text-secondary">
            Welcome to <span className="text-danger">Admin</span>
          </div>
          <button onClick={handleLogout} className="btn btn-sm btn-danger">
            Logout
          </button>
        </div>

        {/* Sidebar */}
        <div className="col-sm-4 col-lg-3 text-white mt-3">
          <h4 className='text-white text-center'>Admin</h4>
          <ul className='sidebar'>
            <li><Link to='/' className="text-warning">Back</Link></li>
            <li className='nested-list'>Dashboard
              <ul className='nested-list-item'>
                <li><Link to='/admin'>Admin</Link></li>
                <li><Link to='/faculty/dashboard'>Faculty</Link></li>
                <li><Link to='/studash'>Student</Link></li>
              </ul>
            </li>
            <li>Faculty</li>
            <li><Link to='/stpl'>Staff</Link></li>
            <li>Library</li>
            <li>Department</li>
            <li><Link to={'/facultyPortal'}>Faculty Portel</Link></li>
            <li><Link to={'/student/portal'}>Student Portel</Link></li>
            <li>Holiday</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-sm-8 col-lg-9 mt-3">
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

          {/* Dashboard Cards */}
          <div className="row g-4 px-3">
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
              <Link to="/facdash" className="dash-card-link">
                <div className="dash-card bg-gradient-success">
                  <i className="fas fa-chalkboard-teacher fa-2x mb-1"></i>
                  <h5>Faculty</h5>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="dash-card bg-gradient-info">
                <i className="fas fa-users fa-2x mb-1"></i>
                <h5><Link to='/stpl'>Staff</Link></h5>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="dash-card bg-gradient-danger">
                <i className="fas fa-question-circle fa-2x mb-1"></i>
                <h5><Link to='/enq'>Enquiry</Link></h5>
              </div>
            </div>

            <div className="col-md-4 col-sm-6">
              <div className="dash-card bg-gradient-dark">
                <i className="fas fa-book fa-2x mb-1"></i>
                <h5><Link to='/career_list'>Career</Link></h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
