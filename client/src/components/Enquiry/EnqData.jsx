import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ API now uses environment variable
const API = `${import.meta.env.VITE_API_URL}/api/quickenq/`;

const EnqData = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [courseFilter, setCourseFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        setEnquiries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch enquiries:", err);
        setLoading(false);
      });
  }, []);

  const uniqueCourses = [...new Set(enquiries.map((e) => e.course))];
  const courseOptions = uniqueCourses.map((c) => ({ label: c, value: c }));

  const filtered = useMemo(() => {
    if (!courseFilter) return enquiries;
    return enquiries.filter((e) => e.course === courseFilter.value);
  }, [enquiries, courseFilter]);

  useEffect(() => setCurrentPage(1), [courseFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage
  );

  const exportToExcel = () => {
    const wsData = [
      ["Sr No", "Name", "Mobile", "Email", "Course"],
      ...filtered.map((e, i) => [
        i + 1,
        e.name,
        e.mobile,
        e.email,
        e.course,
      ]),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "QuickEnquiries");
    XLSX.writeFile(wb, "quick_enquiries.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Quick Enquiries", 10, 10);
    autoTable(doc, {
      startY: 16,
      head: [["Sr No", "Name", "Mobile", "Email", "Course"]],
      body: filtered.map((e, i) => [
        i + 1,
        e.name,
        e.mobile,
        e.email,
        e.course,
      ]),
      styles: { fontSize: 9, cellWidth: "wrap" },
      columnStyles: { 4: { cellWidth: 40 } },
    });
    doc.save("quick_enquiries.pdf");
  };

  return (
    <div className="fluid mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 text-center bg-success text-white p-2">
            Quick Enquiries
          </h2>

          <div className="row mb-3">
            <div className="col-md-4 mb-2 text-dark">
              <Select
                isClearable
                options={courseOptions}
                placeholder="Search by Course"
                value={courseFilter}
                onChange={setCourseFilter}
              />
            </div>
            <div className="col-md-8 d-flex gap-2">
              <button onClick={exportToExcel} className="btn btn-success">
                Export Excel
              </button>
              <button onClick={exportToPDF} className="btn btn-danger">
                Export PDF
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center">No enquiries found.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Course</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td>{indexOfFirstItem + idx + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.mobile}</td>
                        <td>{item.email}</td>
                        <td>{item.course}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <nav className="d-flex justify-content-center mt-3">
                <ul className="pagination mb-0">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        onClick={() => setCurrentPage(i + 1)}
                        className="page-link"
                      >
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

export default EnqData;
