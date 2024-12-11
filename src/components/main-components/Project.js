import React from 'react'

function Project(props) {
  return (
    <div>
      <div className='project--image card'>
        <img src={props.img} alt='Image'/>
        <div className='project--content'>
          <p>{props.title}</p>
        </div>
      </div>
    </div>

  )
}

export default Project