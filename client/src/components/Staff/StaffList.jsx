import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}/api/staff/`;

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionOpenIndex, setActionOpenIndex] = useState(null);
  const pageSize = 5;

  const fetchStaffs = async () => {
    try {
      const res = await axios.get(API);
      setStaffs(res.data);
      setFilteredStaffs(res.data);
    } catch (err) {
      toast.error("Error fetching staff");
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  useEffect(() => {
    let data = staffs;
    if (searchName) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchId) {
      data = data.filter((s) =>
        s.staff_id.toLowerCase().includes(searchId.toLowerCase())
      );
    }
    if (departmentFilter) {
      data = data.filter((s) => s.department === departmentFilter);
    }
    setFilteredStaffs(data);
    setCurrentPage(1);
  }, [searchName, searchId, departmentFilter, staffs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await axios.delete(`${API}${id}/`);
      toast.success("Staff deleted!");
      fetchStaffs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStaffs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staffs");
    XLSX.writeFile(wb, "staffs.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      "Staff ID",
      "Name",
      "Mobile",
      "Email",
      "Department",
      "Address",
      "Join Date",
      "Salary",
      "Skills",
    ];
    const rows = filteredStaffs.map((s) => [
      s.staff_id,
      s.name,
      s.mobile,
      s.email,
      s.department,
      s.address,
      s.date_of_join,
      s.salary,
      s.skills?.join(", "),
    ]);
    doc.autoTable({ head: [columns], body: rows });
    doc.save("staffs.pdf");
  };

  const departments = [...new Set(staffs.map((s) => s.department))];
  const totalPages = Math.ceil(filteredStaffs.length / pageSize);
  const paginatedStaffs = filteredStaffs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="fluid mt-4">
      <h3 className="text-center mb-4 text-light rounded p-1 bg-success fw-bold">
        Staff Management
      </h3>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Search by Name"
            className="form-control"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Search by Staff ID"
            className="form-control"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">Filter by Department</option>
            {departments.map((dep, idx) => (
              <option key={idx} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3 text-end">
          <button className="btn btn-success me-2" onClick={handleExportExcel}>
            📊
          </button>
          <button className="btn btn-danger" onClick={handleExportPDF}>
            📄
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>Sr. No.</th>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Department</th>
              <th>Address</th>
              <th>Join Date</th>
              <th>Salary</th>
              <th>Skills</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaffs.map((s, index) => (
              <tr key={s.id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>{s.staff_id}</td>
                <td>{s.name}</td>
                <td>{s.mobile}</td>
                <td>{s.email}</td>
                <td>{s.department}</td>
                <td>{s.address}</td>
                <td>{s.date_of_join}</td>
                <td>{s.salary}</td>
                <td>{s.skills?.join(", ")}</td>
                <td style={{ position: "relative" }}>
                  <div className="position-relative">
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        setActionOpenIndex(
                          actionOpenIndex === index ? null : index
                        )
                      }
                    >
                      ⋮
                    </button>
                    {actionOpenIndex === index && (
                      <div
                        className="position-absolute bg-light border rounded shadow p-1"
                        style={{ top: "100%", right: 0, zIndex: 1000 }}
                      >
                        <Link
                          to={`stfm/${s.id}`}
                          className="btn btn-sm btn-outline-info w-100 mb-1"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger w-100 mb-1"
                          onClick={() => handleDelete(s.id)}
                        >
                          🗑️ Delete
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary w-100"
                          onClick={() => setSelectedStaff(s)}
                        >
                          📄 More
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {[...Array(totalPages).keys()].map((n) => (
            <li
              key={n + 1}
              className={`page-item ${
                currentPage === n + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {selectedStaff && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ background: "#000000aa" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Staff Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedStaff(null)}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered">
                  <tbody>
                    {Object.entries(selectedStaff).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>
                          {Array.isArray(value)
                            ? value.join(", ")
                            : value?.toString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedStaff(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
