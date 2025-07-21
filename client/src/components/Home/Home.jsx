import  { useState } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './home.css'
import Slider from '../Slider/Slider'
import DarkSlider from '../DarkSlider/DarkSlider'
import QuickEnquiry from './QuickEnquiry'


const Home = () => {


  return (
    <div>

        <Header/>
        <main>
          <Slider/>

          {/* model quick enquiry */}
          <QuickEnquiry/>
          
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
                  <p>Learn with Practically</p>
              </div>
              <div className="learn-box">
                  <p>Experince Teacher</p>
              </div>
              <div className="learn-box">
                  <p>Schlorship Scheme</p>
              </div>
              <div className="learn-box">
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
              <div className="dreams-list">
                  <div className="list">*</div>
                  <p>We offer a strong academic foundation in your chosen field.</p>
              </div>
              <div className="dreams-list">
                  <div className="list">*</div>
                  <p>We offer a strong academic foundation in your chosen field.</p>
              </div>
              <div className="dreams-list">
                  <div className="list">*</div>
                  <p>We offer a strong academic foundation in your chosen field.</p>
              </div>
              <div className="dreams-list">
                  <div className="list">*</div>
                  <p>We offer a strong academic foundation in your chosen field.</p>
              </div>
              <div className="dreams-list">
                  <div className="list">*</div>
                  <p>We offer a strong academic foundation in your chosen field.</p>
              </div>
          </div>
        </section>
        
        <section className="features ">
          <div className="features-overview Why-Choose-container">
            <h2>Features & Overviews</h2>
            <div className="line choose-line"></div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque voluptatibus accusamus maxime molestiae ipsa! Eius beatae ducimus obcaecati consectetur molestias quasi asperiores consequuntur dolor doloremque? Repudiandae veritatis vel facilis perferendis, sequi tempora saepe, repellat nesciunt odio officia commodi error esse, ad in culpa eligendi. Esse, illum hic voluptatum nam id tempore veniam exercitationem minus obcaecati perferendis eius soluta rem </p>
          </div>

          <div className="features-box-container">
            <div className="features-box notes">
              <h2>Online Lec & Notes</h2>
              <div className="line"></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum labore earum odio, ducimus asperiores aliquid iure, libero dignissimos natus ut cumque iusto aut suscipit harum quasi hic inventore dolor itaque sequi. Quaerat,</p>
            </div>
            <div className="features-box notes">
              <h2>Online Lec & Notes</h2>
              <div className="line"></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum labore earum odio, ducimus asperiores aliquid iure, libero dignissimos natus ut cumque iusto aut suscipit harum quasi hic inventore dolor itaque sequi. Quaerat,</p>
            </div>
            <div className="features-box notes">
              <h2>Online Lec & Notes</h2>
              <div className="line"></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum labore earum odio, ducimus asperiores aliquid iure, libero dignissimos natus ut cumque iusto aut suscipit harum quasi hic inventore dolor itaque sequi. Quaerat,</p>
            </div>
            <div className="features-box notes">
              <h2>Online Lec & Notes</h2>
              <div className="line"></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum labore earum odio, ducimus asperiores aliquid iure, libero dignissimos natus ut cumque iusto aut suscipit harum quasi hic inventore dolor itaque sequi. Quaerat,</p>
            </div>
            <div className="features-box notes">
              <h2>Online Lec & Notes</h2>
              <div className="line"></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum labore earum odio, ducimus asperiores aliquid iure, libero dignissimos natus ut cumque iusto aut suscipit harum quasi hic inventore dolor itaque sequi. Quaerat,</p>
            </div>
            <div className="features-box notes">
              <h2>Online Lec & Notes</h2>
              <div className="line"></div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum labore earum odio, ducimus asperiores aliquid iure, libero dignissimos natus ut cumque iusto aut suscipit harum quasi hic inventore dolor itaque sequi. Quaerat,</p>
            </div>
          </div>

        </section>

        <section className="testimonials">

          <div className="testimonials-heading Why-Choose-container">
            <h2>Testimonials</h2>
            <div className="line choose-line"></div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem illo labore ullam cupiditate quam commodi, officiis architecto obcaecati.</p>
          </div>

          <div className="testimonials-box-container">
            <div className="testimonial-box features-box">
              <div className="pro-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="pro-name">
                <h3>Mrs. Neha Kamal</h3>
                <p>BBA-HOD</p>
              </div>
              <div className="pro-star">
                *
              </div>
              <div className="pro-list">
                "
                <ul>
                  <li>B.Com</li>
                  <li>MBA</li>
                </ul>
                "
              </div>
            </div>
          </div>

        </section>

          <DarkSlider/>
          
        <section className="our-bright-star">
          <div className="bright-star-heading Why-Choose-container">
            <h2>Our Bright Star</h2>
            <div className="choose-line"></div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ab repudiandae, cumque iste corporis doloremque?</p>
          </div>

          <div className="bright-star-box-container ">
            <div className="bright-star-box">
              <div className="star-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="star-name">
                <h3>Rohit Pal</h3>
                <p className="post">Uttar Pradesh Police</p>
                <p className="sector">Government sector</p>
                <p className="batch">Batch 2016-2019</p>
                <p className="course">Course-BCA</p>
              </div>
            </div>
            <div className="bright-star-box">
              <div className="star-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="star-name">
                <h3>Rohit Pal</h3>
                <p className="post">Uttar Pradesh Police</p>
                <p className="sector">Government sector</p>
                <p className="batch">Batch 2016-2019</p>
                <p className="course">Course-BCA</p>
              </div>
            </div>
            <div className="bright-star-box">
              <div className="star-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="star-name">
                <h3>Rohit Pal</h3>
                <p className="post">Uttar Pradesh Police</p>
                <p className="sector">Government sector</p>
                <p className="batch">Batch 2016-2019</p>
                <p className="course">Course-BCA</p>
              </div>
            </div>
            <div className="bright-star-box">
              <div className="star-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="star-name">
                <h3>Rohit Pal</h3>
                <p className="post">Uttar Pradesh Police</p>
                <p className="sector">Government sector</p>
                <p className="batch">Batch 2016-2019</p>
                <p className="course">Course-BCA</p>
              </div>
            </div>
            <div className="bright-star-box">
              <div className="star-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="star-name">
                <h3>Rohit Pal</h3>
                <p className="post">Uttar Pradesh Police</p>
                <p className="sector">Government sector</p>
                <p className="batch">Batch 2016-2019</p>
                <p className="course">Course-BCA</p>
              </div>
            </div>
            <div className="bright-star-box">
              <div className="star-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="star-name">
                <h3>Rohit Pal</h3>
                <p className="post">Uttar Pradesh Police</p>
                <p className="sector">Government sector</p>
                <p className="batch">Batch 2016-2019</p>
                <p className="course">Course-BCA</p>
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
