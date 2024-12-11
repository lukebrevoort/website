import React from "react"
import Contact from "./main-components/Contact"
import Project from "./main-components/Project"
import Blog from "./main-components/Blog"
import "./Main.css"
import { SpeedInsights } from "@vercel/speed-insights/react"


export default function Main() {
    return (
        <body>
            <SpeedInsights />
            <h1 class="header">Hey, I'm Luke!</h1>
            <p>I am a freshman at Stevens Institute of Technology in Hoboken NJ who is studying  
                <span className="p-bold"> Computer Science!</span> I am passionate about <span className="p-bold">AI and Fullstack Development.</span>
            </p>

            <br /><p>I enjoy <span className="p-bold">Climbing, Hiking, Weightlifting, and Lacrosse</span>, so really anything active :)</p>

            <br /><p>I also really enjoy exploring <span className="p-bold">NYC</span> and <span className="p-bold">love spending time with my friends!</span></p><br />

            <div className='title'>
                <div className='title--number'>01.</div>
                <div className='title--content'>projects</div>
            </div>


            <div className='project'>
                <Project img="./images/sentiment.jpg" title="Sentiment Analysis Project" desc="ChatGPT-API Python"/>
                <Project  img="./images/website.png" title="Personal Website" desc="UI Design WebLLM"/>
                <Project img="./images/sql.jpg" title="Football SQL" desc="SQL mySQL"/>
                <Project img="./images/calc.png" title="GO Calculator" desc="GOlang React"/>
            </div>

            <Blog />

            <Contact />

        </body>
    )
}