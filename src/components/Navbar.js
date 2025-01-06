import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import Sidebar from "./Sidebar";
import "./Navbar.css";

const DropDown = ({ children, dropDownContent }) => {
    const [isOpen, setIsOpen] = useState(window.innerWidth <= 400);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth <= 400);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="relative">
            <div className="flex items-center md:hidden" onClick={toggleDropdown}>
                <div className="space-x-4">
                    {children}
                </div>
            </div>
            <Transition
                show={isOpen}
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div className="absolute right-0 top-12 mt-2 w-52 bg-classicBackground shadow-lg rounded-md py-3 px-2">
                    {dropDownContent}
                </div>
            </Transition>
        </div>
    );
};

function Navbar() {
    return (
        <div id="head">
            <header className="px-5 py-4 shadow-md flex justify-between items-center sticky top-0 z-10 bg-classicBackground scroll-smooth">
                <Sidebar />
                <DropDown
                    dropDownContent={
                        <>
                            <Link
                                to="/about"
                                onClick={() => window.scrollTo(0, 0)}
                                className="block px-4 py-2 bg-classicBackground text-classicGrey hover:text-classicWhite hover:bg-hoverGrey"
                            >
                                About
                            </Link>
                            <a
                                href="/#project"
                                className="block px-4 py-2 bg-classicBackground text-classicGrey hover:text-classicWhite hover:bg-hoverGrey"
                            >
                                Projects
                            </a>
                            <Link
                                to="/notebook"
                                className="block px-4 py-2 bg-classicBackground text-classicGrey hover:text-classicWhite hover:bg-hoverGrey"
                            >
                                Notebook
                            </Link>
                            <a
                                href="/#contact"
                                className="block px-4 py-2 bg-classicBackground text-classicGrey hover:text-classicWhite hover:bg-hoverGrey"
                            >
                                Contact
                            </a>
                        </>
                    }
                >
                    <img src="./images/menuDrop.png" alt="dropdown" className="w-12 h-auto hover:scale-105 transition-transform duration-300 ease cursor-pointer md:hidden" />
                </DropDown>
                <div className="hidden md:visible md:flex md:space-x-6 md:font-bold md:text-2xl">
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

export default Navbar;

