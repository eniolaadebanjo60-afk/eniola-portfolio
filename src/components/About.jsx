import { profile } from "../data";
import Reveal from "./Reveal";
import "../styles/About.css";

export default function About() {
  const { heading, bio, highlights, skills } = profile.about;

  return (
    <section id="about" className="about">
      <div className="container about__grid">
        <Reveal>
          <p className="eyebrow" style={{ color: 'var(--black)' }}>
            About
          </p>
          <h2 className="about__heading">{heading}</h2>
        </Reveal>

        <div className="about__content">
          <Reveal delay={150}>
            <p className="about__bio">{bio}</p>
          </Reveal>

          {highlights && highlights.length > 0 && (
            <Reveal delay={250}>
              <ul className="about__stats">
                {highlights.map((item) => (
                  <li key={item.label} className="about__stat">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {skills && skills.length > 0 && (
            <Reveal delay={350}>
              <div>
                <p className="about__skills-title" style={{ color: 'var(--black)' }}>
                  What I work with
                </p>
                <ul className="about__chips">
                  {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}