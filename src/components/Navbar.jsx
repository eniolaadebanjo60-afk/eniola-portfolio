import { useState, useEffect } from "react";
import { profile } from "../data";
import "../styles/Navbar.css";

const sections = ["about", "building", "projects", "contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="navbar">
      <nav className="container navbar__inner">
        <a href="#" className="navbar__logo" onClick={() => setOpen(false)}>
          {profile.name}
        </a>

        <ul className={`navbar__links ${open ? "navbar__links--open" : ""}`}>
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <a href={`mailto:${profile.socials.email}`} className="navbar__cta">
          Hire me
        </a>

        <button
          className={`navbar__toggle ${open ? "navbar__toggle--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}