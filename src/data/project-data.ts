interface Skill {
  name: string;
  details: string;
}

interface IntroSection {
  title: string;
  content: string;
  content2?: string;
  image?: string;
  color?: string;
}

interface FlexBoxItem {
  title: string;
  content: string;
  color: string;
}

interface ProjectData {
  title: string;
  description: string;
  skills: Skill[];
  image: string;
  link: string;
  color: string;
  intros: IntroSection[];
  flexbar: {
    boxes: FlexBoxItem[];
  };
  repo: string;
}

export const projects: ProjectData[] = [
  {
    title: "Sentiment Analysis",
    description: "A project that performs sentiment analysis on text data.",
    skills: [
      { name: "Lanuage", details: "Python" },
      { name: "API", details: "ChatGPT and GoogleSearch" },
      { name: "HTML Parsing", details: "Beautiful Soups 4" },
      { name: "Date", details: "2024" }
    ],
    image: "/images/stockmarket.png",
    link: "/sentiment",
    color: "green",
    intros: [
      {
        title: "Intro:",
        content: "I wanted to start investing in stocks but didn't know which ones to buy. So I created a program to tell me which stocks were good or bad based off of website sentiment analysis.\nHere is how the program worked:",
      },
      {
        title: "The Idea:",
        content: "The idea was to take in a .csv and sort through alphebetically to find which stock the user was interested in; this goes through a validate function which checks first if the stock is in the .csv and second scans to find the selected stock.",
        image: "/images/stocksImagePage.jpg",
        color: "green"
      },
      {
        title: "Google Search and Parse:",
        content: "The program would then take the stock name and search for it on Google. It would then take the first 5 search results and run them through ChatGPT to generate a sentiment score. The program would then average the sentiment scores to determine if the stock was good or bad.",
        image: "/images/google.webp"
      },
      {
        title: "ChatGPT Integration:",
        content: "Then after it completes we stop the completed file at the max number of tokens that can go through a ChatGPT query. At this point when this project was made the max tokens was 15500.",
        content2: "ChatGPT is then given a specific prompt to try and reduce temperature of responses and ensure the most consistent results possible. This prompt engineering was made possible through googles resources and went through multiple iterations to ensure accuracy.",
        image: "/images/chat.webp",
        color: "red"
      },
      {
        title: "The Results:",
        content: "Input the symbolic repersentation of any Fortune 500 Company you are considering to invest in: AAPL",
        content2: "Sentiment Analysis: Based on the provided context, Apple Inc. is a strong choice of investment because:",
        image: "/images/apple.webp"
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
  },
  {
    title: "Personal Website",
    description: "A personal website built with React and NextJS featuring an integrated blog system with automated Notion-to-website publishing workflow.",
    skills: [
      { name: "Language", details: "JavaScript, HTML, CSS" },
      { name: "Framework", details: "React, NextJS" },
      { name: "Integration", details: "Notion API, GitHub Actions" },
      { name: "Model", details: "WebLLM & Llama 3.2" },
      { name: "Date", details: "2024" }
    ],
    image: "/images/websiteimg.png",
    link: "/website",
    color: "purple",
    intros: [
      {
        title: "Intro:",
        content: "This project is a personal website built using React and NextJS. It showcases my portfolio and provides information about my skills and projects. You would know since you are on it right now! \nHere is how the website works:",
      },
      {
        title: "Development:",
        content: "The website is built using React and NextJS, a popular JavaScript library for building user interfaces. React allows for the creation of reusable components, making the development process more efficient. The website is also optimized for performance and SEO using built in Vercel tools.",
        image: "/images/reactLogo.png"
      },
      {
        title: "Design:",
        content: "The design of the website is clean and modern, with a focus on usability and accessibility. It includes a responsive layout that works well on both desktop and mobile devices. Incuded components from ShadCN/UI and Radix UI for simplicity on the frontend. These components give the website a professional look and feel.",
        image: "/images/websiteDesign.png",
        color: "green"
      },
      {
        title: "Styling:",
        content: "The styling of the website is done using Tailwind CSS. Custom styles are applied to ensure a consistent look and feel across all pages. A modern approach to reduce CSS bloat and improve performance on the frontend. It also allows me to implement custom themes and styles easily.",
        image: "/images/cssLogo.png",
        color: "red"
      },
      {
        title: "Blog Integration:",
        content: "Implemented an automated blog publishing system that connects Notion to my website. When I publish a post in Notion, a webhook triggers a process that converts the Notion content to Markdown, generates a static React component, and deploys the new content via GitHub Actions and Vercel—all without manual intervention.",
        image: "/images/notion-blog.png",
        color: "blue"
      },
      {
        title: "Portfolio:",
        content: "The website includes a portfolio section that showcases my projects. Each project includes a description, technologies used, and a link to the live demo or source code. This section is designed to highlight my skills and experience in web development and other aspects of computer science.",
        image: "/images/portfolio.png"
      },
      {
        title: "Documentation and Models:",
        content: "I have also started to experiment more with LLM's and decided to add a WebLLM integration into the website. This allows me to run Llama 3.2 models directly in the browser and generate responses to user input. This is a proof of concept that shows my skills in machine learning and natural language processing.",
        content2: "I have also added a documentation section that provides information about the website and its features. This section includes a guide on how to use the website and its features, as well as information about the technologies used to build it. Here is a creative common photo of a llama I found on the internet :)",
        color: "blue",
        image: "/images/llama-photo.jpg"
      }
    ],
    flexbar: {
      boxes: [
        {
          title: "Automated Content Pipeline",
          content: "Developed a seamless content publishing workflow that connects Notion as a CMS to my website. The system uses Notion webhooks to detect new posts, converts them to Markdown, generates React components, and triggers GitHub Actions for deployment—creating a fully automated publishing process.",
          color: "purple"
        },
        {
          title: "WebLLM Implementation",
          content: "Implemented WebLLM which enables running large language models (LLMs) directly in web browsers using WebGPU for hardware-accelerated computations. It performs text generation locally on the user's device, ensuring privacy and offline access without server dependencies. Optimized for browser constraints, it provides seamless and accessible AI interactions.",
          color: "red"
        },
        {
          title: "Training Llama 3.2 Personal Model",
          content: "Trained a custom Llama 3.2 Instruct 3B model which is specialized on a Leetcode dataset I found on HuggingFace. This prototype model is a proof of concept that shows my skills in understanding, training, implementing, and deploying personalized fine-tuned Llama models. Looking forward to implementing a multi-modal model soon.",
          color: "green"
        }
      ]
    },
    repo: "https://github.com/lukebrevoort/website"
  },
{
    title: "Canvas to Notion Sync",
    description: "An automated system that syncs Canvas assignments to a Notion database, providing real-time academic task management with automatic updates every 15 minutes.",
    skills: [
      { name: "Language", details: "Python 3.8+" },
      { name: "APIs", details: "Canvas API, Notion API" },
      { name: "Automation", details: "launchctl, cron" },
      { name: "Database", details: "Notion DB" },
      { name: "System", details: "macOS" }
    ],
    image: "/images/canvasNotion.png",
    link: "/canvas-notion",
    color: "blue",
    intros: [
      {
        title: "Overview",
        content: "Built as a solution for streamlined academic task management, this automated system creates a bridge between Canvas LMS and Notion. It continuously monitors Canvas for new assignments and updates, maintaining a comprehensive database in Notion that serves as a central hub for academic planning.",
        color: "blue"
      },
      {
        title: "Technical Architecture",
        content: "Leveraging Python 3.8+ and RESTful APIs, the system implements a robust integration between Canvas and Notion. It uses macOS's launchctl for persistent background operation, with automated startup and failure recovery. The application maintains detailed logs and implements comprehensive error handling for reliable 24/7 operation.",
        image: "/images/notion.jpg",
        color: "green"
      },
      {
        title: "Implementation Details",
        content: "The core synchronization service runs every 15 minutes through launchctl automation. It maintains state between runs, efficiently detecting and syncing only changed assignments. The system uses environment variables for secure credential management and implements rate limiting to respect API constraints.",
        color: "blue"
      },
      {
        title: "Documentation",
        content: "Comprehensive documentation includes detailed setup instructions, environment configuration guides, and troubleshooting steps. The system's logs are stored in the standardized location at ~/Library/Logs/assignmentTracker/sync.log, making monitoring and debugging straightforward.",
        color: "red"
      }
    ],
    flexbar: {
      boxes: [
        {
          title: "Automated Sync Engine",
          content: "Implements a sophisticated synchronization engine that runs every 15 minutes, detecting new assignments, updates, and deletions in Canvas and reflecting them in Notion. Includes smart conflict resolution and change tracking.",
          color: "blue"
        },
        {
          title: "Robust Data Management",
          content: "Maintains comprehensive assignment data including due dates, course information, descriptions, submission status, and priority levels. Implements efficient data storage and retrieval with proper error handling and validation.",
          color: "green"
        },
        {
          title: "System Integration",
          content: "Seamlessly integrates with macOS through launchctl for automated startup and operation. Features automatic restart capabilities, detailed logging, and proper system resource management.",
          color: "red"
        }
      ]
    },
    repo: "https://github.com/lukebrevoort/assignmentTracker"
},

  {
    title: "Calculator",
    description: "A simple calculator built using JavaScript to perform basic arithmetic operations.",
    skills: [
      { name: "Language", details: "Go, JavaScript" },
      { name: "Framework", details: "React" },
      { name: "Documentation", details: "Python eval()" },
      { name: "Date", details: "2024" }
    ],
    image: "/images/calculator.png",
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
        image: "/images/calculatorUI.png",
        color: "yellow"
      },
      {
        title: "Go Backend:",
        content: "The backend is built using Go, which handles the evaluation of mathematical expressions using the eval() function. This ensures that the calculations are performed efficiently and accurately.",
        image: "/images/goLogo.png"
      },
      {
        title: "React Frontend:",
        content: "The frontend is built using React, providing a responsive and interactive user interface. The calculator UI is designed to be intuitive and easy to use.",
        image: "/images/reactLogo.png",
        color: "red"
      },
      {
        title: "The Result:",
        content: "Input any mathematical expression and get the result instantly. For example, 2 + 2 will give you 4.",
        image: "/images/result.png"
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
        }
      ]
    },
    repo: "https://github.com/lukebrevoort/calculator"
  }
];

export default projects;