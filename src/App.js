import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main"
import Navbar from "./components/Navbar"
import Notebooks from "./pages/Notebooks"
import About from "./pages/About"
import ProjectPage from "./pages/ProjectPage";

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
                image: "./images/stocksImagePage.jpg",
                color: "green"
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
                image: "./images/chat.webp",
                color: "red"
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

    const websiteProject = {
        title: "Personal Website",
        description: "A personal website built using React to showcase my portfolio and skills.",
        skills: [
            { name: "Language", details: "JavaScript, HTML, CSS" },
            { name: "Framework", details: "React" },
            { name: "Model", details: "WebLLM & Llama 3.2" },
            { name: "Date", details: "2024" }
        ],
        image: "./images/websiteimg.png",
        link: "/website",
        color: "purple",
        intros: [
            {
                title: "Intro:",
                content: "This project is a personal website built using React. It showcases my portfolio and provides information about my skills and projects."
            },
            {
                title: "Design:",
                content: "The design of the website is clean and modern, with a focus on usability and accessibility. It includes a responsive layout that works well on both desktop and mobile devices (WIP).",
                image: "./images/websiteDesign.png",
                color: "green"
            },
            {
                title: "Development:",
                content: "The website is built using React, a popular JavaScript library for building user interfaces. React allows for the creation of reusable components, making the development process more efficient.",
                image: "./images/reactLogo.png"
            },
            {
                title: "Styling:",
                content: "The styling of the website is done using CSS. Custom styles are applied to ensure a consistent look and feel across all pages.",
                image: "./images/cssLogo.png",
                color: "red"
            },
            {
                title: "Portfolio:",
                content: "The website includes a portfolio section that showcases my projects. Each project includes a description, technologies used, and a link to the live demo or source code.",
                image: "./images/portfolio.png"
            }
        ],
        flexbar: {
            boxes: [
                {
                    title: "WebLLM Implementation",
                    content: "Implemented WebLLM which enables running large language models (LLMs) directly in web browsers using WebGPU for hardware-accelerated computations. It performs text generation locally on the user's device, ensuring privacy and offline access without server dependencies. Optimized for browser constraints, it provides seamless and accessible AI interactions.",
                    color: "red"
                },
                {
                    title: "Training Llama 3.2 Personal Model",
                    content: "Trained a custom Llam 3.2 Instruct 3B model which is specialized on the CUDA dataset. This prototype model is a proof of concept that shows my skills in understanding, training, implementing, and deploying personalized fine-tuned Llama models. Looking forward to implementing a multi-modal model soon.",
                    color: "green"
                },
                {
                    title: "AI Chatbot",
                    content: "Implemented a chatbot that uses the Llama 3.2 3B model to generate responses to user input. The chatbot can answer questions, provide information, and engage in conversation with users. It is designed to be user-friendly and accessible, with a clean and modern interface. This chatbot is a proof of concept that shows my skills in machine learning and natural language processing.",
                    color: "blue"
                }
            ]
        },
        repo: "https://github.com/lukebrevoort/website"
    };

    const calculatorProject = {
        title: "Calculator",
        description: "A simple calculator built using JavaScript to perform basic arithmetic operations.",
        skills: [
            { name: "Language", details: "Go, JavaScript" },
            { name: "Framework", details: "React" },
            {name: "Documentation", details: "Python eval()" },
            { name: "Date", details: "2024" }
        ],
        image: "./images/calculator.png",
        link: "/calculator",
        color: "blue",
        intros: [
            {
                title: "Intro:",
                content: "This project is a simple calculator built using React and Go. It uses the eval() function to evaluate mathematical expressions."
            },
            {
                title: "The Idea:",
                content: "The idea was to create a user-friendly calculator that can handle basic arithmetic operations. The calculator UI is built with React, and the backend logic is handled by Go.",
                image: "../images/calculatorUI.png",
                color: "yellow"
            },
            {
                title: "Go Backend:",
                content: "The backend is built using Go, which handles the evaluation of mathematical expressions using the eval() function. This ensures that the calculations are performed efficiently and accurately.",
                image: "./images/goLogo.png"
            },
            {
                title: "React Frontend:",
                content: "The frontend is built using React, providing a responsive and interactive user interface. The calculator UI is designed to be intuitive and easy to use.",
                image: "./images/reactLogo.png",
                color: "red"
            },
            {
                title: "The Result:",
                content: "Input any mathematical expression and get the result instantly. For example, 2 + 2 will give you 4.",
                image: "./images/result.png",
            }
        ],
        flexbar: {
            boxes: [
                {
                    title: "Collaborative Frontend and Backend",
                    content: "Put Together two local servers for Go and React to communicate with each other. This was done to ensure that the frontend and backend could communicate with each other and provide a seamless user experience.",
                    color: "blue"
                },
                {
                    title: "Tokenization",
                    content: "Tokenized the operators and operands in the mathematical expression to evaluate the expression to create a pseudo eval() function. This process ensures that the expression is parsed correctly and the calculations are performed accurately.",
                    color: "green"
                },
            ]
        },
        repo: "https://github.com/lukebrevoort/calculator"
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
                        <Route path="website" element={<ProjectPage project={websiteProject} />} />
                        <Route path="calculator" element={<ProjectPage project={calculatorProject} />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}