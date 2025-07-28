import React, { useState } from 'react';
import './contact.css';
import Footer from '../Footer/Footer';
import Navbar from '../Header/Header';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const enquirys = {
    name: '',
    phone: '',
    email: '',
    address: '',
    subject: '',
    message: ''
  };

  const [enquiry, setEnquiry] = useState(enquirys);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setEnquiry({ ...enquiry, [name]: value });
  };

  const postURL = `${import.meta.env.VITE_API_URL}/api/enquiry/`;
  const submitForm = async (e) => {
    e.preventDefault();
    await axios.post(postURL, enquiry).then((response) => {
      toast.success(response.data.msg, { position: 'top-right' });
      navigate('/');
    }).catch(error => console.log(error));
  };

  return (
    <div>
      <Navbar />
      <div className="page-heading-box shadow-3d">
        <p className="page-heading text-danger">contact us</p>
        <p className="heading-para">get in touch</p>
      </div>

      <div className="heading-box">
        <h1>Contact</h1>
        <div className="heading-underline"></div>
        <p className='text-warning fw-bold '>Just send us your questions or concerns by starting a new massege and we will give you the help you need.</p>
      </div>

      <section className="contact-container shadow-3d">
        <div className="contact-address-container">
         <div className="address-box">
  <h3><i className="fas fa-map-marker-alt"></i> Address</h3>
  <div className="address-section">
    <h4><i className="fas fa-university"></i> CAMPUS</h4>
    <p>Near Bahabalpur, Hawaspur, Kanpur Dehat 209310<br />
    <strong>Uttar Pradesh</strong><br />
    <i className="fas fa-phone-alt"></i> Phone: <a href="tel:7800048001">7800048001</a></p>
  </div>

  <div className="address-section">
    <h4><i className="fas fa-building"></i> CITY OFFICE</h4>
    <p>Ground Floor, Krishna Dham Flat,<br /> Naveen Nagar, Kakadeo, Kanpur 208025<br />
    <i className="fas fa-phone-alt"></i> Phone: <a href="tel:8400341541">8400341541</a></p>
  </div>

  <p><i className="fas fa-phone"></i> Call Us: <a href="tel:+917800048009">+91 7800048009</a></p>
  <p><i className="fas fa-envelope"></i> Email Us: <a href="mailto:skitkd64@gmail.com">skitkd64@gmail.com</a></p>
  <p><i className="fas fa-clock"></i> Open Hours: <strong>Mon-Sat:</strong> 11AM - 11PM</p>
</div>

        </div>
        <form className="contact-form-container" onSubmit={submitForm}>
          <div className="inputgroup">
            <h3 className='text-center text-primary '>Want us to call you?</h3>
          </div>
          <div className="inputgroup">
            <input type="text" className='form-control' placeholder='Name *' name='name' onChange={inputHandler} />
            <input type="text" className='form-control' placeholder='Phone *' name='phone' onChange={inputHandler} />
          </div>
          <div className="inputgroup">
            <input type="email" placeholder='Email *' className='form-control' name='email' onChange={inputHandler} />
            <input type="text" placeholder='Address *' className='form-control' name='address' onChange={inputHandler} />
          </div>
          <div className="subject inputgroup">
            <input type="text" placeholder='Subject' name='subject' className='form-control' onChange={inputHandler} />
          </div>
          <div className="message inputgroup">
            <textarea placeholder='Message' rows={5} name='message' className='form-control' onChange={inputHandler}></textarea>
          </div>
          <div className="button">
            <button  type='submit'>Send Message</button>
          </div>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
