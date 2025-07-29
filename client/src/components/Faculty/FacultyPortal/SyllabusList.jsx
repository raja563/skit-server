import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SyllabusList = () => {
  const [syllabus, setSyllabus] = useState([]);

  const baseUrl = import.meta.env.VITE_API_URL; // using env variable

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/syllabus/`);
        setSyllabus(response.data);
      } catch (error) {
        console.error('Failed to fetch syllabus:', error);
      }
    };
    fetchData();
  }, [baseUrl]);

  return (
    <>
      <div className='w-100'>
        <h4 className='text-center bg-danger p-1'>BCA / BBA Syllabus</h4>
        <table className="table table-hover">
          <thead>
            <tr className='text-center'>
              <th>YEAR</th>
              <th>SYLLABUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {syllabus.map((value, key) => (
              <tr key={key}>
                <th>{value.year}</th>
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
                <td>
                  <button className='btn btn-danger'>delete</button>
                  <button className='btn btn-info mx-1'>edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SyllabusList;
