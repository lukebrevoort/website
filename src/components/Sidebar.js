import React from 'react'
import { Link } from "react-router-dom";

function Sidebar() {

    const [isOpen, setisOpen] = React.useState(false)

    function openNav() {
        setisOpen(true)
        document.getElementById("mySidenav").style.width = "215px";
        document.getElementById("main").style.marginLeft = "140px";
      }

      function closeNav() {
        setisOpen(false)
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
      }

  return (
    <div>
        <div id="mySidenav" className='sidenav'>
            <h1 className="sidenav--title">Personal Passions</h1>
            <Link to="/notebook" className='sidenav--content'>Notebook</Link>
            <Link to="/traveling" className='sidenav--content'>Traveling</Link>
            <Link to="/lifting" className='sidenav--content'>Lifting</Link>
        </div>
        <nav className="navBar-left" id="main"> 
            <div className="navBar-left-image" id="mySidenav">
                <img src={!isOpen ? "./images/dropDown.png" : "./images/close.png"} alt="logo" onClick={isOpen ? closeNav : openNav}/>
            </div>
            <Link to="/">
                <span className="navBar-left-blue">l</span>
                <span className="navBar-left-red">u</span>
                <span className="navBar-left-purple">k</span>
                <span className="navBar-left-green">e</span>
                <span className="navBar-left-green">.</span>
                <span className="navBar-left-red">b</span>
                <span className="navBar-left-purple">r</span>
                <span className="navBar-left-green">e</span>
                <span className="navBar-left-blue">v</span>
            </Link>
        </nav>
    </div>
  )
}

export default Sidebar