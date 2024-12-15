import React from 'react'
import "./Calculator.css"

function Calculator() {
  return (
    <div className='calculator--container'>
        <div className='calculator--title--page'>
            <div className='calculator--title myfont'>
                <h2 className='grey'>Project</h2>
                <h1>GoLang Calculator</h1>
            </div>
            <div>
                <img src='./images/calculator.png' alt='Calculator' />
            </div>
        </div>

        <div className='calculator--skills'>
            <div>
                <h3>Language</h3>
                <p>Go, JavaScript</p>
            </div>
            <div>
                <h3>Framework</h3>
                <p>React</p>
            </div>
            <div>
                <h3>API</h3>
                <p>eval()</p>
            </div>
            <div>
                <h3>Date</h3>
                <p>2024</p>
            </div>
            <div>
                <h3>Repo</h3>
                <a href='https://github.com/lukebrevoort/react_app' target='_blank' rel='noreferrer' className='website--link'>Link</a>
            </div>
        </div>

        <div className='calculator--intro' id='intro1'>
            <h2 className='calculator--intro--title myfont'>Intro:</h2>
            <div className='calculator--intro--content'>
                <p>This project is a simple calculator built using React and Go. It uses the eval() function to evaluate mathematical expressions.</p>
                <br />
            </div>
        </div>

        <div className='calculator--intro' id='intro2'>
            <img src='./images/calculatorUI.png' alt='Calculator UI' className='calculator--image'/>
            <h2 className='calculator--intro--title myfont'>The Idea:</h2>
            <div className='calculator--intro--content'>
                <p>The idea was to create a user-friendly calculator that can handle basic arithmetic operations. The calculator UI is built with React, and the backend logic is handled by Go.</p>
            </div>
        </div>

        <div className='calculator--intro' id='intro3'>
            <img src='./images/goLogo.png' alt='Go logo' className='calculator--image'/>
            <h2 className='calculator--intro--title myfont'>Go Backend:</h2>
            <div className='calculator--intro--content'>
                <p>The backend is built using Go, which handles the evaluation of mathematical expressions using the eval() function. This ensures that the calculations are performed efficiently and accurately.</p>
            </div>
        </div>  

        <div className='calculator--intro' id='intro4'>
            <img src='./images/reactLogo.png' alt='React logo' className='calculator--image'/>
            <h2 className='calculator--intro--title myfont'>React Frontend:</h2>
            <div className='calculator--intro--content'>
                <p>The frontend is built using React, providing a responsive and interactive user interface. The calculator UI is designed to be intuitive and easy to use.</p>
                <br />
            </div>
        </div>  

        <div className='calculator--intro' id="intro5">
            <img src='./images/result.png' alt='Result Example' className='calculator--image'/>
            <h1 className='calculator--intro--title myfont'>Here is the result:</h1>
            <div className='calculator--intro--content'>
                <p>Input any mathematical expression and get the result instantly. For example, 2 + 2 will give you 4.</p>
                <br />
            </div>
        </div>

        <div className='calculator--intro--result'>
            <p className='calculator--intro--content intro--color-blue'>1. The calculator can handle basic arithmetic operations such as addition, subtraction, multiplication, and division.</p>
            <p className='calculator--intro--content intro--color-red'>2. The UI is designed to be user-friendly and responsive, making it easy to use on any device.</p>
            <p className='calculator--intro--content intro--color-green'>3. The backend logic is handled by Go, ensuring efficient and accurate calculations.</p>
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

export default Calculator