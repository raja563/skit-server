import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API = "http://127.0.0.1:8000/api/enquiry/";

const ContactData = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(API)
      .then(res => {
        setEnquiries(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch enquiries", err);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this enquiry?")) {
      axios.delete(`${API}${id}/`)
        .then(() => {
          setEnquiries(prev => prev.filter(e => e.id !== id));
        })
        .catch(err => {
          console.error("Delete failed", err);
        });
    }
  };

  const uniqueSubjects = [...new Set(enquiries.map(e => e.subject))];
  const subjectOptions = uniqueSubjects.map(s => ({ label: s, value: s }));

  const filtered = useMemo(() => {
    if (!subjectFilter) return enquiries;
    return enquiries.filter(e => e.subject === subjectFilter.value);
  }, [enquiries, subjectFilter]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page to 1 on subject filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [subjectFilter]);

  const exportToExcel = () => {
    const wsData = [
      ["Sr No", "Name", "Phone", "Email", "Address", "Subject", "Message"],
      ...filtered.map((e, i) => [
        i + 1,
        e.name,
        e.phone,
        e.email,
        e.address,
        e.subject,
        e.message
      ])
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Enquiries");
    XLSX.writeFile(wb, "enquiries.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Enquiry List", 10, 10);
    autoTable(doc, {
      startY: 16,
      head: [["Sr No", "Name", "Phone", "Email", "Address", "Subject", "Message"]],
      body: filtered.map((e, i) => [
        i + 1,
        e.name,
        e.phone,
        e.email,
        e.address,
        e.subject,
        e.message
      ]),
      styles: { fontSize: 9, cellWidth: 'wrap' },
      columnStyles: {
        6: { cellWidth: 60 },
      },
    });
    doc.save("enquiries.pdf");
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          
      <h2 className="mb-4 text-center bg-success p-1">Enquiry List</h2>

      <div className="row mb-1">
        <div className="col-md-4 mb-2 text-dark">
          <Select
            isClearable
            options={subjectOptions}
            placeholder="Filter by Subject"
            value={subjectFilter}
            onChange={setSubjectFilter}
          />
        </div>
        <div className="col-md-8 d-flex gap-2">
          <button className="btn btn-success" onClick={exportToExcel}>Export to Excel</button>
          <button className="btn btn-danger" onClick={exportToPDF}>Export to PDF</button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No enquiries found.</td>
                  </tr>
                ) : (
                  currentItems.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{entry.name}</td>
                      <td>{entry.phone}</td>
                      <td>{entry.email}</td>
                      <td>{entry.address}</td>
                      <td>{entry.subject}</td>
                      <td>{entry.message}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button onClick={() => paginate(i + 1)} className="page-link">
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
        </div>
      </div>
  );
};

export default ContactData;
