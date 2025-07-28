// CareerList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const CareerList = () => {
  const [careers, setCareers] = useState([]);
  const [filterDept, setFilterDept] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}/api/career/`);
    setCareers(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async id => {
    await axios.delete(`${API_URL}/api/career/${id}/`);
    fetchData();
  };

  const handleDeleteAll = async () => {
    await axios.delete(`${API_URL}/api/career/`);
    fetchData();
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(careers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Careers');
    XLSX.writeFile(wb, 'career_data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Position', 'Email', 'Phone']],
      body: careers.map(c => [c.name, c.position_applied, c.email, c.phone]),
    });
    doc.save('career_data.pdf');
  };

  const filteredCareers = careers.filter(career => {
    const deptMatch = !filterDept || career.position_applied.toLowerCase().includes(filterDept.toLowerCase());
    const monthMatch = !filterMonth || new Date(career.applied_on).getMonth() + 1 === parseInt(filterMonth);
    return deptMatch && monthMatch;
  });

  return (
    <div className="fluid dark">
      <div className="row">
        <div className="col-sm-11 col-md-10 mx-auto">
          <h2 className="mb-3 text-light bg-primary p-2 mt-4 rounded text-center">Career Applications</h2>

          <div className="d-flex gap-3 mb-3">
            <span className='text-warning bg-dark mx-4 mt-4 p-2 rounded'>
              <Link className="text-warning m-4" to='/'>Home</Link>
              <Link className='text-warning' to={'/dashboard'}>Dashboard</Link>
            </span>
            <input
              type="text"
              placeholder="Filter by Department"
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="form-control"
            />
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              className="form-control"
            >
              <option value="">Filter by Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <Button variant="danger" onClick={handleDeleteAll}>Delete All</Button>
            <Button variant="success" onClick={exportToExcel}>Export Excel</Button>
            <Button variant="primary" onClick={exportToPDF}>Export PDF</Button>
          </div>

          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCareers.map(career => (
                <tr key={career.id}>
                  <td>{career.name}</td>
                  <td>{career.position_applied}</td>
                  <td>{career.email}</td>
                  <td>{career.phone}</td>
                  <td>{new Date(career.applied_on).toLocaleDateString()}</td>
                  <td>
                    <Button size="sm" variant="info" onClick={() => { setSelectedCareer(career); setShowModal(true); }}>More</Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(career.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{selectedCareer?.name} — Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Address:</strong> {selectedCareer?.address}</p>
              <p><strong>Phone:</strong> {selectedCareer?.phone}</p>
              <p><strong>Email:</strong> {selectedCareer?.email}</p>
              <p><strong>Position:</strong> {selectedCareer?.position_applied}</p>
              <p><strong>Qualification:</strong> {selectedCareer?.qualification}</p>
              <p><strong>Experience:</strong> {selectedCareer?.experience}</p>
              <p><strong>Applied On:</strong> {new Date(selectedCareer?.applied_on).toLocaleString()}</p>
              {selectedCareer?.resume && (
                <a
                  href={`${API_URL}${selectedCareer.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CareerList;
