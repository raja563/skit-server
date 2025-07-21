import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './about.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  return (
    <div>
      <Header />
      <main className="container my-5">
        {/* Page Heading */}
        <section className="text-center mb-5">
          <div className="page-heading-box p-4 rounded-4 bg-light shadow-lg">
            <p className="page-heading display-5 fw-bold text-primary">About the SKIT</p>
            <p className="heading-para lead">
              The dream of this college was Late Shrimati Shakuntala Devi (Samaj Sewi) and Shri Krishna Kushwaha (Ex. ADO Agriculture), who aimed to help poor and needy students in rural Kanpur gain access to technical and professional education.
            </p>
          </div>
        </section>

        {/* Institute Name */}
        <section className="text-center mb-5">
          <h2 className="fw-bold text-success">.. Shakuntala Krishna Institute Of Technology KD64 ..</h2>
        </section>

        {/* Founder Section */}
        <section className="row g-4 mb-5 founder-box">
          <div className="col-lg-6 col-md-12 text-center p-4 border rounded shadow bg-white">
            <h2>Who We Are</h2>
            <img src="/img/shakuntaladevi.jpg" className="img-fluid founder-img mb-3" alt="Founder" />
            <h3 className="text-danger">Late shrimati Shakuntala Devi is the founder of this institution.</h3>
            <h5>Shakuntala Devi was an educated woman who was also a social worker and a self-reliant woman with the same thoughts and started this foundation to fulfill the gap of technical and professional education among the rural areas. And he sacrificed a lot and dedicated everything for this institution.</h5>
            <ul className="text-start">
              <li>Established In 2016</li>
              <li>Affiliated To CSJMU Kanpur</li>
              <li>College Code - KD64</li>
              <li>Top In Result</li>
              <li>Best In Placement</li>
              <li>Scholarship Norms of UP Govt.</li>
            </ul>
          </div>

          <div className="col-lg-6 col-md-12 p-4 border rounded shadow bg-white">
            <h2>Founder of SKIT Campus</h2>
            <div className="text-center mb-3">
              <img src="/img/prayas.png" alt="Prayas Logo" className="img-fluid rounded-3 shadow-lg" width="300" />
            </div>
            <h4>Run & Managed By Prayas Welfare Association</h4>
            <p>Registered in 2014 under Society Act 1860 (Reg. No. 0831). It promotes education in technical, commercial, and vocational fields in rural areas.</p>
            <ul className="text-start">
              <li>Serving technical education in rural India</li>
              <li>Providing skill-based training & employment</li>
              <li>Equal access to education for all students</li>
              <li>Focus on underprivileged & backward areas</li>
              <li>Empowering society through knowledge</li>
            </ul>
            <p>The aim is to offer quality education and transform society through modernization, justice, and productivity.</p>
          </div>
        </section>

        {/* Chairman Message */}
        <section className="row g-4 mb-5 align-items-center chairman-box">
          <div className="col-lg-5 col-md-12 text-center">
            <img src="/img/chairmanJi.jpg" className="img-fluid chairman-img rounded-4 shadow" alt="Chairman" />
          </div>
          <div className="col-lg-7 col-md-12 chairman-message bg-light p-4 rounded">
            <h2 className="text-primary">Message From Chairman</h2>
            <p>
             एस. के. आई. टी. कॉलेज के संस्थापक-अध्यक्ष के रूप में, हमारे कॉलेज की वेबसाइट का उपयोग करके आपसे संवाद करना वास्तव में मेरे लिए एक अनूठा सौभाग्य है।

सफल और प्रसन्न व्यक्ति एक सफल राष्ट्र का निर्माण करते हैं। लेकिन वह क्या है जो सफलता, लक्ष्यों की प्राप्ति और एक खुशहाल और संतुष्ट जीवन जीने के आपके मिशन को पूरा करने में सहायता करता है? वह मजबूत नींव कोई और नहीं बल्कि अच्छी शिक्षा है। क्योंकि शिक्षा में ही व्यक्ति, राष्ट्र और दुनिया भर में मानवता की सबसे बड़ी सेवा निहित है।

उत्कृष्टता प्राप्त करने के दृढ़ संकल्प से प्रेरित छात्र शिक्षकों के साथ, एक सक्षम और समर्पित संकाय ने सावधानीपूर्वक डिजाइन किए गए पाठ्यक्रम और इष्टतम बुनियादी ढांचे के साथ एस.के.आई.टी. कॉलेजशिक्षा की दुनिया में एक बड़ी ताकत बन गया है। मेरा लक्ष्य एस.आर.एम संस्थानों के प्रत्येक छात्र-शिक्षक को सर्वोत्तम शिक्षा और बुनियादी ढांचे से लैस करना है ताकि उन्हें जीवन में सर्वश्रेष्ठ हासिल करने में मदद मिल सके। हम न केवल उनमें सर्वोत्तम रचनात्मक और तकनीकी योग्यताएँ विकसित करते हैं, बल्कि उन्हें अपरिहार्य मानवीय गुण भी सिखाते हैं।"
            </p>
            <h5>Mr. Shri Krishna Kushwaha</h5>
            <h6>Rtd. ADO Agriculture</h6>
            <p>📞 +91 6307332519</p>
          </div>
        </section>

        {/* Director Message */}
        <section className="row g-4 mb-5 align-items-center director-msg">
          <div className="col-lg-5 col-md-12 text-center">
            <img src="/img/dir.jpeg" className="img-fluid director-img rounded-4 shadow" alt="Director" />
          </div>
          <div className="col-lg-7 col-md-12 dir-msg bg-light p-4 rounded">
            <h2 className="text-success">Message From Director</h2>
            <p>
              t gives me great pleasure to invite you to take an initial peek into the heart that beats behind the appealing façade of Shakuntala Krishna Institute Of Technology College Code KD64. I thank you for your interest in this exceptional institution which has recorded five decades of constant development, in the course of which it has accomplished much, making it one of the colleges recognized for its excellence and therefore, much sought after by the fresh applicants.

The SKIT College tradition happily brings together sound academic achievement with an extensive, vibrant co-curricular programme that includes sports, and leadership training programmes. Our mission is to inculcate the love of knowledge in our students and, for this, we aim to develop the skills and demeanour of lifelong ‘learning,’ essential for making responsible global citizens. This will make them immensely capable of facing the future with resilience and optimism. On the deeper level, we try to instil the values of respect and trust in relationships that are the foundation of real success.

At SKIT Campus then, we believe that ‘education’ is a wholesome, holistic exercise and as such we strive to give a whole new meaning to the word. Coupling this basic premise with the idea of a sense of belonging to one family—the SKIT family—we look at ourselves as ‘care-givers.’ We care for the mind—ours is a sterling academic institution; we care for the person—the accent is on the all-round development of personality. I wish you the best in the process of seeking to become a part of this family.
            </p>
            <h5>Director: Vivek Pr. Singh</h5>
            <h6>Asst. Professor</h6>
            <p>📞 +91 9918629349</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
