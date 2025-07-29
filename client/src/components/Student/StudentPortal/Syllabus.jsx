import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Syllabus = () => {

  const [syllabus, setSyllabus] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL; // using env variable

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/syllabus/`);
        setSyllabus(response.data);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      }
    };
    fetchData();
  }, [baseUrl]);

  return (
    <div className='fluid'>
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
                  <img width={12} src="/img/pdf_logo.png" alt="PDF" /> {value.syllabus.split("/").pop()}
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
