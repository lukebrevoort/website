import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main"
import Navbar from "./components/Navbar"
import Notebook from "./pages/Notebook"

export default function App() {
    return (
        <div id="main">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<Main />} />
                        <Route path="notebook" element={<Notebook />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}