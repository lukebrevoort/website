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
            <h1 class="header myfont header--underline">Luke is a student from Stevens who likes to code</h1>

            <div className='title' id="project">
                <div className='title--number'>01. </div>
                <div className='title--content'> projects</div>
            </div>

            <div className='project'>
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

            <div className='title' id="contact">
                <div className='title--number'>02. </div>
                <div className='title--content'> notebooks</div>
            </div>  

            <Notebook />  

            <div className='title'>
                <div className='title--number'>03. </div>
                <div className='title--content'> contact</div>
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