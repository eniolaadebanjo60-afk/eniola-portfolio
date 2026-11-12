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
      { value: "2", label: "Live projects" },
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
    did: "Built the full site in React and Vite, including the programmes and testimonials pages.",
    image: PAA,
    link: "https://premieragribusiness.vercel.app/",
  },
  {
    title: "Website Two — AFSH",
    description: "A company website for Amo Farm Sieberer Hatchery Ltd. (AFSH). Built with React.",
    did: "Built the whole site as the company's in-house frontend developer.",
    image: "/images/project2.png",
    link: "https://amofarms-react.vercel.app/",
  },
];

export const building = [
  {
    title: "Exam App — In Progress",
    description: "An exam app I'm currently building with React and Vite.",
    status: "In progress",
    tags: ["React", "Vite"],
  },
];