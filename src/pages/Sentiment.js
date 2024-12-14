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

        <div className='sentiment--intro' id='intro1'>
            <h2 className='sentiment--intro--title myfont'>Intro:</h2>
            <div className='sentiment--intro--content'>
                <p>I wanted to start investing in stocks but didn't know which ones to buy. 
                So I created a program to tell me which stocks were good or bad based off of website sentiment analysis. Here is how the program worked:</p>
                <br />
            </div>
        </div>

        <div className='sentiment--intro' id='intro2'>
            <img src='./images/stocksImagePage.jpg' alt='CSV logo' className='sentiment--image'/>
            <h2 className='sentiment--intro--title myfont'>The Idea:</h2>
            <div className='sentiment--intro--content'>
                <p>The idea was to take in a .csv and sort through alphebetically to find which stock the user was interested in; this goes through a 
                validate function which checks first if the stock is in the .csv and second scans to find the selected stock.
                </p>
            </div>
        </div>

        
        <div className='sentiment--intro' id='intro3'>
            <img src='./images/google.webp' alt='Google logo' className='sentiment--image'/>
            <h2 className='sentiment--intro--title myfont'>Google Search and Parse:</h2>
            <div className='sentiment--intro--content'>
                <p>Then after the stock is found, the code pushes a request through googles seaches and we note the URL's of these websites we take from.
                The main aritcles tags from the HTMl are then stored and sent to the HTML Parsing. BS4 does a great job removing lots of unnessary information to reduce the amount of tokens that will be send to ChatGPT API.
                </p>
            </div>
        </div>  

        <div className='sentiment--intro' id='intro4'>
        <img src='./images/chat.webp' alt='ChatGPT logo' className='sentiment--image'/>
            <h2 className='sentiment--intro--title myfont'>ChatGPT API Integration:</h2>
            <div className='sentiment--intro--content'>
                <p> Then after it completes we stop the completed file at the max number of tokens that can go through a ChatGPT query. At 
                this point when this project was made the max tokens was 15500.
                </p>
                <br />
                <p>ChatGPT is then given a specific prompt to try and reduce temperature of responses and ensure the most consistent results possible.
                This prompt engineering was made possible through googles resources and went through multiple iterations to ensure accuracy.
                </p>
                <br />
            </div>
        </div>  

        <div className='sentiment--intro' id="intro5">

        
        <img src='./images/apple.webp' alt='Apple Logo Example' className='sentiment--image'/>

        <h1 className='sentiment--intro--title myfont'>Here is the result:</h1>

        <div className='sentiment--intro--content'>
                <p>
                    Input the symbolic repersentation of any Fortune 500 Company you are considering to invest in: AAPL</p>
                    <br />
                    
                    <p>Sentiment Analysis: Based on the provided context, Apple Inc. is a strong choice of investment because:
                </p>
                <br />
            </div>
        </div>

        <div className='sentiment--intro--result'>
            <p className='sentiment--intro--content intro--color-blue'>1. Apple's revenue is not solely dependent on one product. They have a diverse product portfolio including iPhones, iPads, Macs, 
                wearables, and services. This reduces the risk associated with relying on a single product for revenue generation.
            </p>

            <p className='sentiment--intro--content intro--color-red'>2. Apple has a strong track record of innovation and customer loyalty. They consistently release new and improved products, which 
                helps maintain their market share and attract new customers. This innovation-driven approach has been a key driver of their success.
            </p>

            <p className='sentiment--intro--content intro--color-green'>3. Apple has a strong financial position. They have a significant amount of cash reserves and generate substantial free cash flow. 
                This provides them with the ability to invest in research and development, acquisitions, and return value to shareholders through 
                dividends and share buybacks.
            </p>

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

export default Sentiment