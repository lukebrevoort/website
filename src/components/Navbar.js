import React from "react"
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar"
import "./Navbar.css"


export default function Navbar() {
    return (
        <div>
            <header className="navBar-main">
                <Sidebar />
                <div className="navBar-right">
                    <a href="#">About</a>
                    <a href="#">Projects</a>
                    <Link to="/notebook" className='sidenav--content'>Notebook</Link>
                    <a href="#">Contact</a>
                </div>
            </header>
            <Outlet />
        </div>
    )
}

