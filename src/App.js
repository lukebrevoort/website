import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main"
import Navbar from "./components/Navbar"
import Notebooks from "./pages/Notebooks"
import About from "./pages/About"
import ProjectPage from "./pages/ProjectPage";
import Website from "./pages/Website";
import Calculator from "./pages/Calculator";

export default function App() {
    const sentimentProject = {
        title: "Sentiment Analysis",
        description: "A project that performs sentiment analysis on text data.",
        skills: [
            { name: "Lanuage", details: "Python" },
            { name: "API", details: "ChatGPT and GoogleSearch" },
            { name: "HTML Parsing", details: "Beautiful Soups 4" },
            {name: "Date", details: "2024"}
        ],
        image: "./images/stockmarket.png",
        link: "/sentiment",
        intros: [
            {
                title: "Intro:",
                content: "I wanted to start investing in stocks but didn't know which ones to buy. So I created a program to tell me which stocks were good or bad based off of website sentiment analysis.\nHere is how the program worked:",
            },
            {
                title: "The Idea:",
                content: "The idea was to take in a .csv and sort through alphebetically to find which stock the user was interested in; this goes through a validate function which checks first if the stock is in the .csv and second scans to find the selected stock.",
                image: "./images/stocksImagePage.jpg"
            },
            {
                title: "Google Search and Parse:",
                content: "The program would then take the stock name and search for it on Google. It would then take the first 5 search results and run them through ChatGPT to generate a sentiment score. The program would then average the sentiment scores to determine if the stock was good or bad.",
                image: "./images/google.webp"
            },
            {
                title: "ChatGPT Integration:",
                content: "Then after it completes we stop the completed file at the max number of tokens that can go through a ChatGPT query. At this point when this project was made the max tokens was 15500.",
                content2: "ChatGPT is then given a specific prompt to try and reduce temperature of responses and ensure the most consistent results possible. This prompt engineering was made possible through googles resources and went through multiple iterations to ensure accuracy.",
                image: "./images/chat.webp"
            },
            {
                title: "The Results:",
                content: "Input the symbolic repersentation of any Fortune 500 Company you are considering to invest in: AAPL",
                content2:"Sentiment Analysis: Based on the provided context, Apple Inc. is a strong choice of investment because:",
                image: "./images/apple.webp"

            }
        ],
        flexbar: {
            boxes: [
                {
                    title: "Point 1",
                    content: "1. Apple's revenue is not solely dependent on one product. They have a diverse product portfolio including iPhones, iPads, Macs, wearables, and services. This reduces the risk associated with relying on a single product for revenue generation.",
                    color: "blue"
                },
                {
                    title: "Point 2",
                    content: "2. Apple has a strong track record of innovation and customer loyalty. They consistently release new and improved products, which helps maintain their market share and attract new customers. This innovation-driven approach has been a key driver of their success.",
                    color: "green"
                },
                {
                    title: "Point 3",
                    content: "3. Apple has a strong financial position. They have a significant amount of cash reserves and generate substantial free cash flow. This provides them with the ability to invest in research and development, acquisitions, and return value to shareholders through dividends and share buybacks.",
                    color: "red"
                }
            ]
        },
        repo: "https://github.com/lukebrevoort/sentimentAnalysis"
    };

    return (
        <div id="main">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<Main />} />
                        <Route path="notebook" element={<Notebooks />} />
                        <Route path="about" element={<About />} />
                        <Route path="sentiment" element={<ProjectPage project={sentimentProject} />} />
                        <Route path="website" element={<Website />} />
                        <Route path="calculator" element={<Calculator />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}