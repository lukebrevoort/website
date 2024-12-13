import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main"
import Navbar from "./components/Navbar"
import Notebooks from "./pages/Notebooks"
import About from "./pages/About"
import Sentiment from "./pages/Sentiment";

export default function App() {
    return (
        <div id="main">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<Main />} />
                        <Route path="notebook" element={<Notebooks />} />
                        <Route path="about" element={<About />} />
                        <Route path="sentiment" element={<Sentiment />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}