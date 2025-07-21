import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Toaster} from 'react-hot-toast'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import Contact from './components/Contact/Contact.jsx'
import About from './components/About/About.jsx'
import Gallery from './components/Gallery/Gallery.jsx'
import App from './App.jsx'
import Faculty from './components/Faculty/Faculty.jsx'
import Course from './components/Course/Course.jsx'
import Notice from './components/Notice/Notice.jsx'
import User from './components/getUser/User.jsx'
import Add from './components/addUser/Add.jsx'
import Update from './components/updateUser/Update.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import LoginSignup from './components/LoginSignup/LoginSignup.jsx'
import Dashboard from './components/AdminDashboard/Dashboard.jsx'
import FacultyDashboard from './components/Faculty/FacultyDashboard.jsx'
import FacultyRegister from './components/Faculty/FacultyRegister.jsx'
import StudentDashboard from './components/Student/StudentDashboard.jsx'
import StudentSignup from './components/Student/StudentSignup.jsx'
import FeesDashboard from './components/Fees/FeesDashboard.jsx'
// import Fees from './components/Fees/FeePortal/Deposite.jsx'
import FeesList from './components/Fees/FeePortal/FeesList.jsx'
import StudentLogin from './components/Student/StudentLogin.jsx'
import StudentPortal from './components/Student/StudentPortal/StudentPortal.jsx'
import EventNotice from './components/Student/StudentPortal/EventNotice.jsx'
import FacultyLogin from './components/Faculty/FacultyLogin.jsx'
import FacultyPortal from './components/Faculty/FacultyPortal.jsx'
import Notes from './components/Student/StudentPortal/Notes.jsx'
import WelcomeStudent from './components/Student/StudentPortal/WelcomeStudent.jsx'
import Syllabus from './components/Student/StudentPortal/Syllabus.jsx'
import GetAllFaculty from './components/Faculty/GetAllFaculty.jsx'
import AddSyllabus from './components/Faculty/AddSyllabus.jsx'
import SyllabusList from './components/Faculty/FacultyPortal/SyllabusList.jsx'
import DecideFee from './components/Fees/FeePortal/DecideFee.jsx'
import DecidedList from './components/Fees/FeePortal/DecidedList.jsx'
import DecideExamFees from './components/Fees/FeePortal/DecideExamFees.jsx'
import DecideHostelFee from './components/Fees/FeePortal/DecideHostelFee.jsx'
import DecideTFees from './components/Fees/FeePortal/DecideTFees.jsx'
import DpFeesForm from './components/Fees/FeePortal/DpFeesForm.jsx'
import EnqPortal from './components/Enquiry/EnqPortal.jsx'
import StuList from './components/Student/StudDash/StuList.jsx'
import DpExamFee from './components/Fees/FeePortal/DpExamFee.jsx'
import DpHostelFee from './components/Fees/FeePortal/DpHostelFee.jsx'
import DpTransportFee from './components/Fees/FeePortal/DpTransportFee.jsx'
import ContactData from './components/Enquiry/ContactData.jsx'
import EnqData from './components/Enquiry/EnqData.jsx'
import StaffPanel from './components/Staff/StaffPanel.jsx'
import StaffForm from './components/Staff/StaffForm.jsx'
import StaffList from './components/Staff/StaffList.jsx'
import CareerForm from './components/Career/CareerForm.jsx'
import CareerList from './components/Career/CareerList.jsx'
let allRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/gallery',
    element: <Gallery />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/enq',
    element:<EnqPortal/>,
    children:[
      { index: true, element:<WelcomeStudent/> }, // 👈 Default route for /student/portal
    { path: 'enqdata', element:<EnqData/> },
    { path: 'condata', element:<ContactData/> },
    ]
  },
  {
    path: '/course',
    element: <Course />
  },
  {
    path: '/notice',
    element: <Notice />
  },
  {
    path: '/addUser',
    element: <User />
  },
  {
    path: '/add',
    element: <Add />
  },
  {
    path: '/edit/:id',
    element: <Update />
  },
  {
    path: '/login',
    element: <LoginSignup />
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
     children: [
    { index: true, element:<WelcomeStudent/> }, // 👈 Default route for /student/portal
    { path: 'student', element:<StudentDashboard/> },
    { path: 'faculty', element:<StudentDashboard/> },
  ]

  },
  {
    path: '/faculty/dashboard',
    element: <FacultyDashboard />,
    children: [
    { index: true, element:<WelcomeStudent/> }, // 👈 Default route for /student/portal
    { path: 'register', element:<FacultyRegister/> },
    { path: 'getAll', element:<GetAllFaculty/> },
  ]
  },
  {
    path: '/faculty/register',
    element: <FacultyRegister/>
  },
  {
    path: '/FacultyPortal',
    element: <FacultyPortal/>,
    children: [
    { index: true, element:<WelcomeStudent/> }, // 👈 Default route for /student/portal
    { path: 'addSyl', element:<AddSyllabus/> },
    { path: 'sylList', element:<SyllabusList/> },
  ]
  },
  {
    path: '/stpl',
    element: <StaffPanel/>,
    children: [
    { index: true, element:<WelcomeStudent/> }, // 👈 Default route for /student/portal
    { path: 'stfm', element:<StaffForm/> },
    { path: 'stls', element:<StaffList/> },
    {  path:"stfm/:id", element:<StaffForm /> },
    { path:"/stpl/stls/stfm/:id", element:<StaffForm />},
    { path:"/stpl", element:<Navigate to="/stpl/stls/stfm/4" replace />}
  ]
  },
  {
    path: '/studash',
    element: <StudentDashboard/>,
    children:[
      {index:true,element:<WelcomeStudent/>},
      {path:'stuadd',element:<StudentSignup/>},
      {path:'stulist',element:<StuList/>},
      {path:'stuadd/:id',element:<StudentSignup/>},
      {path:'/studash/stulist/stuadd/:id',element:<StudentSignup/>},
      {path:'/studash',element:<Navigate to='/studash/stulist/stuadd/:id' replace/>},
    ]
  },
  {
    path: '/student/signup',
    element: <StudentSignup />
  },
  {
    path: '/fees',
    element: <FeesDashboard />,
     children: [
    { index: true, element:<WelcomeStudent/> }, // 👈 Default route for /student/portal
    { path: 'decide', element:<DecideFee/> },
    { path: 'dexam', element:<DecideExamFees/> },
    { path: 'dhfee', element:<DecideHostelFee/> },
    { path: 'dtfee', element:<DecideTFees/> },
    { path: 'dflist', element:<DecidedList/> },
    { path: 'flist', element:<FeesList/> },
    { path: 'dpfees', element:<DpFeesForm/> },
    { path: 'dpEfee', element:<DpExamFee/> },
    { path: 'dpHfee', element:<DpHostelFee/> },
    { path: 'dpTfee', element:<DpTransportFee/> },
    { path:'signup', element: <StudentSignup />},
   ]
  },
  {
    path: '/student/login',
    element: <StudentLogin />
  },
  {
  path: '/student/portal',
  element: <StudentPortal />,
  children: [
    { index: true, element:<WelcomeStudent/> }, // 👈 Default route for /student/portal
    { path: 'events', element:<EventNotice/> },
    { path: 'notes', element:<Notes /> },
    { path: 'syllabus', element:<Syllabus/> },
    // Add more nested pages like:
    // { path: 'syllabus', element: <Syllabus /> },
  ]
  },
  {
    path: '/faculty/login',
    element: <FacultyLogin />
  },
  {
    path: '/career',
    element:<CareerForm/>
  },
  {
    path: '/career_list',
    element:<CareerList/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={allRouter}/>
    <Toaster/>
  </React.StrictMode>,
)

