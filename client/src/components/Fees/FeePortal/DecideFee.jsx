import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Select from 'react-select';

const DecideFee = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [decide, setDecide] = useState({
    student: null,         // <-- changed from student_id
    name: '',
    session: '',
    course: '',
    decidedamt: '',
    totalfee: '',
  });

  // Fetch all students on load
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/student/");
        const options = res.data.map(stu => ({
          value: stu.student_id, // <- backend expects student_id string
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

  // Auto-calculate totalfee when decidedamt changes
  useEffect(() => {
    const total = parseFloat(decide.decidedamt) || 0;
    setDecide(prev => ({ ...prev, totalfee: total }));
  }, [decide.decidedamt]);

  // Generic input change handler
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setDecide(prev => ({ ...prev, [name]: value }));
  };

  // On student selection
  const handleStudentChange = (selectedOption) => {
    if (selectedOption) {
      setDecide(prev => ({
        ...prev,
        student: selectedOption,  // <--- Save entire selected option
        name: selectedOption.name,
        session: selectedOption.session,
        course: selectedOption.course
      }));
    } else {
      setDecide({
        student: null,
        name: '',
        session: '',
        course: '',
        decidedamt: '',
        totalfee: ''
      });
    }
  };

  // Form submission handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!decide.student) {
      toast.error("Please select a student");
      return;
    }

    const postData = {
      student: decide.student.value, // <- send student_id string
      session: decide.session,
      course: decide.course,
      decidedamt: parseFloat(decide.decidedamt),
      // totalfee is calculated locally, not required in backend unless stored
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/decideFees/", postData);
      toast.success("Data saved successfully!", { position: "top-right" });

      setDecide({
        student: null,
        name: '',
        session: '',
        course: '',
        decidedamt: '',
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
              <h2 className='text-center text-white bg-success p-1'>Decide Academic Fees</h2>

              <div className="row mt-2">
                <div className="col-sm-10 col-lg-6">
                  <label className='text-white'>Student ID</label>
                  <Select
                    options={students}
                    onChange={handleStudentChange}
                    placeholder="Search & Select Student"
                    value={decide.student}
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
                  <label className='text-white'>Tuition / Decided Fees</label>
                  <input
                    type="number"
                    className="form-control bg-secondary-subtle"
                    name="decidedamt"
                    value={decide.decidedamt}
                    onChange={inputHandle}
                    placeholder='Enter Fees'
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

export default DecideFee;
