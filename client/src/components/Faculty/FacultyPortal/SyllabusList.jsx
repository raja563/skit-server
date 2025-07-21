import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const SyllabusList = () => {

    
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
  )
}

export default SyllabusList
