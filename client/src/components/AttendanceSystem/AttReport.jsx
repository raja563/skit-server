import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaSync,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";


const API = import.meta.env.VITE_API_URL;
const ATTENDANCE_ENDPOINT = `${API}/api/attendance-records/`;
const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AttReport({ apiUrl }) {
  const endpoint = apiUrl || ATTENDANCE_ENDPOINT;
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [chartType, setChartType] = useState("bar"); // ✅ toggle chart view

  const reportRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(endpoint);
      const data = Array.isArray(res.data) ? res.data : res.data.results ?? [];
      setRawData(
        data.map((r) => ({
          id: r.id,
          date: r.date ?? null,
          timestamp: r.timestamp ?? null,
          student_id:
            r.student_code ?? r.student?.student_id ?? r.student_id ?? "",
          name: r.name ?? r.student?.name ?? "",
          course: r.course ?? r.student?.course ?? "",
          status: r.status ?? "",
          time_in: r.time_in ?? null,
          time_out: r.time_out ?? null,
          month:
            r.month ??
            (r.date
              ? new Date(r.date).toLocaleString("default", { month: "long" })
              : ""),
          day:
            r.day ??
            (r.date
              ? new Date(r.date).toLocaleString("default", { weekday: "long" })
              : ""),
          verified_by_face: !!r.verified_by_face,
          confidence_score: r.confidence_score ?? null,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load data from API");
      setRawData([]);
    } finally {
      setLoading(false);
    }
  }

  const courses = useMemo(() => {
    const s = new Set(rawData.map((r) => r.course).filter(Boolean));
    return ["", ...Array.from(s)];
  }, [rawData]);

  const statuses = useMemo(() => {
    const s = new Set(rawData.map((r) => r.status).filter(Boolean));
    return ["", ...Array.from(s)];
  }, [rawData]);

  const filtered = useMemo(() => {
    return rawData.filter((r) => {
      const matchesCourse = courseFilter ? r.course === courseFilter : true;
      const matchesStatus = statusFilter ? r.status === statusFilter : true;
      const recordDate = new Date(r.date || r.timestamp);
      const matchesDate =
        (!fromDate || recordDate >= new Date(fromDate)) &&
        (!toDate ||
          recordDate <= new Date(new Date(toDate).setHours(23, 59, 59)));
      const q = search.trim().toLowerCase();
      const matchesSearch = q
        ? [r.name, r.student_id, r.course].some((v) =>
            String(v || "").toLowerCase().includes(q)
          )
        : true;
      return matchesCourse && matchesStatus && matchesDate && matchesSearch;
    });
  }, [rawData, courseFilter, statusFilter, fromDate, toDate, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const attendanceByDate = useMemo(() => {
    const map = {};
    filtered.forEach((r) => {
      const d = (r.date || r.timestamp || "").slice(0, 10);
      if (!d) return;
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  const statusDistribution = useMemo(() => {
    const map = {};
    filtered.forEach(
      (r) => (map[r.status || "Unknown"] = (map[r.status || "Unknown"] || 0) + 1)
    );
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const lineData = attendanceByDate;

  const formatTime = (time) => {
    if (!time) return "--";
    const d = new Date(`1970-01-01T${time}`);
    return isNaN(d.getTime())
      ? time.slice(0, 5)
      : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(filtered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `attendance_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  function exportCSV() {
    if (!filtered.length) return;
    const csv = [Object.keys(filtered[0] || {})]
      .concat(filtered.map((r) => Object.values(r)))
      .map((row) =>
        row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    saveAs(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
      `attendance_${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  async function exportPDF() {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`attendance_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  useEffect(
    () => setPage(1),
    [courseFilter, statusFilter, fromDate, toDate, search, perPage]
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📘 Attendance Reports</h2>

      {/* ✅ Filter & Action Row */}
      <div style={styles.toolbar}>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} style={styles.select}>
          <option value="">All Courses</option>
          {courses.map((c) => c && <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
          <option value="">All Status</option>
          {statuses.map((s) => s && <option key={s} value={s}>{s}</option>)}
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={styles.input} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.input} />

        <input
          type="text"
          placeholder="🔍 Search name / id / course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <button onClick={() => { setCourseFilter(""); setStatusFilter(""); setFromDate(""); setToDate(""); setSearch(""); }} style={styles.btnIcon}>
          <FaSync /> Reset
        </button>

        {/* Export Buttons */}
        <div style={styles.exportGroup}>
          <button onClick={exportExcel} style={styles.btnIcon}><FaFileExcel /> Excel</button>
          <button onClick={exportCSV} style={styles.btnIcon}><FaFileCsv /> CSV</button>
          <button onClick={exportPDF} style={styles.btnIcon}><FaFilePdf /> PDF</button>
        </div>

        {/* Chart Type Toggle */}
        <button onClick={() => setChartType(chartType === "bar" ? "line" : "bar")} style={styles.btnIcon}>
          {chartType === "bar" ? <FaChartLine /> : <FaChartBar />} Chart
        </button>
      </div>

      {/* Charts Section */}
      <div style={styles.chartRow} ref={reportRef}>
        <div style={styles.card}>
          <h4>📅 Attendance by Date</h4>
          <ResponsiveContainer width="100%" height={250}>
            {chartType === "bar" ? (
              <BarChart data={attendanceByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[0]} />
              </BarChart>
            ) : (
              <LineChart data={attendanceByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={COLORS[1]} strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h4>📊 Status Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusDistribution} dataKey="value" nameKey="name" outerRadius={70} label>
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableTop}>
          <div><strong>{filtered.length}</strong> records</div>
          <div>
            Per page:{" "}
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              {["#", "Date", "Student ID", "Name", "Course", "Time In", "Time Out", "Status"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((r, idx) => (
              <tr key={r.id || idx} style={styles.tr}>
                <td style={styles.td}>{(page - 1) * perPage + idx + 1}</td>
                <td style={styles.td}>{r.date ? new Date(r.date).toLocaleDateString() : ""}</td>
                <td style={styles.td}>{r.student_id}</td>
                <td style={styles.td}>{r.name}</td>
                <td style={styles.td}>{r.course}</td>
                <td style={styles.td}>{formatTime(r.time_in)}</td>
                <td style={styles.td}>{formatTime(r.time_out)}</td>
                <td style={styles.td}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
<div className="d-flex justify-content-between align-items-center mt-3 p-2 border-top bg-light rounded">
  <div className="fw-medium">
    Page {page} / {totalPages}
  </div>
  <div className="btn-group" role="group" aria-label="Pagination">
    <button
      className="btn btn-primary btn-sm"
      onClick={() => setPage(1)}
      disabled={page === 1}
    >
      First
    </button>
    <button
      className="btn btn-primary btn-sm"
      onClick={() => setPage((p) => Math.max(1, p - 1))}
      disabled={page === 1}
    >
      Prev
    </button>
    <button
      className="btn btn-primary btn-sm"
      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      disabled={page === totalPages}
    >
      Next
    </button>
    <button
      className="btn btn-primary btn-sm"
      onClick={() => setPage(totalPages)}
      disabled={page === totalPages}
    >
      Last
    </button>
  </div>
</div>

      </div>

      {loading && <div style={{ color: "gray" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

/* 🎨 Inline Styles */
const styles = {
  container: {
    padding: 20,
    background: "#f8fafc",
    color: "#111827",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  title: { marginBottom: 10 },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    background: "#fff",
    padding: 10,
    borderRadius: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  select: { padding: 6, borderRadius: 6, border: "1px solid #ccc" },
  input: { padding: 6, borderRadius: 6, border: "1px solid #ccc" },
  search: { padding: 6, minWidth: 180, borderRadius: 6, border: "1px solid #ccc" },
  btnIcon: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#2563eb",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
  exportGroup: { display: "flex", gap: 6 },
  chartRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 10,
  },
  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  tableCard: {
    background: "#fff",
    marginTop: 10,
    borderRadius: 8,
    padding: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  tableTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: 8, textAlign: "left", borderBottom: "1px solid #ddd" },
  td: { padding: 8, borderBottom: "1px solid #f0f0f0" },
  tr: { background: "#fff" },
  pagination: {
    marginTop: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
