import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const API = import.meta.env.VITE_API_URL;
  const loginURL = `${API}/api/student/login/`;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const email = localStorage.getItem('studentEmail'); // store email at login
        const dob = localStorage.getItem('studentDob');     // store dob at login

        const response = await axios.post(loginURL, { email, dob });
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student profile:', error);
      }
    };

    fetchStudent();
  }, []);

  if (!student) return <p>Loading student info...</p>;

  return (
    <div className="card text-dark bg-light p-4 shadow">
      <h3 className="mb-3 text-primary">Student Profile</h3>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Mobile:</strong> {student.mobile}</p>
      <p><strong>Course:</strong> {student.course}</p>
      <p><strong>DOB:</strong> {student.dob}</p>
      <p><strong>Gender:</strong> {student.gender}</p>
      <p><strong>Address:</strong> {student.address}</p>
    </div>
  );
};

export default StudentProfile;
