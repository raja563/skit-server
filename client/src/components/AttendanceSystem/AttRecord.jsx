import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFileExcel, FaFilePdf, FaSync, FaInfoCircle } from "react-icons/fa"; // FaInfoCircle added for Info/Detail button

// ⚠️ IMPORTANT: If you are using Bootstrap, ensure you have it imported in your main app.
// For the modal functionality, we will use simple state and conditional rendering
// to simulate a modal, as full Bootstrap JS might not be available.

const API = import.meta.env.VITE_API_URL;
const API_URL = `${API}/api/attendance-records/`;

/**
 * Attendance Records Component with Filtering, Pagination, Export, and Details Modal.
 */
export default function AttRecord() {
    const [course, setCourse] = useState("");
    const [year, setYear] = useState("");
    const [searchName, setSearchName] = useState("");
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // --- Detail Modal State ---
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // 1. Time Formatting Helper (from original component 1)
    const formatTime = (timeString) => {
        if (!timeString) return "—";

        try {
            const parts = timeString.split(':');
            if (parts.length < 2) return timeString; 

            const hours = parseInt(parts[0], 10);
            const minutes = parts[1];
            
            const ampm = hours >= 12 ? 'PM' : 'AM';
            let displayHours = hours % 12;
            displayHours = displayHours === 0 ? 12 : displayHours; 

            return `${displayHours}:${minutes} ${ampm}`;
        } catch (e) {
            console.error("Error formatting time string:", timeString, e);
            return timeString;
        }
    };
    
    // 2. Status Logic Helper (from original component 1)
    const getDisplayStatus = (record) => {
        const baseStatus = record.status || "N/A";

        if (record.time_in && record.time_out) {
            return "Present";
        }
        if (record.time_in && !record.time_out) {
            return "Half Day";
        }
        
        return baseStatus; 
    };

    // 3. Data Fetching Logic (combined and improved)
    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (course) params.course = course;
            if (year) params.year = year;
            // Using a generic 'search' param for name/ID search
            if (searchName && searchName.trim() !== "") params.search = searchName.trim(); 

            const resp = await axios.get(API_URL, { params });

            const dataArray = Array.isArray(resp.data) ? resp.data : [];
            const uniqueRecords = dataArray.filter(
                (item, index, self) => index === self.findIndex((t) => t.id === item.id)
            );

            setRecords(uniqueRecords);
            setCurrentPage(1); // reset to first page on filter change
        } catch (err) {
            console.error("❌ Error fetching attendance records:", err);
            setRecords([]);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    }, [course, year, searchName]);

    // 4. useEffects for Filtering (from original component 1)
    // Filter by Course/Year immediately on change
    useEffect(() => {
        fetchRecords();
    }, [course, year, fetchRecords]);

    // Debounce the name search
    useEffect(() => {
        const handler = setTimeout(() => {
            // Only fetch if searchName changed, and only if it's not handled by the other useEffect
            if (searchName) {
                fetchRecords();
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [searchName, fetchRecords]);
    
    // 5. Pagination and Table Data (from original component 1)
    const totalPages = Math.max(1, Math.ceil(records.length / recordsPerPage));
    const startIndex = (currentPage - 1) * recordsPerPage;
    
    const currentRecords = useMemo(() => {
        return records.slice(startIndex, startIndex + recordsPerPage);
    }, [records, startIndex, recordsPerPage]);

    const goToPage = useCallback((pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [totalPages]);

    // 6. Export Functions (from original component 1)
    const exportToExcel = () => {
        if (!records.length) return alert("No records to export");

        const mapped = records.map((r, idx) => ({
            SNo: idx + 1,
            Roll: r.student_code ?? r.student?.student_id ?? "",
            Name: r.name ?? r.student?.name ?? "",
            Course: r.course ?? r.student?.course ?? "",
            Date: r.date ?? "",
            Day: r.day ?? "",
            "Time In": r.time_in ? formatTime(r.time_in) : "--",
            "Time Out": r.time_out ? formatTime(r.time_out) : "--",
            Status: getDisplayStatus(r), 
        }));

        const worksheet = XLSX.utils.json_to_sheet(mapped);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout]), `attendance_export_${Date.now()}.xlsx`);
    };

    const exportToPDF = () => {
        if (!records.length) return alert("No records to export");

        const doc = new jsPDF("landscape", "pt", "a4");
        doc.text("Attendance Report", 40, 40);
        const head = [
            ["SNo", "Roll", "Name", "Course", "Date", "Day", "Time In", "Time Out", "Status"],
        ];
        const body = records.map((r, idx) => [
            idx + 1,
            r.student_code ?? r.student?.student_id ?? "",
            r.name ?? r.student?.name ?? "",
            r.course ?? r.student?.course ?? "",
            r.date ?? "",
            r.day ?? "",
            r.time_in ? formatTime(r.time_in) : "--",
            r.time_out ? formatTime(r.time_out) : "--",
            getDisplayStatus(r), 
        ]);
        doc.autoTable({ head, body, startY: 60, styles: { fontSize: 8 } });
        doc.save(`attendance_export_${Date.now()}.pdf`);
    };

    // 7. Reset Filters (from original component 1)
    const handleReset = useCallback(() => {
        setCourse("");
        setYear("");
        setSearchName("");
        fetchRecords(); 
    }, [fetchRecords]);

    // 8. Handle Info Action (New Functionality)
    const handleInfoClick = (record) => {
        setSelectedRecord({
            ...record,
            display_status: getDisplayStatus(record),
        });
        setShowDetailModal(true);
    };

    // 9. Year Options (from original component 1)
    const currentYear = new Date().getFullYear();
    const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => currentYear - i);

    // 10. Pagination Page Buttons (from original component 1)
    const pageButtons = useMemo(() => {
        const pages = [];
        const maxButtons = 7;
        let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let end = start + maxButtons - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxButtons + 1);
        }
        for (let p = start; p <= end; p++) pages.push(p);
        return pages;
    }, [currentPage, totalPages]);


    // --- Student Detail Modal Component ---
    const DetailModal = () => {
        if (!showDetailModal || !selectedRecord) return null;

        const r = selectedRecord;
        return (
            <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Student Attendance Details</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowDetailModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Name:</strong> <span>{r.name ?? r.student?.name ?? "N/A"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Roll/ID:</strong> <span>{r.student_code ?? r.student?.student_id ?? "N/A"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Course:</strong> <span>{r.course ?? r.student?.course ?? "N/A"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Date:</strong> <span>{r.date ?? "N/A"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Day:</strong> <span>{r.day ?? "N/A"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Time In:</strong> <span className="fw-bold">{r.time_in ? formatTime(r.time_in) : "--"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Time Out:</strong> <span className="fw-bold">{r.time_out ? formatTime(r.time_out) : "--"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong className="text-success">Current Status:</strong> <span className="fw-bold text-success">{r.display_status}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Confidence Score:</strong> <span>{r.confidence_score ? `${(r.confidence_score * 100).toFixed(2)}%` : "N/A"}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- Main Component Render ---
    return (
        <div className="container-fluid my-3" style={{ maxWidth: "98vw" }}>
            <h3 className="fw-bold mb-3 text-center text-primary">🟢 Attendance Records</h3>
            {showDetailModal && <DetailModal />}

            {/* Filters Row */}
            <div className="card shadow-sm mb-3">
                <div className="card-body p-3">
                    <div className="row g-2 align-items-end">
                        {/* Course Filter */}
                        <div className="col-md-3">
                            <label className="form-label" htmlFor="course-select">Course</label>
                            <select
                                id="course-select"
                                name="course"
                                className="form-select form-select-sm"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                aria-label="Department & Course"
                            >
                                <option value="">Department & Course (All)</option>
                                <optgroup label="Department of Computer Application">
                                    <option value="BCA">Bachelor of Computer Application (BCA)</option>
                                    <option value="MCA">Master of Computer Application (MCA)</option>
                                    <option value="PhD in Computer Application">Ph.D. in Computer Application</option>
                                </optgroup>
                                <optgroup label="Department of Pharmacy">
                                    <option value="D.Pharm">Diploma in Pharmacy (D.Pharm)</option>
                                    <option value="B.Pharm">Bachelor of Pharmacy (B.Pharm)</option>
                                    <option value="M.Pharm">Master of Pharmacy (M.Pharm)</option>
                                    <option value="PhD in Pharmacy">Ph.D. in Pharmacy</option>
                                </optgroup>
                                {/* ... other course options ... */}
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div className="col-md-2">
                            <label className="form-label" htmlFor="year-select">Year</label>
                            <select
                                id="year-select"
                                className="form-select form-select-sm"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                aria-label="Year"
                            >
                                <option value="">Year (All)</option>
                                {YEAR_OPTIONS.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name Search */}
                        <div className="col-md-4">
                            <label className="form-label" htmlFor="name-search">Search Name/ID</label>
                            <input
                                id="name-search"
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search by name or ID..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                aria-label="Search name"
                            />
                        </div>

                        {/* Export & Reset */}
                        <div className="col-md-3 d-flex gap-1 justify-content-end">
                            <button
                                className="btn btn-sm btn-success"
                                onClick={exportToExcel}
                                title="Export Excel"
                            >
                                <FaFileExcel size={14} /> Excel
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={exportToPDF}
                                title="Export PDF"
                            >
                                <FaFilePdf size={14} /> PDF
                            </button>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={handleReset}
                                title="Reset filters"
                            >
                                <FaSync size={12} /> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Table */}
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-sm mb-0 text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: "4%" }}>#</th>
                                <th style={{ width: "9%" }}>Roll</th>
                                <th style={{ width: "16%" }}>Name</th>
                                <th style={{ width: "12%" }}>Course</th>
                                <th style={{ width: "8%" }}>Date</th>
                                <th style={{ width: "7%" }}>Day</th>
                                <th style={{ width: "9%" }}>Time In</th>
                                <th style={{ width: "9%" }}>Time Out</th>
                                <th style={{ width: "12%" }}>Status</th>
                                <th style={{ width: "14%" }}>Action</th> {/* New Action Column */}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="py-4">
                                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        Loading records...
                                    </td>
                                </tr>
                            ) : currentRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="py-4">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                currentRecords.map((r, i) => (
                                    <tr key={r.id ?? `${startIndex + i}`}>
                                        <td>{startIndex + i + 1}</td>
                                        <td>{r.student_code ?? r.student?.student_id ?? "--"}</td>
                                        <td className="text-start">{r.name ?? r.student?.name ?? "--"}</td>
                                        <td>{r.course ?? r.student?.course ?? "--"}</td>
                                        <td>{r.date ?? "--"}</td>
                                        <td>{r.day ?? "--"}</td>
                                        <td>{r.time_in ? formatTime(r.time_in) : "--"}</td>
                                        <td>{r.time_out ? formatTime(r.time_out) : "--"}</td>
                                        <td>
                                            <span className={`badge ${getDisplayStatus(r) === "Present" ? "bg-success" : getDisplayStatus(r) === "Half Day" ? "bg-warning text-dark" : "bg-danger"}`}>
                                                {getDisplayStatus(r)}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-info btn-sm me-1"
                                                onClick={() => handleInfoClick(r)}
                                                title="View Details"
                                            >
                                                <FaInfoCircle size={12} /> Info
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination bottom */}
                {records.length > recordsPerPage && (
                    <div className="d-flex justify-content-between align-items-center p-3 flex-wrap border-top">
                        <div className="d-flex gap-2 align-items-center">
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {pageButtons.map((p) => (
                                <button
                                    key={p}
                                    className={`btn btn-sm ${p === currentPage ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => goToPage(p)}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>

                        <div>
                            <small className="text-muted">
                                Page **{currentPage}** of **{totalPages}** — Showing **{currentRecords.length}** of **{records.length}** records
                            </small>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
