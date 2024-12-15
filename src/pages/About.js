import React from 'react'
import "./About.css"

function About() {
  return (
    <div>
      <div className='about--header'>
        <h1 className='about--header--text myfont'>I like to building things in my freetime. coding, writing, and creating :)</h1>
        <img src='./images/greenSweater.jpg' alt='Me!' className='about--image' loading="lazy"/>
      </div>
      <div className='about--container'>
        <h2 className='myfont about--title'>About:</h2>
        <div className='about--content'>
          <p>I'm Luke Brevoort a freshman at Stevens Institute of Technology in Hoboken NJ who is studying  
               Computer Science! I am passionate about AI, Fullstack Development, and Natural Langauge Processing.</p>
          <br />
          <p>I work on a variety of projects of different fields to learn as much as possible.
            From Machine Learning, Frontend Development, to Concurrency im always trying to 
            expand my horizons which inclues joining research and trying to learn as much as possible
          </p>
          <br />
          <p>In my spare time I like creating projects that I find everyday value in like this website or 
            my Stock Sentiment Analysis program.
          </p>
          <br />
          <p>Outside of school I enjoy Frisbee, Skiing, Weightlifting, and Lacrosse, so really anything active :).
            I am actively involved in the School's Student Government Association and love giving back to the Hoboken Community.
          </p>
          <br />
          <p>I also really enjoy exploring NYC and love spending time with my friends outside of class! It's a nice getaway from
            school and work.
          </p>
          <br />
        </div>
      </div>
      <div className='about--photos'>
        <img src='./images/NYC.jpg' alt='NYC' className='about--photo' loading="lazy"/>
        <img src='./images/Lacrosse.jpg' alt='Lacrosse' className='about--photo photo2' loading="lazy"/>
        <img src='./images/Skiing.jpg' alt='Ski Mountain' className='about--photo photo3' loading="lazy"/>
      </div>
      <div className='about--container'>
        <h2 className='myfont about--title'>Experience:</h2>
        <div className='about--experience--container'>
          <div className='about--experience'>
            <p className='p-bold'>EH Yang Lab</p>
            <p>Undergraduate Researcher</p>
            <p className='about--experience-date'>2024 – Present</p>
          </div>
          <div className='about--experience'>
            <p className='about--experience--job p-bold'>Student Government Organization</p>
            <p>Senator</p>
            <p className='about--experience-date'>2024 – Present</p>
          </div>
          <div className='about--experience'>
            <p className='about--experience--job p-bold'>Student Government Organization and NHS</p>
            <p>Student Body President and National Honors Society VP</p>
            <p className='about--experience-date'>2023 – 2024</p>
          </div>
        </div>
      </div>
      <footer className="navbar-left">
        <a href="#head">
            <span className="navBar-left-blue">l</span>
            <span className="navBar-left-red">u</span>
            <span className="navBar-left-purple">k</span>
            <span className="navBar-left-green">e</span>
            <span className="navBar-left-green">.</span>
            <span className="navBar-left-red">b</span>
            <span className="navBar-left-purple">r</span>
            <span className="navBar-left-green">e</span>
            <span className="navBar-left-blue">v</span>
        </a>
      </footer>

    </div>
  )
}

export default About