import React from "react"
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Main from "./components/Main"
import Navbar from "./components/Navbar"
import Notebook from "./pages/Notebook"
import Traveling from "./pages/Traveling" 
import Lifting from "./pages/Lifting"
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<Main />} />
                        <SpeedInsights />
                        <Route path="notebook" element={<Notebook />} />
                        <Route path="traveling" element={<Traveling />} />
                        <Route path="lifting" element={<Lifting />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}