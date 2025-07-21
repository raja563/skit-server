import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GetAllFaculty = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/faculty/register");
        setFaculty(response.data);
      } catch (error) {
        toast.error("Failed to fetch faculty data.");
      }
    };

    fetchData();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/faculty/register/${id}`);
      setFaculty(prev => prev.filter(faculty => faculty.id !== id));
      toast.success("Faculty deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete faculty.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <h4 className="text-center bg-secondary text-danger py-2 rounded">Faculty List</h4>

          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center">
              <thead className="thead-dark">
                <tr>
                  <th>SR.NO.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>MOBILE NO.</th>
                  <th>ADDRESS</th>
                  <th>DEPARTMENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((value, index) => (
                  <tr key={value.id}>
                    <td>{index + 1}</td>
                    <td>{value.fullname}</td>
                    <td>{value.email}</td>
                    <td>{value.mobile}</td>
                    <td>{value.address}</td>
                    <td>{value.department}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Actions
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => deleteUser(value.id)}
                            >
                              Delete
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item">Edit</button>
                          </li>
                          <li>
                            <button className="dropdown-item">Details</button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {faculty.length === 0 && (
              <div className="text-center text-warning">No faculty records found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllFaculty;
