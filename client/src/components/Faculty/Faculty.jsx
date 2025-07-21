import React from 'react'

import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import './faculty.css'
const Faculty = () => {
  return (
    <div>
      <Header/>
      <main>
      <section>
          <div className="page-heading-box">
          <p className="page-heading">Faculty</p>
          <p className="heading-para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore fuga animi veniam necessitatibus, error voluptatum illum ipsum fugiat sapiente aspernatur.</p>
        </div>

        <div className="heading-box">
          <h1>Our Faculty</h1>
        </div>
        </section>

        <section>
          <div className="container">
            <div className="faculty-box">
              <div className="pro-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="pro-detail">
                <p className="name">Mr. Vimal Pal</p>
                <p className="degree">MCA , net , Persuing Phd</p>
                <p className="post">Principal</p>
              </div>
              <div className="media">
                <span>facebook</span>
                <span>linkedin</span>
                <span>instagram</span>
              </div>
            </div>
            <div className="faculty-box">
              <div className="pro-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="pro-detail">
                <p className="name">Mr. Vimal Pal</p>
                <p className="degree">MCA , net , Persuing Phd</p>
                <p className="post">Principal</p>
              </div>
              <div className="media">
                <span>facebook</span>
                <span>linkedin</span>
                <span>instagram</span>
              </div>
            </div>
            <div className="faculty-box">
              <div className="pro-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="pro-detail">
                <p className="name">Mr. Vimal Pal</p>
                <p className="degree">MCA , net , Persuing Phd</p>
                <p className="post">Principal</p>
              </div>
              <div className="media">
                <span>facebook</span>
                <span>linkedin</span>
                <span>instagram</span>
              </div>
            </div>
            <div className="faculty-box">
              <div className="pro-img">
                <img src="img/developer.png" alt="" />
              </div>
              <div className="pro-detail">
                <p className="name">Mr. Vimal Pal</p>
                <p className="degree">MCA , net , Persuing Phd</p>
                <p className="post">Principal</p>
              </div>
              <div className="media">
                <span>facebook</span>
                <span>linkedin</span>
                <span>instagram</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}

export default Faculty
