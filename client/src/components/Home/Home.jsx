import  { useState, useEffect } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './home.css'
import Slider from '../Slider/Slider'
import DarkSlider from '../DarkSlider/DarkSlider'
import QuickEnquiry from './QuickEnquiry'
import { FaUserGraduate, FaAward, FaBriefcase, FaUsers } from 'react-icons/fa';
import axios from 'axios'
import studentData from '../data/student.json';


const stats = [
{ icon: <FaUserGraduate />, target: 5000, label: 'Happy Enrolled Students' },
{ icon: <FaAward />, target: 2000, label: 'Passed Students Awarded Degree from CSJM University' },
{ icon: <FaBriefcase />, target: 1500, label: 'Placed Students Satisfied with SKIT Campus' },
{ icon: <FaUsers />, target: 42, label: 'Experienced and Dedicated Staff' },
];


 // FAQ data
const faqData = [
  {
    question: '1. What is the fee of BBA/BCA course per year?',
    answer: `उत्तर प्रदेश (UP) में BBA और BCA करने का खर्चा कॉलेज, शहर, और अन्य खर्चों पर निर्भर करता है।\nसरकारी कॉलेजों में: ₹50,000 - ₹150,000 प्रति वर्ष\nBBA: ₹50,000 - ₹130,000\nBCA: ₹55,000 - ₹150,000`,
  },
  {
    question: '2. BBA / BCA: is a better career option or not?',
    answer: `दोनों ही कोर्स अच्छे हैं और आपकी रुचि पर निर्भर करते हैं।\nBBA: प्रबंधन, मार्केटिंग, HR में अच्छा करियर\nBCA: आईटी, प्रोग्रामिंग, सॉफ्टवेयर डेवेलपमेंट में उज्जवल भविष्य`,
  },
  {
    question: '3. Higher Education Opportunities After BBA and BCA?',
    answer: `BBA के बाद: MBA, PGDM, B.Ed, MA, Digital Marketing आदि\nBCA के बाद: MCA, M.Tech, Data Science, Cloud, Full Stack आदि`,
  },
  {
    question: '4. What are the opportunities in government sector after doing BBA/BCA?',
    answer: `बैंकिंग, SSC, UPSC, रेलवे, सरकारी IT विभागों में नौकरियों के अवसर होते हैं।`,
  },
  {
    question: '5. Career After BBA/BCA in the private sector?',
    answer: `BBA: HR, Finance, Marketing में ₹3-6 LPA से शुरुआत\nBCA: Software, IT Jobs में ₹3-6 LPA से शुरुआत`,
  },
];

