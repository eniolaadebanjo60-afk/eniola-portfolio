import PAA from "./assets/PAA.png";

export const profile = {
  name: "Oluwagbemi Eniola Isaac",
  role: "Frontend Developer",
  greeting: "Hello! I Am",
  headline: ["A Frontend Developer", "who builds things", "people love to use..."],
  subline: "Because if the experience doesn't feel right, nothing else matters.",
  about: {
    heading: "I build things for the web.",
    bio: "I'm a self-taught frontend developer building responsive, accessible websites and web apps with React. I focus on clean interfaces and experiences that feel right to use.",
    highlights: [
      { value: "React", label: "Main stack" },
      { value: "2+", label: "Projects live" },
      { value: "100%", label: "Self-taught" },
    ],
    skills: [
      "React",
      "JavaScript",
      "HTML & CSS",
      "Vite",
      "Git & GitHub",
      "Responsive design",
      "Accessibility",
    ],
  },
  socials: {
    github: "https://github.com/eniolaadebanjo60-afk",
    email: "eniolaadebanjo60@gmail.com",
    whatsapp: "2348123250404",
  },
};

export const projects = [
  {
    title: "Website One — Premier Agribusiness Academy",
    description: "A website for a company that runs training for agribusiness companies. Built with React, CSS, and Vite.",
    image: PAA,
    link: "https://premieragribusiness.vercel.app/",
  },
  {
    title: "Website Two — AFSH",
    description: "A company website for Amo Farm Sieberer Hatchery Ltd. (AFSH). Built with React.",
    image: "/images/project2.png",
    link: "https://amofarms-react.vercel.app/",
  },
];

export const building = [
  {
    title: "Web App — In Progress",
    description: "A web app I'm currently building. [What it does in one line].",
    status: "In progress",
    progress: 60,
    tags: ["React", "Vite", "Supabase"],
    tasks: [
      { label: "Login and signup", done: true },
      { label: "Dashboard page", done: true },
      { label: "Payments", done: false },
    ],
    link: "https://github.com/yourusername/repo",
  },
];