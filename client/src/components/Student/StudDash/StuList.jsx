import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

const StuList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [actionOpenIndex, setActionOpenIndex] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getStudentsURL = 'http://127.0.0.1:8000/api/student/';

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(getStudentsURL);
      setStudents(response.data);
    };
    fetchData();
  }, []);

  const filtered = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (courseFilter === '' || student.course === courseFilter) &&
    (batchFilter === '' || student.session === batchFilter)
  );

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const departments = [...new Set(students.map(s => s.course))];
  const batches = [...new Set(students.map(s => s.session))];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(stu => ({
      'Student ID': stu.student_id,
      'Name': stu.name,
      'DOB': stu.dob,
      'Address': stu.address,
      'Email': stu.email,
      'Phone': stu.mobile,
      'Course': stu.course,
      'Batch': stu.session
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students_list.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Student ID', 'Name', 'DOB', 'Address', 'Email', 'Phone', 'Course', 'Batch']],
      body: filtered.map(stu => [
        stu.student_id, stu.name, stu.dob, stu.address,
        stu.email, stu.mobile, stu.course, stu.session
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 167, 69] },
    });
    doc.save("students_list.pdf");
  };

  const handleMoreClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await axios.delete(`http://127.0.0.1:8000/api/student/${id}/`);
      toast.success(res.data.msg || "Student deleted successfully!");
      setStudents(students.filter(s => s.student_id !== id));
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.msg || "Student is linked to another table", {
          duration: 5000,
          position: 'top-center',
        });
      } else {
        toast.error("Deletion failed. Try again.");
      }
    }
  };

  return (
    <div className="mt-3 px-3 w-100">
      <h1 className='text-start text-white bg-success p-2 w-100'>Student Information</h1>

      {/* Filters & Export Buttons */}
      <div className="d-flex flex-wrap gap-2 mb-3 justify-content-between align-items-center">
        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ maxWidth: 200 }}
          />

          <select
            className="form-select"
            value={courseFilter}
            onChange={e => {
              setCourseFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ maxWidth: 200 }}
          >
            <option value="">All Departments</option>
            {departments.map((dept, i) => <option key={i} value={dept}>{dept}</option>)}
          </select>

          <select
            className="form-select"
            value={batchFilter}
            onChange={e => {
              setBatchFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ maxWidth: 200 }}
          >
            <option value="">All Batches</option>
            {batches.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="btn-group">
          <button className="btn btn-outline-success" onClick={exportToExcel}>Export Excel</button>
          <button className="btn btn-outline-danger" onClick={exportToPDF}>Export PDF</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className='table table-hover table-bordered'>
          <thead className='text-danger bg-dark'>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone No.</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan="8" className="text-center">No students found</td></tr>
            ) : (
              displayed.map((student, index) => (
                <tr key={student.student_id}>
                  <th scope='row'>{student.student_id}</th>
                  <td>{student.name}</td>
                  <td>{student.dob}</td>
                  <td>{student.address}</td>
                  <td>{student.email}</td>
                  <td>{'+91 ' + student.mobile}</td>
                  <td>{student.course}</td>
                  <td style={{ position: 'relative' }}>
                    <div className="position-relative">
                      <button
                        className="btn btn-sm"
                        onClick={() => setActionOpenIndex(actionOpenIndex === index ? null : index)}
                      >
                        <FaEllipsisV className="text-primary" />
                      </button>
                      {actionOpenIndex === index && (
                        <div className="position-absolute bg-light border rounded p-1 shadow"
                          style={{ top: '100%', left: 0, zIndex: 10, minWidth: 100 }}>
                          <button className="btn btn-sm btn-outline-danger d-block w-100 mb-1"
                            onClick={() => handleDelete(student.student_id)}>
                            <FaTrash />
                          </button>

                          <Link to={`stuadd/${student.student_id}`} className="btn btn-sm btn-outline-info d-block w-100">
                            <FaEdit />
                          </Link>

                          <button className="btn btn-sm btn-outline-secondary d-block w-100 mt-1"
                            onClick={() => handleMoreClick(student)}>
                            More
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>Page {currentPage} of {pageCount}</span>
        <div className="btn-group">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="btn btn-secondary"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Student Info Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Student Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={`http://127.0.0.1:8000${selectedStudent.image}`}
                  alt="Profile"
                  className="img-fluid rounded shadow"
                />
                <p className="mt-2"><strong>Signature:</strong></p>
                <img
                  src={`http://127.0.0.1:8000${selectedStudent.sign}`}
                  alt="Signature"
                  className="img-fluid rounded shadow"
                />
              </div>
              <div className="col-md-8">
                <p><strong>Roll No.:</strong> {selectedStudent.student_id}</p>
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Father's Name:</strong> {selectedStudent.father}</p>
                <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                <p><strong>Date of Birth:</strong> {selectedStudent.dob}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
                <p><strong>Mobile:</strong> {selectedStudent.mobile}</p>
                <p><strong>Address:</strong> {selectedStudent.address}</p>
                <p><strong>Course:</strong> {selectedStudent.course}</p>
                <p><strong>Session:</strong> {selectedStudent.session}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StuList;
