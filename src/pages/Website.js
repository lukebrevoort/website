import React from 'react'
import "./Website.css"

function Website() {
return (
    <div className='website--container'>
            <div className='website--title--page'>
                    <div className='website--title'>
                            <h2 className='grey'>Project</h2>
                            <h1>Personal Website</h1>
                    </div>
                    <div>
                            <img src='./images/websiteimg.png' alt='Personal Website' loading='lazy'/>
                    </div>
            </div>

            <div className='website--skills'>
                    <div>
                            <h3>Language</h3>
                            <p>JavaScript, HTML, CSS</p>
                    </div>
                    <div>
                            <h3>Framework</h3>
                            <p>React</p>
                    </div>
                    <div>
                            <h3>Model</h3>
                            <p>WebLLM & Llama 3.2</p>
                    </div>
                    <div>
                            <h3>Date</h3>
                            <p>2024</p>
                    </div>
                    <div>
                            <h3>Repo</h3>
                            <a href='https://github.com/lukebrevoort/website' target='_blank' rel='noreferrer' className='website--link'>Link</a>
                    </div>
            </div>

            <div className='website--intro' id='intro1'>
                    <h2 className='website--intro--title myfont'>Intro:</h2>
                    <div className='website--intro--content'>
                            <p>This project is a personal website built using React. It showcases my portfolio and provides information about my skills and projects.</p>
                            <br />
                    </div>
            </div>

            <div className='website--intro' id='intro2'>
                    <img src='./images/websiteDesign.png' alt='Website Design' className='website--image' loading='lazy'/>
                    <h2 className='website--intro--title myfont'>Design:</h2>
                    <div className='website--intro--content'>
                            <p>The design of the website is clean and modern, with a focus on usability and accessibility. It includes a responsive layout that works well on both desktop and mobile devices (WIP).</p>
                    </div>
            </div>

            <div className='website--intro' id='intro3'>
                    <img src='./images/reactLogo.png' alt='React Logo' className='website--image' loading='lazy'/>
                    <h2 className='website--intro--title myfont'>Development:</h2>
                    <div className='website--intro--content'>
                            <p>The website is built using React, a popular JavaScript library for building user interfaces. React allows for the creation of reusable components, making the development process more efficient.</p>
                    </div>
            </div>

            <div className='website--intro' id='intro4'>
                    <img src='./images/cssLogo.png' alt='CSS Logo' className='website--image' loading='lazy'/>
                    <h2 className='website--intro--title myfont'>Styling:</h2>
                    <div className='website--intro--content'>
                            <p>The styling of the website is done using CSS. Custom styles are applied to ensure a consistent look and feel across all pages.</p>
                    </div>
            </div>

            <div className='website--intro' id="intro5">
                    <img src='./images/portfolio.png' alt='Portfolio' className='website--image' loading='lazy'/>
                    <h1 className='website--intro--title myfont'>Portfolio:</h1>
                    <div className='website--intro--content'>
                            <p>The website includes a portfolio section that showcases my projects. Each project includes a description, technologies used, and a link to the live demo or source code.</p>
                            <br />
                    </div>
            </div>

            <div className='website--flexbar'>
                <h2>WebLLM Implementation</h2>
                <div className='website--flexbox'>
                    <div className='website--box website--box-red'>
                        <h3>Itializing WebLLM API</h3>
                        <p>Implemented WebLLM which WebLLM enables running <strong>large language models (LLMs)</strong>
                            directly in web browsers using <strong>WebGPU</strong> for hardware-accelerated computations. 
                            It performs text generation <strong>locally on the user's device</strong>, ensuring privacy and 
                            offline access without server dependencies. Optimized for browser constraints, 
                            it provides seamless and <strong>accessible AI interactions.</strong></p>
                    </div>
                    <div className='website--box website--box-green'>
                        <h3>Training Llama 3.2 Personal Model</h3>
                        <p>Trained a custom Llam 3.2 Instruct 3B model which is specalized on the  
                            <a href='https://huggingface.co/datasets/theatticusproject/cuad-qa'> CUDA</a> dataset.
                            This prototype model is a proof of concept that shows my skills in understanding, training, implementing,
                            and deploying personalized fine-tuned Llama models. Looking forward to implenting a multi-modal model soon.</p>
                        
                    </div>
                    <div className='website--box website--box-blue'>
                        <h3>AI Chatbot</h3>
                        <p>Implemented a chatbot that uses the Llama 3.2 3B model to generate responses to user input.
                            The chatbot can answer questions, provide information, and engage in conversation with users.
                            It is designed to be user-friendly and accessible, with a clean and modern interface.
                            This chatbot is a proof of concept that shows my skills in machine learning and natural language processing.
                            
                        </p>
                    </div>
                </div>
            </div>

            <footer className="navbar-left">
                    <a href="#head" style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default Website