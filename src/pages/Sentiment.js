import React from 'react'
import "./Sentiment.css"

function Sentiment() {
  return (

    <div className='sentiment--container'>
        <div className='sentiment--title--page'>
            <div className='sentiment--title'>
                <h2 className='grey'>Project</h2>
                <h1>Online Stock Sentiment Analysis</h1>
            </div>
            <div>
                <img src='./images/stockmarket.png' alt='Stock Market going up' />
            </div>
        </div>

        <div className='sentiment--skills'>
            <div>
                <h3>Language</h3>
                <p>Python</p>
            </div>
            <div>
                <h3>API</h3>
                <p>ChatGPT & GoogleSearch</p>
            </div>
            <div>
                <h3>HTML Parsing</h3>
                <p>Beautiful Soups 4</p>
            </div>
            <div>
                <h3>Date</h3>
                <p>2024</p>
            </div>
        </div>

        <div className='sentiment--intro'>
            <h2>Intro</h2>
        </div>

    </div>
  )
}

export default Sentiment