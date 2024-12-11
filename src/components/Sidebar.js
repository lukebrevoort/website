import React from 'react'
import { Link } from "react-router-dom";

function Sidebar() {

    const [isOpen, setisOpen] = React.useState(false)

    function openNav() {
        setisOpen(true)
        document.getElementById("mySidenav").style.width = "100%";
        document.getElementById("main").style.marginLeft = "0";
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
            <img src='./images/close.png' onClick={closeNav} className='sidenav--closebtn'/>
            <h1>Super cool stuff to come!</h1>
        </div>






        <nav className="navBar-left"> 
            <div className="navBar-left-image" id="mySidenav">
                <img src="./images/dropDown.png" onClick={openNav}/>
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