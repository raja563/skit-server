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
        <p className="page-heading">contact us</p>
        <p className="heading-para">get in touch</p>
      </div>

      <div className="heading-box">
        <h1>Contact</h1>
        <div className="heading-underline"></div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam pariatur, soluta vel magnam magni consectetur.</p>
      </div>

      <section className="contact-container shadow-3d">
        <div className="contact-address-container">
          <div className="address-box">
            <div className="location-logo"></div>
            <div className="address-text">
              <h3>Address</h3>
              <p>CAMPUS</p>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis vitae laudantium at optio quia libero?</p>
            </div>
          </div>
        </div>
        <form className="contact-form-container" onSubmit={submitForm}>
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
            <button type='submit'>Send Message</button>
          </div>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
