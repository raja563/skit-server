import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Course.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Course = () => {
  return (
    <div className="course-page">
      <Header />
      <main className="container py-4">
        {/* Course Heading */}
        <section className='course-heading card text-center p-4 shadow-sm rounded-3 bg-light mb-5'>
          <h1 className="display-4 fw-bold text-danger">BBA & BCA</h1>
          <p className="lead heading-para">BBA stands for Bachelor of Business Administration, and BCA stands for Bachelor of Computer Applications. Both are professional undergraduate degrees that can lead to successful careers in a variety of industries.</p>
        </section>

        {/* Course Info Section */}
        <section className="row gx-4 gy-5 mb-5">
          {/* BCA Info */}
          <div className="col-lg-6 shadow-lg p-4 bg-white rounded-4">
            <h2 className="text-primary">Course Information</h2>
            <img src="/img/bca_1.png" alt="BCA" className="img-fluid rounded shadow-sm mb-3" />
            <table className="table table-bordered table-hover shadow-sm">
              <tbody>
                <tr><td>Course Fees</td><td>45000 INR/year</td></tr>
                <tr><td>Level</td><td>Graduate</td></tr>
                <tr><td>Medium</td><td>Campus/Regular</td></tr>
                <tr><td>Course Duration</td><td>3 Year</td></tr>
                <tr><td>Mode</td><td>English</td></tr>
                <tr><td>Specialization</td><td>Computer Language & Software</td></tr>
              </tbody>
            </table>
            <h3>Basic Subjects in BCA</h3>
            <ul>
              <li>C, C++, JAVA & Python Lang.</li>
              <li>Engineering Math</li>
              <li>Database Management</li>
              <li>Software Engineering</li>
              <li>Operating System</li>
              <li>Management</li>
            </ul>
            <h3>Extra Activities in BCA</h3>
            <ul>
              <li>Project Preparation</li>
              <li>Research Reports</li>
              <li>Mock Interview</li>
              <li>Presentation</li>
              <li>Seminars</li>
              <li>Group Discussion</li>
            </ul>
          </div>

          {/* BCA Overview */}
          <div className="col-lg-6 shadow-lg p-4 bg-white rounded-4">
            <h1 className="text-success">BCA</h1>
            <h3>Bachelor Of Computer Application</h3>
            <img src="/img/bca2.png" alt="BCA2" className="img-fluid rounded shadow-sm mb-3" />
            <h3>About the BCA</h3>
            <p>The primary objective of the BCA course is to create a sound academic base in computer applications and software development.</p>
            <h3>SKIT Campus Additional Certification Programs:</h3>
            <ul>
              <li>Website Design & Development</li>
              <li>Python Language Training</li>
              <li>DBMS Training</li>
              <li>Personality Development Program</li>
            </ul>
            <p>BCA offers great career opportunities in IT. The course helps develop programming skills in Java, JavaScript, Python, C++, etc.</p>
          </div>
        </section>

        {/* BBA Section */}
        <section className="row gx-4 gy-5 mb-5">
          <div className="col-lg-6 shadow-lg p-4 bg-white rounded-4">
            <h1 className="text-warning">BBA</h1>
            <h2>Bachelor Of Business Administration</h2>
            <img src="/img/bba.jpg" alt="BBA" className="img-fluid rounded shadow-sm mb-3" />
            <h2>About the BBA</h2>
            <p>The BBA course is ideal for students from all streams aiming for a management career and forms a base for MBA.</p>
            <h3>SKIT Campus Certification Programs:</h3>
            <ul>
              <li>Basic Computer & Advance Excel</li>
              <li>Tally- GST & VAT</li>
              <li>Digital Marketing Training</li>
              <li>Soft Skill Development</li>
            </ul>
            <p>BBA offers broad management skills for future leadership roles and corporate careers.</p>
          </div>

          <div className="col-lg-6 shadow-lg p-4 bg-white rounded-4">
            <h1>Course Information</h1>
            <img src="/img/bba2.png" alt="BBA2" className="img-fluid rounded shadow-sm mb-3" />
            <table className="table table-bordered table-hover shadow-sm">
              <tbody>
                <tr><td>Course Fees</td><td>45000 INR/year</td></tr>
                <tr><td>Level</td><td>Graduate</td></tr>
                <tr><td>Medium</td><td>Campus/Regular</td></tr>
                <tr><td>Course Duration</td><td>3 Year</td></tr>
                <tr><td>Mode</td><td>English</td></tr>
                <tr><td>Specialization</td><td>Marketing / HR / Finance</td></tr>
              </tbody>
            </table>
            <h3>Basic Subjects in BBA</h3>
            <ul>
              <li>Management</li>
              <li>Entrepreneurship</li>
              <li>Database Management</li>
              <li>Basic Math</li>
              <li>Basic Computer</li>
              <li>Marketing</li>
              <li>Business Law</li>
            </ul>
            <h3>Extra Activities in BBA</h3>
            <ul>
              <li>Project Preparation</li>
              <li>Research Reports</li>
              <li>Mock Interview</li>
              <li>Presentation</li>
              <li>Seminars</li>
              <li>Group Discussion</li>
            </ul>
          </div>
        </section>

        {/* Extra Skill Development */}
        <section className="extra-skills bg-light py-5">
          <div className="container">
            <h1 className="text-center mb-4">Extra Program For Skill Development</h1>
            <p className="text-center heading-para">Here is what recent SKIT Campus graduates have to say about their experience.</p>
            <div className="row text-center g-4">
              {[
                {
                  title: 'Soft Skill',
                  desc: 'Communication, Spoken & Written English, Personality Development',
                  sub: 'Seminars, Events, Cultural Functions, Debates',
                  extra: 'Mock Interview',
                },
                {
                  title: 'Lab & Project',
                  desc: 'Practical Labs, Application Projects, Experiments',
                  sub: 'Presentations, Field Projects, Reports',
                  extra: 'Live Workshops',
                },
                {
                  title: 'Industrial Visit',
                  desc: 'Live Operations, Expert Interaction, Real Exposure',
                  sub: 'Technical Culture, Innovation, Team Skill',
                  extra: 'Entrepreneurship',
                },
                {
                  title: 'Internship',
                  desc: 'Real-World Work, Resume Building, Team Work',
                  sub: 'Time Management, Culture Training, Professional Growth',
                  extra: 'Job Opportunities',
                }
              ].map((item, index) => (
                <div className="col-md-6 col-lg-3" key={index}>
                  <div className="skill-box shadow-lg p-4 rounded-4 h-100">
                    <h1>{`0${index + 1}`}</h1>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <h4>{item.sub}</h4>
                    <h3>{item.extra}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Course;
