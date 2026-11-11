import { profile } from "../data";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <div className="footer__links">
          <a href={profile.socials.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={`mailto:${profile.socials.email}`}>Email</a>
        </div>
      </div>
    </footer>
  );
}