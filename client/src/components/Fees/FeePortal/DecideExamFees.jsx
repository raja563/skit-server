import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

const DecideExamFee = () => {
  const [students, setStudents] = useState([]);

  const [decide, setDecide] = useState({
    studentOption: null,
    student_id: "",
    session: "",
    course: "",
    decidedexamfee: ""  // ✅ Match model field name
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/student/");
        setStudents(
          res.data.map(stu => ({
            value: stu.student_id,
            label: `${stu.student_id} - ${stu.name}`,
            session: stu.session,
            course: stu.course
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Unable to fetch students");
      }
    })();
  }, []);

  const handleStudentChange = option => {
    if (option) {
      setDecide({
        ...decide,
        studentOption: option,
        student_id: option.value,
        session: option.session,
        course: option.course
      });
    } else {
      setDecide({
        studentOption: null,
        student_id: "",
        session: "",
        course: "",
        decidedexamfee: ""
      });
    }
  };

  const handleInput = e =>
    setDecide({ ...decide, [e.target.name]: e.target.value });

  const submitHandler = async e => {
    e.preventDefault();

    if (!decide.student_id) return toast.error("Select a student");
    if (!decide.decidedexamfee || decide.decidedexamfee <= 0)
      return toast.error("Enter a valid exam fee");

    const payload = {
      student: decide.student_id,  // ✅ matches Django field
      session: decide.session,
      course: decide.course,
      decidedexamfee: parseFloat(decide.decidedexamfee)
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/dEfee/", payload);
      toast.success("Exam fee saved!");

      setDecide({
        studentOption: null,
        student_id: "",
        session: "",
        course: "",
        decidedexamfee: ""
      });
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again");
    }
  };

  return (
    <div className="fluid mx-4 mt-2">
      <div className="row">
        <div className="col-12">
      <form
        onSubmit={submitHandler}
        className="bg-secondary p-3 rounded text-white"
      >
        <h2 className="bg-success text-center p-1 rounded">Decide Exam Fee</h2>

        <div className="row mt-3 ">
          <div className="col-md-6">
            <label>Student ID</label>
            <Select
              options={students}
              value={decide.studentOption}
              onChange={handleStudentChange}
              placeholder="Search student"
              className="text-dark"
            />
          </div>

          <div className="col-md-6">
            <label>Session</label>
            <input
              type="text"
              className="form-control bg-secondary-subtle"
              name="session"
              value={decide.session}
              readOnly
            />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-6">
            <label>Course</label>
            <input
              type="text"
              className="form-control bg-secondary-subtle"
              name="course"
              value={decide.course}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label>Exam Fee</label>
            <input
              type="number"
              className="form-control bg-secondary-subtle"
              name="decidedexamfee"  // ✅ Correct field name
              value={decide.decidedexamfee}
              onChange={handleInput}
              placeholder="Enter exam fee"
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default DecideExamFee;
