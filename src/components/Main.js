import React from "react"
import Contact from "./main-components/Contact"
import Project from "./main-components/Project"
import Notebook from "./main-components/Notebook"
import "./Main.css"
import { Link } from "react-router-dom"
import { SpeedInsights } from "@vercel/speed-insights/react"


export default function Main() {
    return (
        <div>
            <SpeedInsights />
            <h1 className="text-7xl flex justify-center items-center max-w-3xl text-classicWhite my-36 mx-10 myfont header--underline md:mx-auto">Luke is a student from Stevens who likes to code</h1>

            <div className='flex items-center p-10 gap-3 text-left max-w-3xl my-0 mx-auto font-news' id="project">
                <div className='text-lg text-lightgrey'>01. </div>
                <div className='text-3xl font-bold text-classicWhite'> projects</div>
            </div>

            <div className='flex flex-col items-center justify-center gap-8 md:grid grid-cols-2'>
                <Link to="/sentiment" onClick={() => window.scrollTo(0, 0)}>
                    <Project img="./images/sentiment.jpg" title="Sentiment Analysis Project" desc="ChatGPT-API Python"/>
                </Link>
                
                <Link to="/website" onClick={() => window.scrollTo(0, 0)}>
                    <Project  img="./images/website.png" title="Personal Website" desc="UI Design WebLLM"/>
                </Link>
                <Link to="/calculator" onClick={() => window.scrollTo(0, 0)}>
                    <Project img="./images/calc.png" title="GO Calculator" desc="GOlang React"/>
                </Link>
                <Project img="./images/sql.jpg" title="Football SQL" desc="SQL mySQL"/>
            </div>

            <div className='flex items-center p-10 gap-3 text-left max-w-3xl my-0 mx-auto font-news' id="contact">
                <div className='text-lg text-lightgrey'>02. </div>
                <div className='text-3xl font-bold text-classicWhite'> notebooks</div>
            </div>  

            <Notebook />  

            <div className='flex items-center p-10 gap-3 text-left max-w-3xl my-0 mx-auto font-news'>
                <div className='text-lg text-lightgrey'>03. </div>
                <div className='text-3xl font-bold text-classicWhite'> contact</div>
            </div>

            <Contact />

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