import React from "react"
import Contact from "./main-components/Contact"
import Project from "./main-components/Project"
import Notebook from "./main-components/Notebook"
import "./Main.css"
import { SpeedInsights } from "@vercel/speed-insights/react"


export default function Main() {
    return (
        <div>
            <SpeedInsights />
            <h1 class="header myfont">Luke is a student from Stevens who likes to code</h1>

            <div className='title'>
                <div className='title--number'>01. </div>
                <div className='title--content'> projects</div>
            </div>

            <div className='project'>
                <Project img="./images/sentiment.jpg" title="Sentiment Analysis Project" desc="ChatGPT-API Python"/>
                <Project  img="./images/website.png" title="Personal Website" desc="UI Design WebLLM"/>
                <Project img="./images/sql.jpg" title="Football SQL" desc="SQL mySQL"/>
                <Project img="./images/calc.png" title="GO Calculator" desc="GOlang React"/>
            </div>

            <div className='title'>
                <div className='title--number'>02. </div>
                <div className='title--content'> notebooks</div>
            </div>    

            <div className='title'>
                <div className='title--number'>03. </div>
                <div className='title--content'> contact</div>
            </div>

            <Contact />

        </div>
    )
}