import React from 'react'
import "./About.css"

function About() {
  return (
    <div>
      <div className='about--header'>
        <h1 className='about--header--text myfont'>I like to building things in my freetime. coding, writing, and creating :)</h1>
        <img src='./images/greenSweater.jpg' alt='photo of me' className='about--image'/>
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
          <p>Outside of school I enjoy Frisbee, Hiking, Weightlifting, and Lacrosse, so really anything active :).
            I am actively involved in the School's Student Government Association and love giving back to the Hoboken Community.
          </p>
          <br />
          <p>I also really enjoy exploring NYC and love spending time with my friends outside of class! Its a nice getaway from
            school and work.
          </p>
          <br />

        </div>
      </div>

    </div>
  )
}

export default About