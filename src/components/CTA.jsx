import { profile } from "../data";
import Reveal from "./Reveal";
import "../styles/CTA.css";

export default function CTA() {
  return (
    <section className="cta">
      <div className="container">
        <Reveal>
          <div className="cta__card">
            <span className="cta__status">
              <span className="cta__dot" />
              Open to opportunities
            </span>

            <p className="cta__text">
              I'm currently looking to join a cross-functional team that values
              improving people's lives through{" "}
              <span className="accent">accessible design</span>.
            </p>

            <div className="cta__actions">
              <a
                href={`mailto:${profile.socials.email}`}
                className="btn cta__btn cta__btn--solid"
              >
                Get in touch
              </a>
              <a href="#projects" className="btn cta__btn cta__btn--ghost">
                See my work
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}