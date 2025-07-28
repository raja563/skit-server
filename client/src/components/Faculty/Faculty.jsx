import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './faculty.css';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/faculty/register/`);
        setFaculty(response.data);
      } catch (error) {
        console.error('Failed to fetch faculty:', error);
      }
    };
    fetchFaculty();
  }, [API_URL]);

  const handleFacultyClick = (facultyItem) => {
    setSelectedFaculty(facultyItem);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <main>
        <section>
          <div className="page-heading-box text-center">
            <p className="page-heading text-danger">Faculty</p>
            <p className="heading-para">
              Meet our experienced and dedicated faculty members who make learning exciting and effective.
            </p>
          </div>

          <div className="heading-box text-center">
            <h1 className='text-primary'>Our Faculty</h1>
            <div className="line"></div>
          </div>
        </section>

        <section>
          <div className="container py-4">
            <div className="row justify-content-center">
              {faculty.map((fac, index) => (
                <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                  <div
                    className="card faculty-box shadow-lg h-100 rounded-4 border-0"
                    onClick={() => handleFacultyClick(fac)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-img-top pro-img text-center">
                      <img
                        src={`${API_URL}${fac.profile}`}
                        alt={fac.fullname}
                        className="img-fluid"
                      />
                    </div>
                    <div className="card-body text-center pro-detail">
                      <p className="name">{fac.fullname}</p>
                      <p className="degree">{fac.qualification}</p>
                      <p className="post">{fac.department}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Faculty Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFaculty && (
            <div className="text-center">
              <img
                src={`${API_URL}${selectedFaculty.profile}`}
                alt="Profile"
                className="rounded mb-3 border border-primary"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h5 className='text-primary fw-bold'>{selectedFaculty.fullname}</h5>
              <p><strong>Department:</strong> {selectedFaculty.department}</p>
              <p><strong>Email:</strong> {selectedFaculty.email}</p>
              <p><strong>Mobile:</strong> {selectedFaculty.mobile}</p>
              <p><strong>Qualification:</strong> {selectedFaculty.qualification}</p>
              <p><strong>Address:</strong> {selectedFaculty.address}</p>
              <p><strong>Joining Date:</strong> {selectedFaculty.dojoin}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Faculty;
