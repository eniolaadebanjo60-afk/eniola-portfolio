import { profile } from "../data";
import "../styles/Footer.css";

export default function Footer() {
  const { github, email, whatsapp } = profile.socials;

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <div className="footer__links">
          <a href={github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={`mailto:${email}`}>Email</a>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}