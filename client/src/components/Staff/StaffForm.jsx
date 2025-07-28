import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const api = `${import.meta.env.VITE_API_URL}/api/staff/`;

const initialData = {
  name: "",
  father: "",
  address: "",
  gender: "",
  dateofbirth: "",
  adhar: "",
  mobile: "",
  email: "",
  department: "",
  date_of_join: "",
  skills: [],
  maxQualification: "",
  salary: "",
  profile: null,
  resume: null,
};

const skillsList = ["Teaching", "Research", "Coding", "Management"];

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(initialData);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      axios.get(`${api}${id}/`).then((res) => {
        const { staff_id, ...rest } = res.data;
        setStaff({ ...initialData, ...rest, skills: res.data.skills || [] });
        if (res.data.profile) {
          setProfilePreview(`${import.meta.env.VITE_API_URL}${res.data.profile}`);
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setStaff({ ...staff, [name]: file });
      if (name === "profile") {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else if (type === "checkbox") {
      const newSkills = staff.skills.includes(value)
        ? staff.skills.filter((skill) => skill !== value)
        : [...staff.skills, value];
      setStaff({ ...staff, skills: newSkills });
    } else {
      setStaff({ ...staff, [name]: value });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "name", "father", "address", "gender", "dateofbirth", "adhar",
      "mobile", "email", "department", "date_of_join", "maxQualification", "salary"
    ];

    for (let field of requiredFields) {
      if (!staff[field]) {
        toast.error(`${field[0].toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(staff.email)) {
      toast.error("Invalid email format");
      return false;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(staff.mobile)) {
      toast.error("Mobile must be 10 digits");
      return false;
    }

    const adharRegex = /^\d{12}$/;
    if (!adharRegex.test(staff.adhar)) {
      toast.error("Aadhar must be 12 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();

    if (isEditMode) {
      const existingData = await axios.get(`${api}${id}/`);
      const original = existingData.data;

      for (const key in staff) {
        if (key === "staff_id") continue;

        const originalValue = original[key];
        const newValue = staff[key];

        if (key === "skills") {
          const origSkills = Array.isArray(originalValue) ? originalValue.sort().join(",") : "";
          const newSkills = newValue.sort().join(",");
          if (origSkills !== newSkills) {
            payload.append("skills", JSON.stringify(newValue));
          }
        } else if (key === "profile" || key === "resume") {
          if (newValue && typeof newValue !== "string") {
            payload.append(key, newValue);
          }
        } else if (newValue !== originalValue) {
          payload.append(key, newValue);
        }
      }

      if ([...payload.entries()].length === 0) {
        toast("No changes made", { icon: "ℹ️" });
        return;
      }
    } else {
      for (const key in staff) {
        if (key === "staff_id") continue;
        if (key === "skills") {
          payload.append(key, JSON.stringify(staff[key]));
        } else {
          payload.append(key, staff[key]);
        }
      }
    }

    try {
      const method = isEditMode ? "patch" : "post";
      const url = isEditMode ? `${api}${id}/` : api;
      const res = await axios[method](url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(isEditMode ? "Staff Updated!" : `Staff Registered! ID: ${res.data.staff_id}`);
      setStaff(initialData);
      setProfilePreview(null);
      navigate("/stpl");
    } catch (err) {
      console.error(err.response?.data || err);
      const messages = err.response?.data;
      if (typeof messages === "object") {
        Object.entries(messages).forEach(([field, msg]) => toast.error(`${field}: ${msg}`));
      } else {
        toast.error("Error submitting form");
      }
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#0f2027", color: "#fff", minHeight: "100vh" }}>
      <div className="mx-auto p-4 rounded shadow-lg" style={{ background: "#1e1e2f", maxWidth: "1000px" }}>
        <h3 className="text-center bg-success p-2 rounded-pill text-white shadow mb-4">
          {isEditMode ? "Edit Staff Details" : "Staff Registration Form"}
        </h3>
        <form onSubmit={handleSubmit} className="text-light">
          <div className="row g-3">
            {["name", "father", "address", "adhar", "mobile", "email"].map((field) => (
              <div className="col-md-4" key={field}>
                <div className="form-floating">
                  <input
                    type="text"
                    name={field}
                    value={staff[field]}
                    onChange={handleChange}
                    className="form-control bg-dark text-white border-info shadow-sm"
                    placeholder={field}
                  />
                  <label className="text-white">{field[0].toUpperCase() + field.slice(1)}</label>
                </div>
              </div>
            ))}

            {["maxQualification", "department", "salary"].map((field) => (
              <div className="col-md-4" key={field}>
                <div className="form-floating">
                  <input
                    type={field === "salary" ? "number" : "text"}
                    name={field}
                    value={staff[field]}
                    onChange={handleChange}
                    className="form-control bg-dark text-white border-info shadow-sm"
                    placeholder={field}
                  />
                  <label className="text-white">{field}</label>
                </div>
              </div>
            ))}

            <div className="col-md-4">
              <label className="form-label text-white">Date of Birth</label>
              <input type="date" name="dateofbirth" value={staff.dateofbirth} onChange={handleChange} className="form-control bg-dark text-white border-info shadow-sm" />
            </div>
            <div className="col-md-4">
              <label className="form-label text-white">Date of Joining</label>
              <input type="date" name="date_of_join" value={staff.date_of_join} onChange={handleChange} className="form-control bg-dark text-white border-info shadow-sm" />
            </div>
            <div className="col-md-4">
              <label className="form-label text-white">Upload Resume</label>
              <input type="file" name="resume" className="form-control bg-dark text-white border-info shadow-sm" onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label text-white">Gender</label>
              {["Male", "Female", "Other"].map((g) => (
                <div className="form-check form-check-inline" key={g}>
                  <input className="form-check-input" type="radio" name="gender" value={g} checked={staff.gender === g} onChange={handleChange} />
                  <label className="form-check-label text-white">{g}</label>
                </div>
              ))}
            </div>

            <div className="col-md-4">
              <label className="form-label text-white">Skills</label>
              {skillsList.map((skill) => (
                <div className="form-check form-check-inline" key={skill}>
                  <input className="form-check-input" type="checkbox" name="skills" value={skill} checked={staff.skills.includes(skill)} onChange={handleChange} />
                  <label className="form-check-label text-white">{skill}</label>
                </div>
              ))}
            </div>

            <div className="col-md-4">
              <label className="form-label text-white">Upload Profile</label>
              <input type="file" name="profile" accept="image/*" onChange={handleChange} className="form-control bg-dark text-white border-info shadow-sm" />
              {profilePreview && (
                <img src={profilePreview} alt="Preview" className="img-thumbnail mt-2" style={{ width: "100px", height: "100px", borderRadius: "8px" }} />
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-success me-3">{isEditMode ? "Update" : "Submit"}</button>
            <button type="reset" className="btn btn-warning" onClick={() => { setStaff(initialData); setProfilePreview(null); }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
