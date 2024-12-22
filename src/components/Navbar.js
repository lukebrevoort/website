import React from "react"
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar"
import "./Navbar.css"


export default function Navbar() {
    return (
        <div id="head">
            <header className="px-5 py-4 shadow-md flex justify-between items-center sticky top-0 z-10 bg-classicBackground scroll-smooth">
                <Sidebar />
                <div className="hidden md:flex space-x-6 font-bold text-2xl">
                    <Link
                        to="/about"
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-classicGrey py-1 px-2 hover:text-classicWhite hover:scale-105 transition-colors ease delay-3 transition-transform ease delay-3"
                    >
                        About
                    </Link>

                    <a
                        href="/#project"
                        className="text-classicGrey hover:text-classicWhite py-1 px-2 hover:scale-105 transition-colors ease delay-3 transition-transform ease delay-3"
                    >
                        Projects
                    </a>

                    <Link
                        to="/notebook"
                        className="text-classicGrey py-1 px-2 hover:text-classicWhite hover:scale-105 transition-colors ease delay-3 transition-transform ease delay-3"
                    >
                        Notebook
                    </Link>

                    <a
                        href="/#contact"
                        className="text-classicGrey py-1 px-2 hover:text-classicWhite hover:scale-105 transition-colors ease delay-3 transition-transform ease delay-3"
                    >
                        Contact
                    </a>
                </div>
            </header>
            <Outlet />
        </div>
    );
}

