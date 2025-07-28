import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

const API = import.meta.env.VITE_API_URL;

const YEAR_SEMESTER = {
  First: ["I", "II"],
  Second: ["III", "IV"],
  Third: ["V", "VI"],
};

// 🧩 Receipt Generator
const buildReceipt = (fullName, serial) => {
  const prefix = "REC";
  const namePart = (fullName || "")
    .replace(/\s+/g, "")
    .toUpperCase()
    .padEnd(3, "X")
    .slice(0, 3);
  const yearPart = new Date().getFullYear().toString().slice(-2);
  const serialPart = serial.toString().padStart(6, "0");
  const checksum = (serial % 10).toString();
  return `${prefix}${namePart}${yearPart}${serialPart}${checksum}`;
};

// 🧾 Blank Form Template
const blankForm = {
  student: "",
  name: "",
  session: "",
  course: "",
  year: "",
  semester: "",
  decide_fees: "",
  dpexamfees: "",
  pending: "",
  remark: "",
  payment_mode: "",
  transaction_id: "",
};

const DpExamFee = () => {
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStu, setSelectedStu] = useState(null);
  const [receiptNo, setReceiptNo] = useState("");
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    (async () => {
      try {
        const [examRes, studentRes] = await Promise.all([
          axios.get(`${API}/api/dEfee/`),
          axios.get(`${API}/api/student/`),
        ]);

        const feeMap = new Map();
        examRes.data.forEach((f) =>
          feeMap.set(f.student, parseFloat(f.decidedexamfee || 0))
        );

        const options = studentRes.data.map((stu) => ({
          value: stu.student_id,
          label: `${stu.student_id} - ${stu.name}`,
          name: stu.name,
          session: stu.session,
          course: stu.course,
          year: stu.year,
          semester: stu.semester,
          examFee: feeMap.get(stu.student_id) || 0,
        }));

        setStudentOptions(options);
      } catch {
        toast.error("Error loading data");
      }
    })();
  }, []);

  const handleStudentChange = async (option) => {
    if (!option) {
      setSelectedStu(null);
      setForm(blankForm);
      setReceiptNo("");
      return;
    }

    setSelectedStu(option);

    try {
      const res = await axios.get(`${API}/api/dpefee/`);
      const allDeposits = res.data;
      const studentDeposits = allDeposits.filter((d) => d.student === option.value);

      const serial = allDeposits.length + 1;
      const receipt = buildReceipt(option.name, serial);
      setReceiptNo(receipt);

      const paidSoFar = studentDeposits.reduce(
        (sum, d) => sum + parseFloat(d.dpexamfees),
        0
      );
      const decideTotal = option.examFee;
      const pending = Math.max(0, decideTotal - paidSoFar);

      const yearStr =
        option.year === 1 || option.year === "1"
          ? "First"
          : option.year === 2 || option.year === "2"
          ? "Second"
          : "Third";

      setForm({
        student: option.value,
        name: option.name,
        session: option.session,
        course: option.course,
        year: yearStr,
        semester: YEAR_SEMESTER[yearStr]?.[0] || "",
        decide_fees: decideTotal,
        dpexamfees: "",
        pending,
        remark: "",
        payment_mode: "",
        transaction_id: "",
      });
    } catch {
      toast.error("Error fetching payment history");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };

    if (name === "dpexamfees") {
      const paid = Math.min(parseFloat(value || 0), parseFloat(form.pending || 0));
      updated.dpexamfees = value;
      updated.pending = parseFloat(form.pending || 0) - paid;
    }

    if (name === "year") {
      updated.semester = YEAR_SEMESTER[value]?.[0] || "";
    }

    if (name === "payment_mode") {
      updated.transaction_id = "";
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStu) return toast.error("Select a student first");

    const payload = {
      ...form,
      decide_fees: parseFloat(form.decide_fees || 0),
      dpexamfees: parseFloat(form.dpexamfees || 0),
      pending: parseFloat(form.pending || 0),
      transaction_id: form.payment_mode === "cash" ? null : form.transaction_id,
      receipt: receiptNo,
    };

    try {
      await axios.post(`${API}/api/dpefee/`, payload);
      toast.success(`Saved! Receipt ${receiptNo}`);
      setSelectedStu(null);
      setForm(blankForm);
      setReceiptNo("");
    } catch (err) {
      toast.error("Submission failed");
      console.error(err.response?.data || err);
    }
  };

  const isLocked = !selectedStu;
  const fix2 = (v) => (v === "" ? "" : Number(v).toFixed(2));

  return (
    <div className="fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-md-11">
          <h2 className="text-center bg-success text-white p-2 rounded">
            Deposit Exam Fees
          </h2>

          <form onSubmit={handleSubmit} className="bg-secondary text-white p-4 rounded">
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Student</label>
                <Select
                  options={studentOptions}
                  value={selectedStu}
                  onChange={handleStudentChange}
                  placeholder="Search & Select Student"
                  className="text-dark"
                />
              </div>
              <div className="col-md-6">
                <label>Receipt No</label>
                <input className="form-control" value={receiptNo} readOnly />
              </div>
            </div>

            <div className="row">
              {["name", "course", "session"].map((fld, i) => (
                <div key={i} className="col-md-4 mb-2">
                  <label>{fld[0].toUpperCase() + fld.slice(1)}</label>
                  <input className="form-control" value={form[fld]} readOnly />
                </div>
              ))}
              <div className="col-md-4 mb-2">
                <label>Year</label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="form-control"
                  disabled={isLocked}
                >
                  <option value="">-- Select Year --</option>
                  <option>First</option>
                  <option>Second</option>
                  <option>Third</option>
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <label>Semester</label>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="form-control"
                  disabled={isLocked}
                >
                  <option value="">-- Select Semester --</option>
                  {(YEAR_SEMESTER[form.year] || []).map((sem) => (
                    <option key={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-responsive mt-3">
              <table className="table table-bordered bg-white text-dark text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Exam Fee</th>
                    <th>Pay Now</th>
                    <th>Remark</th>
                    <th>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{fix2(form.decide_fees)}</td>
                    <td>
                      <input
                        name="dpexamfees"
                        value={form.dpexamfees}
                        type="number"
                        className="form-control"
                        onChange={handleChange}
                        disabled={isLocked}
                      />
                    </td>
                    <td>
                      <input
                        name="remark"
                        value={form.remark}
                        type="text"
                        className="form-control"
                        onChange={handleChange}
                        disabled={isLocked}
                      />
                    </td>
                    <td>{fix2(form.pending)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label>Payment Mode</label>
                <select
                  name="payment_mode"
                  value={form.payment_mode}
                  onChange={handleChange}
                  className="form-control"
                  disabled={isLocked}
                >
                  <option value="">-- Select Mode --</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              {["online", "cheque"].includes(form.payment_mode) && (
                <div className="col-md-6 mb-2">
                  <label>Transaction ID</label>
                  <input
                    name="transaction_id"
                    value={form.transaction_id}
                    onChange={handleChange}
                    className="form-control"
                    disabled={isLocked}
                    required
                  />
                </div>
              )}
            </div>

            <div className="text-center mt-3">
              <button className="btn btn-primary px-4" disabled={isLocked}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DpExamFee;
