import { projects } from "../data";
import Reveal from "./Reveal";
import "../styles/Projects.css";

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <Reveal>
          <h2 className="projects__heading">My projects</h2>
        </Reveal>

        <div className="projects__list">
          {projects.map((p, i) => {
            const image = (
              <>
                <img
                  src={p.image}
                  alt={p.title}
                  className="projects__img"
                  loading="lazy"
                />
                {p.status && (
                  <span className="projects__badge">{p.status}</span>
                )}
              </>
            );

            return (
              <article key={i} className="projects__card">
                {p.link ? (
                  <a
                    href={p.link}
                    className="projects__img-wrap"
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {image}
                  </a>
                ) : (
                  <div className="projects__img-wrap">{image}</div>
                )}

                <div className="projects__body">
                  <h3 className="projects__title">{p.title}</h3>
                  {p.did && <p className="projects__did">{p.did}</p>}

                  {p.link ? (
                    <a
                      href={p.link}
                      className="projects__btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>View project</span>
                      <span className="projects__btn-icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 17L17 7" />
                          <path d="M8 7h9v9" />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    <span className="projects__btn projects__btn--disabled">
                      Coming soon
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}