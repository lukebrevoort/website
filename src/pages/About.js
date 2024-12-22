import React from 'react'

function About() {
  return (
    <div>
      <div className='flex flex-col-reverse justify-end items-center relative overflow-hidden text-ellipsis lg:flex-row'>
        <h1 className='text-classicWhite max-w-screen-sm mb-12 text-3xl myfont'>I like to building things in my freetime. coding, writing, and creating :)</h1>
        <img src='./images/greenSweater.jpg' alt='Me!' className='w-96 h-auto p-10 opacity-75 relative transition-width delay-150 ease lg:w-5/12' loading="lazy"/>
      </div>
      <div className='flex justify-center text-left items-normal gap-10 text-classicWhite'>
        <h2 className='myfont mt-0 text-3xl'>About:</h2>
        <div className='mt-3 leading-9 w-96 lg:w-1/3'>
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
      <div className='flex flex-col justify-evenly items-center mb-20 lg:flex-row gap-10'>
        <img src='./images/NYC.jpg' alt='NYC' className='w-96 h-auto lg:w-3/12' loading="lazy"/>
        <img src='./images/Lacrosse.jpg' alt='Lacrosse' className='w-96 h-auto mb-0 lg:w-3/12 lg:mb-12' loading="lazy"/>
        <img src='./images/Skiing.jpg' alt='Ski Mountain' className='w-96 h-auto mb-0 lg:w-3/12 lg:mb-28' loading="lazy"/>
      </div>
      <div className='flex justify-center text-left items-normal gap-10 text-classicWhite'>
        <h2 className='myfont mt-0 text-3xl'>Experience:</h2>
        <div className='flex flex-col gap-20 mt-3'>
          <div className='leading-9'>
            <p className='p-bold'>EH Yang Lab</p>
            <p>Undergraduate Researcher</p>
            <p className='text-classicGrey'>2024 – Present</p>
          </div>
          <div className='leading-9'>
            <p className='about--experience--job p-bold'>Student Government Organization</p>
            <p>Senator</p>
            <p className='text-classicGrey'>2024 – Present</p>
          </div>
          <div className='leading-9'>
            <p className='about--experience--job p-bold'>Student Government Organization and NHS</p>
            <p>Student Body President and National Honors Society VP</p>
            <p className='text-classicGrey'>2023 – 2024</p>
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