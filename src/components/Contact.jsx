import { FaGithub, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { profile } from "../data";
import Reveal from "./Reveal";
import "../styles/Contact.css";

export default function Contact() {
  const { github, email, whatsapp } = profile.socials;

  const links = [
    {
      name: "GitHub",
      detail: "See my code",
      href: github,
      Icon: FaGithub,
      color: "#24292f",
      external: true,
    },
    {
      name: "Gmail",
      detail: email,
      href: `mailto:${email}?subject=${encodeURIComponent("Project enquiry")}`,
      Icon: SiGmail,
      color: "#ea4335",
      external: false,
    },
    whatsapp && {
      name: "WhatsApp",
      detail: "Chat with me",
      href: `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi, I saw your portfolio and I'd like to talk about a project.")}`,
      Icon: FaWhatsapp,
      color: "#25d366",
      external: true,
    },
  ].filter(Boolean);

  return (
    <section id="contact" className="contact">
      <div className="container contact__inner">
        <Reveal>
          <h2 className="contact__title">Let's build something.</h2>
          <p className="contact__sub">
            Have a project in mind or just want to say hi? Pick the way that is easiest for you.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="contact__links">
            {links.map(({ name, detail, href, Icon, color, external }) => (
              <a
                key={name}
                href={href}
                className="contact__card"
                style={{ "--brand": color }}
                aria-label={`${name}: ${detail}`}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <span className="contact__icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="contact__text">
                  <span className="contact__name">{name}</span>
                  <span className="contact__detail">{detail}</span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}