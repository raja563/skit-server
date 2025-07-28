import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const api = `${import.meta.env.VITE_API_URL}/api/faculty/`;

const initialData = {
  fullname: "",
  fname: "",
  gender: "",
  dobirth: "",
  address: "",
  mobile: "",
  email: "",
  qualification: "",
  department: "",
  dojoin: "",
  password: "",
  profile: null,
  resume: null,
};

const FacultyRegister = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(initialData);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      axios
        .get(`${api}${id}/`)
        .then((res) => {
          const data = res.data;
          setFaculty({
            fullname: data.fullname || "",
            fname: data.fname || "",
            gender: data.gender || "",
            dobirth: data.dobirth?.split("T")[0] || "",
            address: data.address || "",
            mobile: data.mobile || "",
            email: data.email || "",
            qualification: data.qualification || "",
            department: data.department || "",
            dojoin: data.dojoin?.split("T")[0] || "",
            password: "", // Don't prefill password
            profile: null,
            resume: null,
          });

          if (data.profile) {
            setProfilePreview(`${import.meta.env.VITE_API_URL}${data.profile}`);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch faculty data");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFaculty((prev) => ({ ...prev, [name]: file }));

      if (name === "profile") {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFaculty((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "fullname", "fname", "gender", "dobirth", "address",
      "mobile", "email", "qualification", "department", "dojoin"
    ];

    for (let field of requiredFields) {
      if (!faculty[field]) {
        toast.error(`${field} is required`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(faculty.mobile)) {
      toast.error("Mobile must be 10 digits");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(faculty.email)) {
      toast.error("Invalid email format");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in faculty) {
      if (faculty[key]) {
        formData.append(key, faculty[key]);
      }
    }

    try {
      if (isEditMode) {
        await axios.patch(`${api}${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Faculty updated successfully!");
      } else {
        await axios.post(`${api}register/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Faculty registered successfully!");
      }

      setFaculty(initialData);
      setProfilePreview(null);
      navigate("/facdash/getAll");
    } catch (err) {
      console.error(err.response?.data || err);
      const errors = err.response?.data;
      if (typeof errors === "object") {
        Object.entries(errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
      } else {
        toast.error("Form submission failed");
      }
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#001F3F", color: "#fff", minHeight: "100vh" }}>
      <div className="mx-auto p-4 rounded shadow-lg" style={{ background: "#112240", maxWidth: "1000px" }}>
        <h3 className="text-center bg-primary p-2 rounded-pill text-white shadow mb-4">
          {isEditMode ? "Edit Faculty" : "Faculty Registration"}
        </h3>
        <form onSubmit={handleSubmit} className="text-light">
          <div className="row g-3">
            {["fullname", "fname", "address", "mobile", "email", "qualification", "department", "password"].map((field) => (
              <div className="col-md-4" key={field}>
                <div className="form-floating">
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={faculty[field]}
                    onChange={handleChange}
                    className="form-control bg-dark text-white border-info shadow-sm"
                    placeholder={field}
                  />
                  <label className="text-white">
                    {field[0].toUpperCase() + field.slice(1)}
                  </label>
                </div>
              </div>
            ))}

            <div className="col-md-4">
              <label className="form-label text-white">Gender</label>
              {["Male", "Female", "Other"].map((g) => (
                <div className="form-check form-check-inline" key={g}>
                  <input className="form-check-input" type="radio" name="gender" value={g} checked={faculty.gender === g} onChange={handleChange} />
                  <label className="form-check-label text-white">{g}</label>
                </div>
              ))}
            </div>

            <div className="col-md-4">
              <label className="form-label text-white">Date of Birth</label>
              <input type="date" name="dobirth" value={faculty.dobirth} onChange={handleChange} className="form-control bg-dark text-white border-info shadow-sm" />
            </div>

            <div className="col-md-4">
              <label className="form-label text-white">Date of Joining</label>
              <input type="date" name="dojoin" value={faculty.dojoin} onChange={handleChange} className="form-control bg-dark text-white border-info shadow-sm" />
            </div>

            <div className="col-md-4">
              <label className="form-label text-white">Upload Profile</label>
              <input type="file" name="profile" accept="image/*" className="form-control bg-dark text-white border-info shadow-sm" onChange={handleChange} />
              {profilePreview && (
                <img src={profilePreview} alt="Preview" className="img-thumbnail mt-2" style={{ width: "100px", height: "100px", borderRadius: "8px" }} />
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label text-white">Upload Resume</label>
              <input type="file" name="resume" className="form-control bg-dark text-white border-info shadow-sm" onChange={handleChange} />
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-success me-3">
              {isEditMode ? "Update" : "Submit"}
            </button>
            <button
              type="reset"
              className="btn btn-warning"
              onClick={() => {
                setFaculty(initialData);
                setProfilePreview(null);
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyRegister;
