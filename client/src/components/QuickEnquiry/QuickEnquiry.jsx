import React, { useState } from 'react';
import './quickEnquiry.css';

const QuickEnquiry = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(prev => !prev);

  return (
    <>
      {/* Floating tab that opens the enquiry panel */}
      <div className="en" onClick={toggleModal}>ENQUIRY</div>

      <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={toggleModal}>
        <div
          className={`modal-container ${isOpen ? 'show' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Quick Enquiry</h2>
            <button className="close-btn" onClick={toggleModal}>&times;</button>
          </div>

          <form>
            <input type="text" className="form-control" placeholder="Name" name="name" />
            <input type="text" className="form-control" placeholder="Mobile" name="mobile" />
            <input type="email" className="form-control" placeholder="Email" name="email" />
            <select name="course" className="form-control">
              <option value="">Please select your course</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
            </select>

            <div className="text-center">
              <button type="submit" className="submit-btn">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuickEnquiry;
