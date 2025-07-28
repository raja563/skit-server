import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Select from 'react-select';

const DecideHostelFee = () => {
  const [students, setStudents] = useState([]);

  const [decide, setDecide] = useState({
    studentId: null,
    name: '',
    session: '',
    course: '',
    decidedhostelfee: '',
    totalfee: '',
  });

  // ✅ Define API URLs using environment variables
  const STUDENT_API = `${import.meta.env.VITE_API_URL}/api/student/`;
  const HOSTEL_FEE_API = `${import.meta.env.VITE_API_URL}/api/dHfee/`;

  // Fetch all students on load
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(STUDENT_API);
        const options = res.data.map(stu => ({
          value: stu.student_id,
          label: `${stu.student_id} - ${stu.name}`,
          name: stu.name,
          session: stu.session,
          course: stu.course
        }));
        setStudents(options);
      } catch (error) {
        console.error("Error fetching students", error);
      }
    };
    fetchStudents();
  }, []);

  // Auto-calculate totalfee when decidedhostelfee changes
  useEffect(() => {
    const total = parseFloat(decide.decidedhostelfee) || 0;
    setDecide(prev => ({ ...prev, totalfee: total }));
  }, [decide.decidedhostelfee]);

  // Handle input changes
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setDecide({ ...decide, [name]: value });
  };

  // Handle student selection
  const handleStudentChange = (selectedOption) => {
    if (selectedOption) {
      setDecide(prev => ({
        ...prev,
        studentId: selectedOption,
        name: selectedOption.name,
        session: selectedOption.session,
        course: selectedOption.course
      }));
    } else {
      setDecide({
        studentId: null,
        name: '',
        session: '',
        course: '',
        decidedhostelfee: '',
        totalfee: ''
      });
    }
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!decide.studentId) {
      toast.error("Please select a student ID");
      return;
    }
    if (!decide.name || !decide.session || !decide.course) {
      toast.error("Student details missing");
      return;
    }
    if (!decide.decidedhostelfee || parseFloat(decide.decidedhostelfee) <= 0) {
      toast.error("Please enter valid fees");
      return;
    }

    const postData = {
      student: decide.studentId.value,
      session: decide.session,
      course: decide.course,
      decidedhostelfee: parseFloat(decide.decidedhostelfee),
    };

    try {
      await axios.post(HOSTEL_FEE_API, postData);
      toast.success("Hostel fee saved successfully!");

      setDecide({
        studentId: null,
        name: '',
        session: '',
        course: '',
        decidedhostelfee: '',
        totalfee: ''
      });
    } catch (error) {
      console.error(error);
      toast.error("Error submitting form");
    }
  };

  return (
    <div className='rounded'>
      <div className="fluid rounded">
        <div className="row mx-auto">
          <div className="col-md-11 col-sm-12 mx-auto">
            <form className='bg-secondary text-dark rounded p-3' onSubmit={submitHandler}>
              <h2 className='text-center text-white bg-success p-1'>Decide Hostel Fees</h2>

              <div className="row mt-2">
                <div className="col-sm-10 col-lg-6">
                  <label className='text-white'>Student ID</label>
                  <Select
                    options={students}
                    onChange={handleStudentChange}
                    placeholder="Search & Select Student ID"
                    value={decide.studentId}
                    className='text-dark'
                  />
                </div>

                <div className="col-sm-10 col-lg-6">
                  <label className='text-white'>Student Name</label>
                  <input
                    type="text"
                    className='form-control bg-secondary-subtle'
                    name="name"
                    value={decide.name}
                    readOnly
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-sm-10 col-lg-6">
                  <label className='text-white'>Session</label>
                  <input
                    type="text"
                    className='form-control bg-secondary-subtle'
                    name="session"
                    value={decide.session}
                    readOnly
                  />
                </div>

                <div className="col-sm-10 col-lg-6">
                  <label className='text-white'>Course</label>
                  <input
                    type="text"
                    className='form-control bg-secondary-subtle'
                    name="course"
                    value={decide.course}
                    readOnly
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-sm-10 col-lg-6">
                  <label className='text-white'>Hostel Fee</label>
                  <input
                    type="number"
                    className="form-control bg-secondary-subtle"
                    name="decidedhostelfee"
                    value={decide.decidedhostelfee}
                    onChange={inputHandle}
                    placeholder='Enter Hostel Fees'
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="mx-1">
                  <button className="btn btn-primary">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecideHostelFee;
