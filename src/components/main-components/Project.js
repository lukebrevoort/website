import React from 'react'

function Project(props) {
  return (
    <div>
      <div className='project-component--image project-component--card'>
        <img src={props.img} alt={props.desc} loading='lazy'/>
        <div className='project-component--content'>
          <div>{props.desc}</div> 
          <p className='project-component--title'>{props.title}</p>
        </div>
      </div>
    </div>
  )
}

export default Project
