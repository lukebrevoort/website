import React from 'react'

function Project(props) {
  return (
    <div>
      <div className='project--image project--card'>
        <img src={props.img} alt={props.desc} loading='lazy'/>
        <div className='project--content'>
          <div>{props.desc}</div> 
          <p className='project--title'>{props.title}</p>
        </div>
      </div>
    </div>

  )
}

export default Project