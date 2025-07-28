import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

/* API base */
const API = import.meta.env.VITE_API_URL;

/* Year ➔ semester map */
const YEAR_SEMESTER = {
  First:  ["I", "II"],
  Second: ["III", "IV"],
  Third:  ["V", "VI"],
};

const DpFeesForm = () => {
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStu, setSelectedStu] = useState(null);

  const blankForm = {
    student: "",
    name: "",
    session: "",
    course: "",
    year: "",
    semester: "",
    decide_fees: 0,
    dpfees: 0,
    remark: "",
    pending: 0,
    payment_mode: "",
    transaction_id: "",
  };
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          tuitionRes,
          examRes,
          hostelRes,
          transportRes,
          studentRes,
        ] = await Promise.all([
          axios.get(`${API}/api/decideFees/`),
          axios.get(`${API}/api/dEfee/`),
          axios.get(`${API}/api/dHfee/`),
          axios.get(`${API}/api/dTfee/`),
          axios.get(`${API}/api/student/`),
        ]);

        const feeMap = new Map();
        const addFee = (arr, key, prop) => {
          arr.forEach((f) => {
            if (!feeMap.has(f.student)) {
              feeMap.set(f.student, { tuition: 0, exam: 0, hostel: 0, transport: 0 });
            }
            feeMap.get(f.student)[prop] = parseFloat(f[key] || 0);
          });
        };
        addFee(tuitionRes.data,   "decidedamt",          "tuition");
        addFee(examRes.data,      "decidedexamfee",      "exam");
        addFee(hostelRes.data,    "decidedhostelfee",    "hostel");
        addFee(transportRes.data, "decidedtransportfee", "transport");

        const options = studentRes.data.map((stu) => {
          const fees = feeMap.get(stu.student_id) || {
            tuition: 0, exam: 0, hostel: 0, transport: 0,
          };
          const total = fees.tuition + fees.exam + fees.hostel + fees.transport;

          return {
            value: stu.student_id,
            label: `${stu.student_id} - ${stu.name}`,
            name: stu.name,
            session: stu.session,
            course: stu.course,
            year: stu.year,
            semester: stu.semester,
            fees: { ...fees, total },
          };
        });

        setStudentOptions(options);
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  const handleStudentChange = async (option) => {
    if (!option) {
      setSelectedStu(null);
      setForm(blankForm);
      return;
    }

    const yearStr =
      option.year === 1 || option.year === "1" ? "First" :
      option.year === 2 || option.year === "2" ? "Second" : "Third";

    setSelectedStu(option);

    try {
      const res = await axios.get(`${API}/api/dpfees/`);
      const deposits = res.data.filter(dep => dep.student === option.value);
      const paidSoFar = deposits.reduce((sum, item) => sum + parseFloat(item.dpfees), 0);

      const decideTotal = option.fees.total;
      const pending = Math.max(0, decideTotal - paidSoFar);

      setForm({
        ...blankForm,
        student: option.value,
        name: option.name,
        session: option.session,
        course: option.course,
        year: yearStr,
        semester: YEAR_SEMESTER[yearStr]?.[0] || "",
        decide_fees: decideTotal,
        dpfees: 0,
        pending: pending,
      });
    } catch (err) {
      toast.error("Failed to fetch previous payments");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };

    if (name === "dpfees") {
      const paid = Math.min(parseFloat(value || 0), parseFloat(form.decide_fees));
      updated.dpfees  = paid;
      updated.pending = parseFloat(form.decide_fees) - paid;
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
    if (!selectedStu) {
      toast.error("Please select a student first");
      return;
    }

    const payload = {
      student:       form.student,
      name:          form.name,
      session:       form.session,
      course:        form.course,
      year:          form.year,
      semester:      form.semester,
      payment_mode:  form.payment_mode,
      transaction_id: form.payment_mode === "cash" ? null : form.transaction_id,
      decide_fees:   parseFloat(form.decide_fees),
      dpfees:        parseFloat(form.dpfees),
      pending:       parseFloat(form.pending),
      remark:        form.remark,
    };

    try {
      const res = await axios.post(`${API}/api/dpfees/`, payload);
      toast.success(`Saved! Receipt No: ${res.data.receipt}`);

      setSelectedStu(null);
      setForm(blankForm);
    } catch (err) {
      toast.error("Submission failed");
      console.error(err.response?.data || err);
    }
  };

  const isLocked = !selectedStu;
  const fix2 = (n) => Number(n || 0).toFixed(2);

  return (
    <div className="fluid mt-3">
      <div className="row justify-content-center">
        <div className="col-md-11">
          <h2 className="text-center bg-success text-white p-1 rounded">
            Deposit Fees
          </h2>

          <form
            onSubmit={handleSubmit}
            className="bg-secondary text-white p-4 rounded mt-3"
          >
            <div className="row mb-1">
              <div className="col-md-6">
                <label>Student</label>
                <Select
                  options={studentOptions}
                  onChange={handleStudentChange}
                  value={selectedStu}
                  placeholder="Search & Select student"
                  className="text-dark"
                />
              </div>

              <div className="col-md-6">
                <label>Receipt No</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedStu ? "Will be generated on submit" : ""}
                  readOnly
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-1">
                <label>Name</label>
                <input type="text" className="form-control" value={form.name} readOnly />
              </div>
              <div className="col-md-4 mb-1">
                <label>Course</label>
                <input type="text" className="form-control" value={form.course} readOnly />
              </div>
              <div className="col-md-4 mb-1">
                <label>Session</label>
                <input type="text" className="form-control" value={form.session} readOnly />
              </div>

              <div className="col-md-4 mb-1">
                <label>Year</label>
                <select
                  name="year"
                  className="form-control"
                  value={form.year}
                  onChange={handleChange}
                  disabled={isLocked}
                  required
                >
                  <option value="">-- Select Year --</option>
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Third">Third</option>
                </select>
              </div>

              <div className="col-md-4 mb-1">
                <label>Semester</label>
                <select
                  name="semester"
                  className="form-control"
                  value={form.semester}
                  onChange={handleChange}
                  disabled={isLocked || !form.year}
                  required
                >
                  <option value="">-- Select Semester --</option>
                  {(YEAR_SEMESTER[form.year] || []).map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered bg-white text-dark">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Total Decided Fee</th>
                    <th>Pay Now</th>
                    <th>Remark</th>
                    <th>Pending</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr>
                    <td>{fix2(form.decide_fees)}</td>
                    <td>
                      <input
                        type="number"
                        name="dpfees"
                        min="0"
                        max={form.decide_fees}
                        value={form.dpfees}
                        onChange={handleChange}
                        className="form-control"
                        disabled={isLocked}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="remark"
                        value={form.remark}
                        onChange={handleChange}
                        className="form-control"
                        disabled={isLocked}
                      />
                    </td>
                    <td>{fix2(form.pending)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row">
              <div className="col-md-6 mb-1">
                <label>Payment Mode</label>
                <select
                  name="payment_mode"
                  value={form.payment_mode}
                  onChange={handleChange}
                  className="form-control"
                  disabled={isLocked}
                  required
                >
                  <option value="">-- Select Mode --</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              {["online", "cheque"].includes(form.payment_mode) && (
                <div className="col-md-6 mb-1">
                  <label>Transaction ID</label>
                  <input
                    type="text"
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

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary w-50"
                disabled={isLocked}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DpFeesForm;
