import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
// import { useNavigate } from 'react-router-dom'

const AddSyllabus = () => {

  // const navigate = useNavigate();

  const [syllabus, setSyllabus] = useState({
    course: '',
    year: '',
    syllabus: ''
  })

  const inputHandler = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setSyllabus({ ...syllabus, [name]: files[0] });
    } else {
      setSyllabus({ ...syllabus, [name]: value });
    }
  }

  const syllabusURL = `${import.meta.env.VITE_API_URL}/api/syllabus/`;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!syllabus.course || !syllabus.year || !syllabus.syllabus) {
      toast.error("Please fill all the fields!", { position: "top-center" });
      return;
    }

    const formData = new FormData();
    for (let key in syllabus) {
      formData.append(key, syllabus[key]);
    }

    try {
      const response = await axios.post(syllabusURL, formData);
      toast.success(response.data.msg, { position: "top-right" });
      // navigate('syllabusList');
    } catch (error) {
      console.error(error);
      toast.error("Registration failed", { position: "top-right" });
    }
  }

  return (
    <>
      <div className="fluid">
        <div className="row">
          <div className="col-12 text-white">
            <h4 className='text-center bg-success text-light p-2 rounded'>Add Syllabys</h4>
            <form className='bg-secondary p-2 rounded' onSubmit={submitHandler}>
              <div>
                <label htmlFor="course" className='mx-2'>Course</label>
                <select name="course" id="course" className="form-control" onChange={inputHandler}>
                  <option disabled selected>Select Course</option>
                  <option value="BBA">BBA</option>
                  <option value="BCA">BCA</option>
                </select>
              </div>
              <div>
                <label htmlFor="year" className='mx-2'>Year</label>
                <select name="year" id="year" className="form-control" onChange={inputHandler}>
                  <option disabled selected>Select Year</option>
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Third">Third</option>
                </select>
              </div>
              <div>
                <label className='mx-2'>Upload Syllabys</label>
                <input name="syllabus" type='file' accept="application/pdf" className="form-control" onChange={inputHandler} />
              </div>
              <div>
                <button type='submit' className='btn btn-primary mx-2 mt-2'>Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddSyllabus
