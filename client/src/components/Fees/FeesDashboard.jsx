import React from 'react'
import { Link,Outlet } from 'react-router-dom';

const FeesDashboard = () => {
  return (
  <>
     <div className="container-fluid dark text-white min-vh-100">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center py-3 px-4 border-bottom">
              <h2 className="text-primary m-0">Fees Portal</h2>
              <div className="text-secondary">
                Welcome to <span className="text-danger">Admin</span>
              </div>
            </div>
    
    
            {/* Sidebar */}
            <div className="col-sm-4 col-lg-3 text-white">
              <ul className='sidebar'>
                              <li><Link className='text-warning' to={'/'}>Home</Link> / <Link className='text-warning' to={'/dashboard'}>Dashboard</Link></li>
                              <li><Link className='text-warning' to={'signup'}>Student Register</Link> </li>
                              <li className='nested-list'>Decide
                                 <ul className="nested-list-item">
                                    <li> <Link to={'decide'}>Academic</Link></li>
                                    <li> <Link to={'dexam'}>Exam</Link></li>
                                    <li> <Link to={'dhfee'}>Hostal</Link></li>
                                    <li> <Link to={'dtfee'}>Transportation</Link></li>
                                 </ul>
                              </li>
                              <li> <Link to={'dflist'}>Decided Fees List</Link></li>
                              <li className='nested-list'>Deposite
                                 <ul className="nested-list-item list-shift">
                                    <li> <Link to={'dpfees'}>Academic</Link></li>
                                    <li> <Link to={'dpEfee'}>Exam</Link></li>
                                    <li> <Link to={'dpHfee'}>Hostal</Link></li>
                                    <li> <Link to={'dpTfee'}>Transportation</Link></li>
                                 </ul>
                              </li>
                              <li> <Link to={'flist'}>Fees List</Link></li>
                                        </ul>
            </div>
    
            {/* Right-hand Content Area */}
            <div className="col-sm-8 col-lg-9">
              <Outlet/>
            </div>
    
          </div>
        </div>
  </>
  )
}

export default FeesDashboard
