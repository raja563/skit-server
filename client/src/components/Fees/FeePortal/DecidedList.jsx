import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DecidedList = () => {
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Base URL from environment
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tuition, exam, hostel, transport, studentRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/decideFees/`),
          axios.get(`${BASE_URL}/api/dEfee/`),
          axios.get(`${BASE_URL}/api/dHfee/`),
          axios.get(`${BASE_URL}/api/dTfee/`),
          axios.get(`${BASE_URL}/api/student/`) // Student model data
        ]);

        const studentMapData = new Map();
        studentRes.data.forEach(std => {
          studentMapData.set(std.student_id, {
            name: std.name,
            batch: std.session,
            department: std.course
          });
        });

        const studentMap = new Map();

        [...tuition.data, ...exam.data, ...hostel.data, ...transport.data].forEach(item => {
          const id = item.student;
          const studentInfo = studentMapData.get(id) || {};

          if (!studentMap.has(id)) {
            studentMap.set(id, {
              student_id: id,
              name: studentInfo.name || '',
              batch: studentInfo.batch || '',
              department: studentInfo.department || '',
              decidedamt: 'N/A',
              examfee: 'N/A',
              hostelfee: 'N/A',
              transportationfee: 'N/A'
            });
          }

          const entry = studentMap.get(id);
          if (item.decidedamt !== undefined) entry.decidedamt = item.decidedamt;
          if (item.decidedexamfee !== undefined) entry.examfee = item.decidedexamfee;
          if (item.decidedhostelfee !== undefined) entry.hostelfee = item.decidedhostelfee;
          if (item.decidedtransportfee !== undefined) entry.transportationfee = item.decidedtransportfee;
        });

        setFees(Array.from(studentMap.values()));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const filteredFees = fees.filter(value =>
    value.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (departmentFilter === '' || value.department === departmentFilter) &&
    (batchFilter === '' || value.batch === batchFilter)
  );

  const pageCount = Math.ceil(filteredFees.length / itemsPerPage);
  const displayedFees = filteredFees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const departments = [...new Set(fees.map(f => f.department))];
  const batches = [...new Set(fees.map(f => f.batch))];

  return (
    <div className="fluid">
      <h4 className='text-center text-white p-1 bg-success'>Decided Fees List</h4>

      <div className="d-flex gap-2 flex-wrap justify-content-between my-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ maxWidth: '200px' }}
        />

        <select className="form-select" value={departmentFilter} onChange={(e) => {
          setDepartmentFilter(e.target.value);
          setCurrentPage(1);
        }} style={{ maxWidth: '200px' }}>
          <option value="">All Departments</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>

        <select className="form-select" value={batchFilter} onChange={(e) => {
          setBatchFilter(e.target.value);
          setCurrentPage(1);
        }} style={{ maxWidth: '200px' }}>
          <option value="">All Batches</option>
          {batches.map((batch, index) => (
            <option key={index} value={batch}>{batch}</option>
          ))}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Batch</th>
              <th>Department</th>
              <th>Tuition Fees</th>
              <th>Exam Fees</th>
              <th>Hostel Fees</th>
              <th>Transportation Fees</th>
            </tr>
          </thead>
          <tbody>
            {displayedFees.length === 0 ? (
              <tr><td colSpan="9" className="text-center">No data found</td></tr>
            ) : (
              displayedFees.map((value, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{value.student_id}</td>
                  <td>{value.name}</td>
                  <td>{value.batch}</td>
                  <td>{value.department}</td>
                  <td>{value.decidedamt !== 'N/A' ? value.decidedamt : 'N/A'}</td>
                  <td>{value.examfee !== 'N/A' ? value.examfee : 'N/A'}</td>
                  <td>{value.hostelfee !== 'N/A' ? value.hostelfee : 'N/A'}</td>
                  <td>{value.transportationfee !== 'N/A' ? value.transportationfee : 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>Page {currentPage} of {pageCount}</span>
        <div className="btn-group">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecidedList;
