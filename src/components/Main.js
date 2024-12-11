import React from "react"
import Contact from "./main-components.js/Contact"
import Projects from "./main-components.js/Projects"
import Blog from "./main-components.js/Blog"
import "./Main.css"


export default function Main() {
    return (
        <body>
            <h1 class="header">Hey, I'm Luke!</h1>
            <p>I am a freshman at Stevens Institute of Technology in Hoboken NJ who is studying  
                <span className="p-bold"> Computer Science!</span> I am passionate about <span className="p-bold">AI and Fullstack Development.</span>
            </p>

            <br /><p>I enjoy <span className="p-bold">Climbing, Hiking, Weightlifting, and Lacrosse</span>, so really anything active :)</p>

            <br /><p>I also really enjoy exploring <span className="p-bold">NYC</span> and <span className="p-bold">love spending time with my friends!</span></p><br />

            <Projects />

            <Blog />

            <Contact />

        </body>
    )
}