import { useEffect, useState } from "react";
import { profile } from "../data";
import "../styles/Hero.css";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useTyping(text, delay, speed) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(text.length);
      return undefined;
    }

    let id;
    const start = setTimeout(() => {
      id = setInterval(() => {
        setCount((c) => {
          if (c + 1 >= text.length) clearInterval(id);
          return Math.min(c + 1, text.length);
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [text, delay, speed]);

  return text.slice(0, count);
}

export default function Hero() {
  const [line1, line2, line3] = profile.headline;
  const typed = useTyping(line3, 1400, 45);
  const skills = profile.about.skills || [];
  const loop = skills.length ? [...skills, ...skills, ...skills, ...skills] : [];

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section className="hero" onPointerMove={handleMove}>
      <div className="container hero__inner">
        <div className="hero__meta">
          <div className="hero__greeting">
            <p className="hero__hello">{profile.greeting}</p>
            <p className="hero__name">{profile.name}</p>
          </div>

          <span className="hero__status">
            <span className="hero__dot" />
            Available for work
          </span>
        </div>

        <h1 className="hero__title" aria-label={profile.headline.join(" ")}>
          <span className="hero__line hero__line--soft" aria-hidden="true">
            <span style={{ "--d": "0.25s" }}>{line1}</span>
          </span>
          <span className="hero__line" aria-hidden="true">
            <span className="hero__hl">{line2}</span>
          </span>
          <span className="hero__line hero__line--soft" aria-hidden="true">
            <span className="hero__type" style={{ "--d": "0.55s" }}>
              <span className="hero__ghost">{line3}</span>
              <span>
                {typed}
                <i className="hero__caret" />
              </span>
            </span>
          </span>
        </h1>

        <div className="hero__foot">
          <p className="hero__subline">{profile.subline}</p>
          <div className="hero__actions">
            <a href="#projects" className="btn btn--primary">
              View work
            </a>
            <a href={`mailto:${profile.socials.email}`} className="btn btn--ghost">
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {loop.length > 0 && (
        <div className="hero__marquee" aria-hidden="true">
          <div className="hero__track">
            {loop.map((skill, i) => (
              <span key={i}>{skill}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}