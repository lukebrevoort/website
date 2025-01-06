import React, { forwardRef } from "react";
import { Outlet, Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Sidebar from "./Sidebar";
import "./Navbar.css";

const MyLink = forwardRef((props, ref) => {
    let { href, children, onClick } = props
    return (
      href.includes('#') ? (
        <HashLink 
          smooth
          to={href} 
          ref={ref} 
          onClick={onClick}
          className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-white/10"
        >
          {children}
        </HashLink>
      ) : (
        <Link 
          to={href} 
          ref={ref} 
          onClick={onClick}
          className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-white/10"
        >
          {children}
        </Link>
      )
    )
})

const DropDown = () => {
    return (
        <Menu as="div" unmount>
            <MenuButton>
                <img src="./images/menuDrop.png" alt="dropdown" className="w-12 h-auto hover:scale-105 transition-transform duration-300 ease cursor-pointer md:hidden" />
            </MenuButton>
            <MenuItems           
                transition
                anchor="bottom end"
                className="w-52 origin-top-right z-50 rounded-xl border border-white/5 bg-white/5 p-1 mt-5 text-lg text-white transition-all duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none enter:opacity-100 enter:scale-100 leave:opacity-0 leave:scale-95 absolute"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
                <MenuItem>
                    {({ close }) => (
                        <MyLink href="/about" onClick={() => {
                            window.scrollTo(0, 0);
                            close();
                        }}>
                            About
                        </MyLink>
                    )}
                </MenuItem>
                <MenuItem>
                    {({ close }) => (
                        <MyLink href="/#project" onClick={() => close()}>
                            Projects
                        </MyLink>
                    )}
                </MenuItem>
                <MenuItem>
                    {({ close }) => (
                        <MyLink href="/#contact" onClick={() => close()}>
                            Contact
                        </MyLink>
                    )}
                </MenuItem>
            </MenuItems>
        </Menu>
    );
};

function Navbar() {
    return (
        <div id="head">
            <header className="px-5 py-4 h-32 shadow-md flex justify-between items-center sticky top-0 z-10 bg-classicBackground scroll-smooth">
                <Sidebar />
                <div className="block md:hidden">
                    <DropDown />
                </div>
                <div className="hidden md:flex md:space-x-6 md:font-bold md:text-2xl">
                    <Link
                        to="/about"
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-classicGrey py-1 px-2 hover:text-classicWhite hover:scale-105 transition-colors ease delay-3 transition-transform ease delay-3"
                    >
                        About
                    </Link>
                    <HashLink
                        smooth
                        to="/#project"
                        className="text-classicGrey hover:text-classicWhite py-1 px-2 hover:scale-105 transition-colors ease delay-3 transition-transform ease delay-3"
                    >
                        Projects
                    </HashLink>
                    <HashLink
                        smooth
                        to="/#contact"
                        className="text-classicGrey py-1 px-2 hover:text-classicWhite hover:scale-105 transition-colors ease delay-3 transition-transform ease delay-3"
                    >
                        Contact
                    </HashLink>
                </div>
            </header>
            <Outlet />
        </div>
    );
}

export default Navbar;

