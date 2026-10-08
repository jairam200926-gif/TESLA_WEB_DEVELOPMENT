import type {
  TNavLink,
  TService,
  TTechnology,
  TExperience,
  TTestimonial,
  TProject,
} from "../types";

import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  reactjs,
  tailwind,
  mongodb,
  git,
  github,
  python,
  java,
  jobit,
  threejs,
  redlineQuant,
} from "../assets";

export const navLinks: TNavLink[] = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "services",
    title: "Services",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: TService[] = [
  {
    title: "Python Development",
    icon: web,
  },
  {
    title: "Data Science",
    icon: backend,
  },
  {
    title: "AI & Intelligent Applications",
    icon: mobile,
  },
  {
    title: "Full-Stack Projects",
    icon: creator,
  },
];

const technologies: TTechnology[] = [
  {
    name: "Python",
    icon: web,
  },
  {
    name: "C",
    icon: backend,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "HTML",
    icon: web,
  },
  {
    name: "CSS",
    icon: tailwind,
  },
  {
    name: "React",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "FastAPI",
    icon: creator,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Pandas",
    icon: mobile,
  },
  {
    name: "NumPy",
    icon: web,
  },
  {
    name: "Matplotlib",
    icon: mobile,
  },
  {
    name: "AI APIs",
    icon: creator,
  },
  {
    name: "Data Science",
    icon: threejs,
  },
  {
    name: "AI",
    icon: creator,
  },
  {
    name: "Git",
    icon: git,
  },
  {
    name: "GitHub",
    icon: github,
  },
  {
    name: "Streamlit",
    icon: web,
  },
  {
    name: "VS Code",
    icon: creator,
  },
  {
    name: "Jupyter Notebook",
    icon: python,
  },
];

const experiences: TExperience[] = [
  {
    title: "Integrated M.Sc. Data Science",
    companyName: "VIT Vellore",
    icon: java,
    iconBg: "#111111",
    date: "2026 – Present",
    points: [
      "Enrolled in the Integrated M.Sc. Data Science programme at Vellore Institute of Technology.",
      "Focusing on Machine Learning, Deep Learning, Financial Analytics, Python Ecosystem, and Software Engineering.",
      "Actively building web applications, data-driven platforms, and AI-powered solutions.",
    ],
  },
];

const testimonials: TTestimonial[] = [
  {
    testimonial:
      "Jai's work on financial analytics tools demonstrates strong quantitative and engineering abilities.",
    name: "VINHACK Jury",
    designation: "Hackathon Evaluation",
    company: "VIT Vellore",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const projects: TProject[] = [
  {
    name: "Redline Quant",
    subtitle: "AI-Powered Stock Analysis Platform",
    description: "A stock-analysis application designed to make market data easier to understand.",
    featureLabel: "Features",
    features: ["Stock search", "Historical market data", "Candlestick charts", "20/50 SMA analysis", "Volume analysis", "RSI", "Monthly performance", "Yearly performance", "Excel report generation"],
    stack: ["Python", "Pandas", "yFinance", "Streamlit", "FastAPI", "Excel"],
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "pandas",
        color: "green-text-gradient",
      },
      {
        name: "yfinance",
        color: "pink-text-gradient",
      },
      {
        name: "fastapi",
        color: "blue-text-gradient",
      },
      {
        name: "streamlit",
        color: "green-text-gradient",
      },
    ],
    image: redlineQuant,
    sourceCodeLink: "https://github.com/jairam200926-gif/REDLINE-QUANT-",
    liveLink: "https://redline-quant-1.onrender.com/",
  },
  {
    name: "GigShield",
    subtitle: "Financial Safety Platform for Gig Workers",
    description: "A fintech prototype designed to provide gig workers with access to purpose-bound emergency financial support. The platform combines trust scoring, emergency funds, QR-based merchant validation, and digital payments into one system.",
    featureLabel: "Features",
    features: ["Gig-worker dashboard", "Trust score", "Emergency fund", "Merchant QR validation", "MCC-based spending validation", "Purpose-bound funds", "MongoDB integration"],
    stack: ["React", "Tailwind CSS", "MongoDB", "JavaScript"],
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "qr-integration",
        color: "blue-text-gradient",
      },
    ],
    image: jobit,
    sourceCodeLink: "https://github.com/jairam200926-gif/GigShield01",
  },
  {
    name: "Xendra",
    subtitle: "Personal AI Voice Assistant",
    description: "An experimental AI voice assistant designed to interact naturally with users and perform useful everyday tasks.",
    featureLabel: "Exploring",
    features: ["Voice interaction", "AI conversations", "Wake-word concepts", "Study assistance", "Personal commands", "Automation"],
    stack: ["Python", "AI APIs", "LiveKit"],
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "ai-apis",
        color: "pink-text-gradient",
      },
      {
        name: "livekit",
        color: "green-text-gradient",
      },
    ],
    image: threejs,
    sourceCodeLink: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };
