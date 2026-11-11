import { building } from "../data";
import Reveal from "./Reveal";
import "../styles/Building.css";

export default function Building() {
  return (
    <section id="building" className="experience">
      <div className="container">
        <Reveal>
          <h2 className="experience__title">Currently Building</h2>
        </Reveal>

        <div className="experience__list">
          {building.map((item, i) => {
            const hasProgress = typeof item.progress === "number";
            const hasTasks = Array.isArray(item.tasks) && item.tasks.length > 0;

            return (
              <Reveal key={i} delay={i * 100}>
                <article className="experience__card">
                  <div className="experience__main">
                    <span className="experience__status">
                      <span className="experience__dot" />
                      {item.status || "In progress"}
                    </span>
                    <h3 className="experience__item-title">{item.title}</h3>
                    <p className="experience__desc">{item.description}</p>

                    {item.tags && item.tags.length > 0 && (
                      <ul className="experience__tags">
                        {item.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        className="experience__link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Follow the progress
                      </a>
                    )}
                  </div>

                  {(hasProgress || hasTasks) && (
                    <aside className="experience__side">
                      {hasProgress && (
                        <div>
                          <div className="experience__progress-top">
                            <span>Progress</span>
                            <strong>{item.progress}%</strong>
                          </div>
                          <div className="experience__bar">
                            <span style={{ "--progress": `${item.progress}%` }} />
                          </div>
                        </div>
                      )}

                      {hasTasks && (
                        <ul className="experience__tasks">
                          {item.tasks.map((task) => (
                            <li
                              key={task.label}
                              className={task.done ? "is-done" : ""}
                            >
                              <span className="experience__check" />
                              {task.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </aside>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}