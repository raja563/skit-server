import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Syllabus = () => {

  const [syllabus, setSyllabus] = useState([]);
  const baseUrl = "http://127.0.0.1:8000"; // Django server

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${baseUrl}/api/syllabus`);
      setSyllabus(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h4 className='text-center bg-danger p-1'>BCA Syllabus</h4>
      <table className="table table-hover rounded">
        <thead>
          <tr>
            <th>Semester</th>
            <th>Syllabus</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {syllabus.map((value, key) => (
            <tr key={key}>
              <th>{value.id}</th>
              <td>
                <a
                  className='text-dark'
                  href={`${baseUrl}${value.syllabus}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img width={12} src="/img/pdf_logo.png" alt="" /> {value.syllabus.split("/").pop()}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Syllabus;
