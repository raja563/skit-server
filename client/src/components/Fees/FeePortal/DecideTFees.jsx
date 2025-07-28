import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Select from 'react-select';

const DecideTFees = () => {
  const [students, setStudents] = useState([]);

  const [decide, setDecide] = useState({
    studentId: null,
    name: '',
    session: '',
    course: '',
    decidedtransportfee: '',
    totalfee: '',
  });

  // ✅ Define API URLs from environment variables
  const STUDENT_API = `${import.meta.env.VITE_API_URL}/api/student/`;
  const TRANSPORT_FEE_API = `${import.meta.env.VITE_API_URL}/api/dTfee/`;

  // Fetch all students
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
        toast.error("Failed to load students");
      }
    };
    fetchStudents();
  }, []);

  // Auto-calculate total fee (if needed)
  useEffect(() => {
    const total = parseFloat(decide.decidedtransportfee) || 0;
    setDecide(prev => ({ ...prev, totalfee: total }));
  }, [decide.decidedtransportfee]);

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setDecide({ ...decide, [name]: value });
  };

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
        decidedtransportfee: '',
        totalfee: ''
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!decide.studentId) return toast.error("Please select a student ID");
    if (!decide.session || !decide.course) return toast.error("Missing student details");
    if (!decide.decidedtransportfee || parseFloat(decide.decidedtransportfee) <= 0)
      return toast.error("Enter a valid transport fee");

    const postData = {
      student: decide.studentId.value,
      session: decide.session,
      course: decide.course,
      decidedtransportfee: parseFloat(decide.decidedtransportfee)
    };

    try {
      await axios.post(TRANSPORT_FEE_API, postData);
      toast.success("Transportation fee saved successfully!");

      setDecide({
        studentId: null,
        name: '',
        session: '',
        course: '',
        decidedtransportfee: '',
        totalfee: ''
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit data");
    }
  };

  return (
    <div className='rounded'>
      <div className="fluid rounded">
        <div className="row mx-auto">
          <div className="col-md-11 col-sm-12 mx-auto">
            <form className='bg-secondary text-dark rounded p-3' onSubmit={submitHandler}>
              <h2 className='text-center text-white bg-success p-1'>Decide Transportation Fees</h2>

              <div className="row mt-2">
                <div className="col-sm-10 col-lg-6">
                  <label className='text-white'>Student ID</label>
                  <Select
                    options={students}
                    onChange={handleStudentChange}
                    placeholder="Search & Select Student"
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
                  <label className='text-white'>Transportation Fees</label>
                  <input
                    type="number"
                    className="form-control bg-secondary-subtle"
                    name="decidedtransportfee"
                    value={decide.decidedtransportfee}
                    onChange={inputHandle}
                    placeholder='Enter Transport Fee'
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

export default DecideTFees;
