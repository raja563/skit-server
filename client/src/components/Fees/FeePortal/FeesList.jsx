/***********************************************************************/
/*  FeesList.jsx — FULL component (drop‑in replacement)                */
/***********************************************************************/
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BASE_URL = import.meta.env.VITE_API_URL;

// Utility helpers
const fmt = (n) => (isNaN(n) ? "0.00" : Number(n).toFixed(2));
const formatDate = (iso) => (iso ? iso.split("T")[0] : "N/A");

const FeesList = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [receiptSearch, setRS] = useState("");
  const [department, setDept] = useState("");
  const [batch, setBatch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExp] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const LIMIT = 10;

  const toggleRow = (id) =>
    setExp((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          acadDec, examDec, hostDec, transDec,
          acadDep, examDep, hostDep, transDep,
          students
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/decideFees/`),
          axios.get(`${BASE_URL}/api/dEfee/`),
          axios.get(`${BASE_URL}/api/dHfee/`),
          axios.get(`${BASE_URL}/api/dTfee/`),
          axios.get(`${BASE_URL}/api/dpfees/`),
          axios.get(`${BASE_URL}/api/dpefee/`),
          axios.get(`${BASE_URL}/api/dphfee/`),
          axios.get(`${BASE_URL}/api/dptfee/`),
          axios.get(`${BASE_URL}/api/student/`)
        ]);

        const buildDec = (data, key) =>
          data.reduce((m, row) => {
            m[row.student] = parseFloat(row[key] ?? 0);
            return m;
          }, {});

        const decided = {
          academic: buildDec(acadDec.data, "decidedamt"),
          exam: buildDec(examDec.data, "decidedexamfee"),
          hostel: buildDec(hostDec.data, "decidedhostelfee"),
          transport: buildDec(transDec.data, "decidedtransportfee")
        };

        const deposits = new Map();
        const addDep = (arr, field, cat) => {
          arr.forEach((d) => {
            if (!deposits.has(d.student)) {
              deposits.set(d.student, {
                academic: 0,
                exam: 0,
                hostel: 0,
                transport: 0,
                transactions: []
              });
            }
            const e = deposits.get(d.student);
            e[cat] += parseFloat(d[field] ?? 0);
           e.transactions.push({
  receipt: d.receipt,
  amount: parseFloat(d[field] ?? 0),
  date: d.created_at,
  remark: d.remark ?? "",
  category: cat,
  payment_mode: d.payment_mode ?? "N/A",
  transaction_id: d.transaction_id ?? "N/A"
});

          });
        };
        addDep(acadDep.data, "dpfees", "academic");
        addDep(examDep.data, "dpexamfees", "exam");
        addDep(hostDep.data, "dphostelfees", "hostel");
       addDep(transDep.data, "dpTransportfees", "transport");  // fix the capital T

        const sInfo = new Map(
          students.data.map((s) => [
            s.student_id,
            {
              name: s.name,
              course: s.course,
              batch: `${s.session} (${s.course})`,
              department: s.course
            }
          ])
        );

        const out = [];
        Object.keys(decided.academic).forEach((id) => {
          const d = {
            academic: decided.academic[id] ?? 0,
            exam: decided.exam[id] ?? 0,
            hostel: decided.hostel[id] ?? 0,
            transport: decided.transport[id] ?? 0
          };
          const p = deposits.get(id) ?? {
            academic: 0,
            exam: 0,
            hostel: 0,
            transport: 0,
            transactions: []
          };
          const pend = {
            academic: d.academic - p.academic,
            exam: d.exam - p.exam,
            hostel: d.hostel - p.hostel,
            transport: d.transport - p.transport
          };
          const totalPend = Object.values(pend).reduce((a, b) => a + b, 0);
          const statusLabel = totalPend <= 0 ? "Settled" : "Pending";
          const stu = sInfo.get(id) ?? {};
          const latestTx = p.transactions.at(-1) ?? {};

          out.push({
            student_id: id,
            name: stu.name ?? "",
            batch: stu.batch ?? "",
            department: stu.department ?? "",
            decided: d,
            paid: p,
            pending: pend,
            receipt: latestTx.receipt ?? "N/A",
            payDate: formatDate(latestTx.date),
            status: statusLabel,
            transactions: p.transactions.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            )
          });
        });
        setRows(out);
      } catch (e) {
        console.error("Failed to load fee data:", e);
      }
    };
    fetchAll();
  }, []);

  const filtered = rows.filter((r) => {
    const nm = r.name.toLowerCase().includes(search.toLowerCase());
    const dep = department === "" || r.department === department;
    const bat = batch === "" || r.batch === batch;
    const recL = receiptSearch.toLowerCase();
    const rec =
      recL === "" ||
      r.receipt.toLowerCase().includes(recL) ||
      r.transactions.some((t) =>
        t.receipt.toLowerCase().includes(recL)
      );
    return nm && dep && bat && rec;
  });

  const pages = showAll ? 1 : Math.max(1, Math.ceil(filtered.length / LIMIT));
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages, page]);

  const slice = showAll
    ? filtered
    : filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const depts = [...new Set(rows.map((r) => r.department))];
  const batches = [...new Set(rows.map((r) => r.batch))];

  const makeFlat = (r) => ({
    "Student ID": r.student_id,
    "Student Name": r.name,
    "Session (Course)": r.batch,
    "Latest Receipt": r.receipt,
    "Latest Pay Date": r.payDate,
    "Dec Academic": fmt(r.decided.academic),
    "Dec Exam": fmt(r.decided.exam),
    "Dec Hostel": fmt(r.decided.hostel),
    "Dec Transport": fmt(r.decided.transport),
    "Paid Academic": fmt(r.paid.academic),
    "Paid Exam": fmt(r.paid.exam),
    "Paid Hostel": fmt(r.paid.hostel),
    "Paid Transport": fmt(r.paid.transport),
    "Pend Academic": fmt(r.pending.academic),
    "Pend Exam": fmt(r.pending.exam),
    "Pend Hostel": fmt(r.pending.hostel),
    "Pend Transport": fmt(r.pending.transport),
    Status: r.status
  });

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filtered.map(makeFlat));
    XLSX.utils.book_append_sheet(wb, ws, "Fees");
    XLSX.writeFile(wb, "FeesList.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });
    const head = [Object.keys(makeFlat(filtered[0] ?? {}))];
    const body = filtered.map((r) => Object.values(makeFlat(r)));
    doc.text("Student Fees Information", 40, 30);
    doc.autoTable({
      head,
      body,
      startY: 50,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [50, 50, 50] }
    });
    doc.save("FeesList.pdf");
  };

  return (
    <div className="container-fluid">
      <h4 className="text-center text-white p-1 bg-success">
        Student Fees Information
      </h4>

      {/* ▸ Toolbar ----------------------------------------- */}
     {/* ▸ Toolbar ----------------------------------------- */}
<div className="row align-items-center g-2 my-2">
  <div className="col-lg-2 col-md-3 col-sm-6">
    <input
      className="form-control"
      placeholder="Search name..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
    />
  </div>
  <div className="col-lg-2 col-md-3 col-sm-6">
    <input
      className="form-control"
      placeholder="Search receipt..."
      value={receiptSearch}
      onChange={(e) => {
        setRS(e.target.value);
        setPage(1);
      }}
    />
  </div>
  <div className="col-lg-2 col-md-3 col-sm-6">
    <select
      className="form-select"
      value={department}
      onChange={(e) => {
        setDept(e.target.value);
        setPage(1);
      }}
    >
      <option value="">All Departments</option>
      {depts.map((d, i) => (
        <option key={i} value={d}>{d}</option>
      ))}
    </select>
  </div>
  <div className="col-lg-2 col-md-3 col-sm-6">
    <select
      className="form-select"
      value={batch}
      onChange={(e) => {
        setBatch(e.target.value);
        setPage(1);
      }}
    >
      <option value="">All Batches</option>
      {batches.map((b, i) => (
        <option key={i} value={b}>{b}</option>
      ))}
    </select>
  </div>
  <div className="col-lg-4 col-md-12 d-flex justify-content-end gap-2">
    <button
      className="btn btn-outline-success"
      onClick={exportExcel}
      title="Export Excel"
    >
      <i className="bi bi-file-earmark-excel"></i>
    </button>
    <button
      className="btn btn-outline-danger"
      onClick={exportPDF}
      title="Export PDF"
    >
      <i className="bi bi-file-earmark-pdf"></i>
    </button>
    <button
      className="btn btn-outline-secondary"
      onClick={() => setShowAll((s) => !s)}
      title="Toggle View"
    >
      <i className={`bi ${showAll ? "bi-list" : "bi-list-columns"}`}></i>
    </button>
  </div>
</div>


      {/* ▸ Table ------------------------------------------- */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark text-center">
            <tr>
              <th>Sr No</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Session (Course)</th>
              <th>Receipt No</th>
              <th>Pay Date</th>
              <th>Action</th>
              <th colSpan="4">Decided Amount</th>
              <th colSpan="4">Paid Amount</th>
              <th colSpan="4">Pending Amount</th>
              <th>Status</th>
            </tr>
            <tr>
              <th colSpan="7"></th>
              <th>Academic</th><th>Exam</th><th>Hostel</th><th>Transport</th>
              <th>Academic</th><th>Exam</th><th>Hostel</th><th>Transport</th>
              <th>Academic</th><th>Exam</th><th>Hostel</th><th>Transport</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan="21" className="text-center">No data found</td>
              </tr>
            ) : (
              slice.map((r, i) => (
                <React.Fragment key={r.student_id}>
                  <tr className="align-middle text-center">
                    <td>{showAll ? i + 1 : (page - 1) * LIMIT + i + 1}</td>
                    <td>{r.student_id}</td>
                    <td className="text-start">{r.name}</td>
                    <td>{r.batch}</td>
                    <td>{r.receipt}</td>
                    <td>{r.payDate}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => toggleRow(r.student_id)}
                      >
                        {expanded.has(r.student_id) ? "Hide" : "Show"}
                      </button>
                    </td>
                    <td>{fmt(r.decided.academic)}</td>
                    <td>{fmt(r.decided.exam)}</td>
                    <td>{fmt(r.decided.hostel)}</td>
                    <td>{fmt(r.decided.transport)}</td>
                    <td>{fmt(r.paid.academic)}</td>
                    <td>{fmt(r.paid.exam)}</td>
                    <td>{fmt(r.paid.hostel)}</td>
                    <td>{fmt(r.paid.transport)}</td>
                    <td>{fmt(r.pending.academic)}</td>
                    <td>{fmt(r.pending.exam)}</td>
                    <td>{fmt(r.pending.hostel)}</td>
                    <td>{fmt(r.pending.transport)}</td>
                    <td
                      className={
                        r.status === "Settled"
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {r.status}
                    </td>
                  </tr>

                  {/* Transaction rows */}
                  {expanded.has(r.student_id) && (
                    <tr>
                      <td colSpan="21" className="p-0">
                        <table className="table mb-0 table-sm text-center">
                          <thead className="table-secondary">
  <tr>
    <th>Receipt No</th>
    <th>Category</th>
    <th>Amount</th>
    <th>Pay Date</th>
    <th>Remark</th>
  </tr>
</thead>

                          <tbody>
                            {r.transactions.length === 0 ? (
                              <tr>
                                <td colSpan="5">No Transactions</td>
                              </tr>
                            ) : (
                              r.transactions.map((t, idx) => (
                                <tr key={idx}>
  <td>{t.receipt}</td>
  <td className="text-capitalize">{t.category}</td>
  <td>{fmt(t.amount)}</td>
  <td>{formatDate(t.date)}</td>
  <td className="text-start">{t.remark}</td>
  <td>{t.payment_mode}</td>
  <td>{t.transaction_id}</td>
</tr>

                              ))
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ▸ Pagination ------------------------------------- */}
      {!showAll && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>Page {page} of {pages}</span>
          <div className="btn-group">
            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >Prev</button>
            <button
              className="btn btn-secondary"
              disabled={page === pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesList;