const Home = () => {


    const [faculty, setFaculty] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    const [faqOpen, setFaqOpen] = useState(null);
      const toggleFaq = (index) => {
      setFaqOpen(prev => (prev === index ? null : index));
      };
  
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

  

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((stat, i) => {
      const increment = stat.target / 100;
      return setInterval(() => {
        setCounts(prevCounts => {
          const newCounts = [...prevCounts];
          if (newCounts[i] < stat.target) {
            newCounts[i] = Math.min(newCounts[i] + Math.ceil(increment), stat.target);
          }
          return newCounts;
        });
      }, 30);
    });

    return () => intervals.forEach(clearInterval);
  }, []);



  return (
    <div>
        {/* {faculty.map((val,key)=>{
          return(
            <div>
              <p className='bg-danger'>{val.fullname}</p>
            </div>
          )
        })} */}
        <Header/>
        <main>
          <Slider/>

          {/* model quick enquiry */}
          <QuickEnquiry/>

          <section className="number-inc">
            {stats.map((stat, index) => (
              <div className="num-box" key={index}>
                <div className="icon">{stat.icon}</div>
                <h2>{counts[index]}+</h2>
                <p>{stat.label}</p>
              </div>
            ))}
          </section>
          
          <section className='learn-here-container '>

            <div className="main-img-container">
            <div className="learn-here">
                <p className="learn-heading">
                  Learn Here Lead Anywhere
                </p>
                <p className="learn-content">
                SKIT also Provide Online learning platform that provides students with a holistic learning experience to help them become industry-ready. With the guidance of Industry Experts,Online Courses and blended learning, it allows students to Learn Here and Lead Anywhere.
                </p>
            </div>

            <div>
              <div className="moving-outer">
                  <marquee className="moving-content" behavior="" direction="">
                      BBA all Semester practical and viva/voca held on 23/05/2025
                    </marquee>
                </div>

              <div className="main-img">
                <img src="img/skit logo.png" alt="" />
              </div>
            </div>
            </div>


            <div className="box-container">
              <div className="learn-box">
                <i className="bi bi-lightbulb-fill"></i>
                <p>Learn with Practical</p>
              </div>
              <div className="learn-box">
                <i className="bi bi-person-video3"></i>
                <p>Experienced Teachers</p>
              </div>
              <div className="learn-box">
                <i className="bi bi-award-fill"></i>
                <p>Scholarship Scheme</p>
              </div>
              <div className="learn-box">
                <i className="bi bi-briefcase-fill"></i>
                <p>Excellent Placement</p>
              </div>
            </div>


          </section>

          <section className="Why-Choose-container">
              <h2>Why Choose Us</h2>
              <div className="choose-line"></div>
              <p>SKIT is a pioneer centre for teaching, learning and research, consistently ranked among the top proffesional & technical institute in Kanpur (D)</p>
          </section>

        <section className='Dreams-container'>
          <div className="dreams-img">
              <h2>Dreams Comes True Here</h2>
              <img src="img/dreams-img.jpg" alt="" />
          </div>
          <div className="dreams-content">
    <h4 className="mb-3 text-primary">Why Choose Us?</h4>
    <ul className="list-group list-group-flush">
      <li className="list-group-item d-flex align-items-start">
        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
        We offer a strong academic foundation in your chosen field.
      </li>
      <li className="list-group-item d-flex align-items-start">
        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
        Experienced faculty with industry expertise.
      </li>
      <li className="list-group-item d-flex align-items-start">
        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
        Excellent placement opportunities with various companies.
      </li>
      <li className="list-group-item d-flex align-items-start">
        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
        A supportive learning environment, practical hands-on experience through internships and projects.
      </li>
      <li className="list-group-item d-flex align-items-start">
        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
        A vibrant student community and a reputation for producing successful graduates in both business and IT sectors.
      </li>
      <li className="list-group-item d-flex align-items-start">
        <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
        Giving you a competitive edge in the job market.
      </li>
    </ul>
  </div>
        </section>
        
        <section className="features ">
          <div className="features-overview Why-Choose-container">
            <h2>Features & Overviews</h2>
            <div className="line choose-line"></div>
            <p>SKIT campus hosts a wide variety of exceptional facilities to create an environment where you can shape your future. We give massive importance to our facilities and learning resources and continuously ensure that our staff and students have full access to everything they need to help them succeed in their work and study.</p>
          </div>

<div className="container my-5">
  <h2 className="text-center text-primary mb-4 fw-bold">Campus Features</h2>
  <div className="row g-4">

  

         {/* Feature Card 1 */}
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-lg border-0 rounded-4 feature-card">
        <div className="card-body">
          <h5 className="card-title text-success fw-bold">
            <i className="bi bi-journal-richtext me-2"></i>Online Lec & Notes
          </h5>
          <p className="card-text text-secondary">
            SKIT has been providing high-quality and open access to multilingual educational resources including E-books and study Materials . To motivate widespread learning, the e-resources can be accessed globally by students, teachers, professionals or anyone who wishes to acquire knowledge.
          </p>
        </div>
      </div>
    </div>

    {/* Feature Card 2 */}
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-lg border-0 rounded-4 feature-card">
        <div className="card-body">
          <h5 className="card-title text-success fw-bold">
            <i className="bi bi-wifi me-2"></i>e-Campus
          </h5>
          <p className="card-text text-secondary">
            Wi-Fi also allows communications directly from one computer to another without the involvement of an access point. This is called the adhoc mode of Wi-Fi. This wireless ad hoc network mode has proven popular with digital CCTV,Projector and other consumer electronics devices..
          </p>
        </div>
      </div>
    </div>

    {/* Feature Card 3 */}
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-lg border-0 rounded-4 feature-card">
        <div className="card-body">
          <h5 className="card-title text-success fw-bold">
            <i className="bi bi-easel2-fill me-2"></i>Digital Classroom
          </h5>
          <p className="card-text text-secondary">
            Well-furnished spacious classrooms and lecture halls give the future managers and technocrats exposure to focus on their core competencies. The latest audio-visual and multimedia technology enables classroom. classroom enbeld internet and projector with sound system.
          </p>
        </div>
      </div>
    </div>

    {/* Feature Card 4 */}
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-lg border-0 rounded-4 feature-card">
        <div className="card-body">
          <h5 className="card-title text-success fw-bold">
            <i className="bi bi-camera-video-fill me-2"></i>CCTV Security
          </h5>
          <p className="card-text text-secondary">
           All the departments, class, blocks and other areas within the college is equipped with 24*7 hours working CCTV cameras. Besides these the college is under by experienced and capable security personnel round the clock. All the staffs, teachers & students are provided with the ID card of the college which ensures no entry without ID card.
          </p>
        </div>
      </div>
    </div>

    {/* Feature Card 5 */}
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-lg border-0 rounded-4 feature-card">
        <div className="card-body">
          <h5 className="card-title text-success fw-bold">
            <i className="bi bi-people-fill me-2"></i>Student Support Cell
          </h5>
          <p className="card-text text-secondary">
            Student Support Cell of SKIT has been established from Academic year 2016-2017. This cell guides the students who need help to solve their problems. It has preserved a data of each undergraduate student focusing on general official information, year wise result, co- curricular & extracurricular excellence, etc..
          </p>
        </div>
      </div>
    </div>

    {/* Feature Card 6 */}
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-lg border-0 rounded-4 feature-card">
        <div className="card-body">
          <h5 className="card-title text-success fw-bold">
            <i className="bi bi-briefcase-fill me-2"></i>Training & Placement
          </h5>
          <p className="card-text text-secondary">
            Training and Placement department is dedicated towards proper placement of students .It advices students on career options and provides the latest information on training & employment opportunities. The department looks after the interest of the students and the employers by providing them the necessary platform..
          </p>
        </div>
      </div>
    </div>
</div>
</div>
</section>

        <section className="testimonials">

          <div className="testimonials-heading Why-Choose-container">
            <h2>Testimonials</h2>
            <div className="line choose-line"></div>
            <p>"He is compelled by necessity to escape from something, and indeed he possesses a sincere and consistent character."</p>
          </div>
          
          <div className="testimonials-box-container">
            
                  {faculty.map((val,key)=>{
                    return(
                      <div className="testimonial-box">
                    <div className="pro-img mb-2">
                      <img src={`${API_URL}${val.profile}`} alt="profile-image" />
                    </div>
                    <div className="pro-name">
                      <h2 className="fw-bold text-primary mb-1">{val.fullname}</h2>
                      <h5 className=" mb-2 text-success">{val.qualification}</h5>
                    </div>
                    <div className="pro-star text-warning mb-3">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                    </div>
                    <div className="pro-list">
                      <blockquote className="blockquote">
                      </blockquote>
                      <p>{val.department}</p>
                    </div>
                  </div>
                    )
                  })}
          </div>


        </section>

          <DarkSlider/>
          
        <section className="our-bright-star">
          <div className="bright-star-heading Why-Choose-container">
            <h2>Our Bright Star</h2>
            <div className="choose-line"></div>
            <p>Here is an alumni(passout student) of what recent SKIT Campus graduates have to say about their experience.</p>
          </div>

          <div className="bright-star-box-container">
  {studentData.map((student, index) => (
    <div className="bright-star-box shadow-sm rounded-4" key={index}>
      <div className="br-star-img">
        <img
          src={student.image}
          alt={student.name}
          className=""
        />
      </div>
      <div className="star-name text-center mt-3">
        <h4 className="fw-bold text-primary">{student.name}</h4>
        <p className="post text-success mb-1"><span className='text-warning'>Placed At :</span> {student.placed}</p>
        <p className="batch mb-1"><strong><span className='text-warning'>Course : </span></strong> {student.course}</p>
        <p className="sector text-muted"></p>
        <p className="text-secondary px-3" style={{ fontSize: '0.9rem' }}>
        
        </p>
      </div>
    </div>
  ))}
</div>  
        </section>

        <section className="faq py-5">
  <div className="container">
    <h2 className="text-center mb-4 fw-bold text-primary">Frequently Asked Questions</h2>
    <p className="text-center mb-5 text-secondary">
      छात्रों द्वारा अक्सर पूछे जाने वाले प्रश्न — बीबीए/बीसीए कौन सा कोर्स बेहतर है: पात्रता मानदंड, करियर, फीस, अवधि और वेतन से संबंधित
    </p>

    <div className="row">
      {/* Left Column: Question Titles */}
      <div className="col-md-5">
        <div className="list-group">
          {faqData.map((item, index) => (
            <button
              key={index}
              className={`list-group-item list-group-item-action ${
                faqOpen === index ? 'active' : ''
              }`}
              onClick={() => toggleFaq(index)}
              style={{ cursor: 'pointer' }}
            >
              {item.question}
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Selected Answer */}
      <div className="col-md-7">
        {faqOpen !== null && (
          <div className="card shadow-sm border-0 ms-md-3">
            <div className="card-body bg-light rounded-4 border-start border-4 border-primary">
              <h5 className="card-title fw-bold text-primary">
                {faqData[faqOpen].question}
              </h5>
              <div className="card-text text-secondary mt-3">
                {faqData[faqOpen].answer.split('\n').map((line, idx) => (
                  <p key={idx} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}
        {faqOpen === null && (
          <div className="text-muted text-center pt-4">कृपया एक प्रश्न चुनें...</div>
        )}
      </div>
    </div>
  </div>
</section>

        
              
         
        </main>
      <Footer/>
    </div>
  )
}

export default Home
