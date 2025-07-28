import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEllipsisV, FaDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const GetAllFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [actionOpenIndex, setActionOpenIndex] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/faculty/register/`);
        setFaculty(response.data);
        setFilteredFaculty(response.data);
      } catch (error) {
        toast.error("Failed to fetch faculty data.");
      }
    };
    fetchData();
  }, [API_URL]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;
    try {
      await axios.delete(`${API_URL}/api/faculty/${id}/`);
      const updated = faculty.filter(faculty => faculty.id !== id);
      setFaculty(updated);
      setFilteredFaculty(updated);
      toast.success("Faculty deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete faculty.");
    }
  };

  const handleMore = (facultyData) => {
    setSelectedFaculty(facultyData);
    setShowModal(true);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = faculty.filter(item =>
      item.fullname.toLowerCase().includes(term) ||
      String(item.id).includes(term)
    );
    setFilteredFaculty(filtered);
    setCurrentPage(1);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID', 'Name', 'Email', 'Mobile', 'Department']],
      body: filteredFaculty.map(f => [f.id, f.fullname, f.email, f.mobile, f.department]),
    });
    doc.save('faculty_list.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredFaculty);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faculty');
    XLSX.writeFile(workbook, 'faculty_list.xlsx');
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredFaculty.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);

  return (
    <div className="container-fluid py-4">
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name or ID"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-8 text-end">
          <button onClick={exportToPDF} className="btn btn-danger me-2">
            <FaFilePdf /> PDF
          </button>
          <button onClick={exportToExcel} className="btn btn-success">
            <FaFileExcel /> Excel
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-12">
          <h4 className="text-center bg-secondary text-danger py-2 rounded">Faculty List</h4>

          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center">
              <thead className="thead-dark">
                <tr>
                  <th>SR.NO.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>MOBILE</th>
                  <th>ADDRESS</th>
                  <th>DEPARTMENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr><td colSpan="7" className="text-warning">No records found.</td></tr>
                ) : (
                  currentData.map((value, index) => (
                    <tr key={value.id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td className="d-flex align-items-center gap-2">
                        {value.profile && (
                          <img
                            src={`${API_URL}${value.profile}`}
                            alt=""
                            width="40"
                            height="40"
                            className="border rounded"
                          />
                        )}
                        {value.fullname}
                      </td>
                      <td>{value.email}</td>
                      <td>{value.mobile}</td>
                      <td>{value.address}</td>
                      <td>{value.department}</td>
                      <td style={{ position: 'relative' }}>
                        <button className="btn btn-sm" onClick={() => setActionOpenIndex(actionOpenIndex === index ? null : index)}>
                          <FaEllipsisV className="text-primary" />
                        </button>
                        {actionOpenIndex === index && (
                          <div className="position-absolute bg-light border rounded p-1 shadow" style={{ top: '100%', left: 0, zIndex: 10, minWidth: 100 }}>
                            <button className="btn btn-sm btn-outline-danger d-block w-100 mb-1" onClick={() => deleteUser(value.id)}>
                              <FaTrash /> Delete
                            </button>
                            <Link
                              to={`register/${value.id}`}
                              className="btn btn-sm btn-outline-info d-block w-100 mb-1"
                            >
                              <FaEdit /> Edit
                            </Link>
                            <button className="btn btn-sm btn-outline-secondary d-block w-100" onClick={() => handleMore(value)}>
                              More
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-center mt-3">
            {[...Array(totalPages).keys()].map(page => (
              <button
                key={page + 1}
                onClick={() => setCurrentPage(page + 1)}
                className={`btn btn-sm mx-1 ${currentPage === page + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                {page + 1}
              </button>
            ))}
          </div>

          {/* Modal for Faculty Details */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton className="bg-success text-white">
              <Modal.Title>Faculty Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedFaculty && (
                <div className="p-1">
                  <div className="text-center mb-2">
                    {selectedFaculty.profile ? (
                      <img
                        src={`${API_URL}${selectedFaculty.profile}`}
                        alt="Profile"
                        className="rounded border shadow-lg"
                        width="250"
                        height="250"
                        style={{ objectFit: 'cover', transform: 'rotateY(0deg)', transition: 'transform 0.3s' }}
                      />
                    ) : (
                      <div className="text-muted">No Profile Image</div>
                    )}
                  </div>

                  <div className="bg-light p-4 rounded shadow-sm border">
                    <div className="row mb-1">
                      <div className="col-md-6"><strong>Full Name:</strong> {selectedFaculty.fullname}</div>
                      <div className="col-md-6"><strong>Father's Name:</strong> {selectedFaculty.fname}</div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-md-6"><strong>Gender:</strong> {selectedFaculty.gender}</div>
                      <div className="col-md-6"><strong>Date of Birth:</strong> {selectedFaculty.dobirth}</div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-md-6"><strong>Mobile:</strong> {selectedFaculty.mobile}</div>
                      <div className="col-md-6"><strong>Email:</strong> {selectedFaculty.email}</div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-md-6"><strong>Qualification:</strong> {selectedFaculty.qualification}</div>
                      <div className="col-md-6"><strong>Department:</strong> {selectedFaculty.department}</div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-md-6"><strong>Joining Date:</strong> {selectedFaculty.dojoin}</div>
                      <div className="col-md-6"><strong>Address:</strong> {selectedFaculty.address}</div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <strong>Resume:</strong>{' '}
                        {selectedFaculty.resume ? (
                          <a
                            href={`${API_URL}${selectedFaculty.resume}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-primary mt-1"
                          >
                            <FaDownload /> Download Resume
                          </a>
                        ) : (
                          <span className="text-muted">No resume uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default GetAllFaculty;
