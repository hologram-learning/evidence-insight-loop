import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PILOT_CONTENT } from "@/data/pilotContent";

const NAV = [
  { to: "/product", label: "Product" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/pilot-launch", label: "Pilot launch" },
  { to: "/research", label: "Research" },
  { to: "/security", label: "Data governance" },
  { to: "/faq", label: "FAQ" },
] as const;

const FOOTER = [
  { to: "/product", label: "Product" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/pilot-launch", label: "Pilot launch" },
  { to: "/research", label: "Research" },
  { to: "/security", label: "Data governance" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Request pilot access" },
  { to: "/launch", label: "Open the workspace" },
] as const;

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="wordmark" aria-label="Hologram Learning — home">
            <span className="wordmark__mark" aria-hidden="true" />
            <span>
              Hologram<span className="wordmark__thin"> Learning</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="site-nav__link"
                activeProps={{ "data-active": "true" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="site-header__actions">
            <Link to="/launch" className="holo-btn holo-btn--ghost holo-btn--sm">
              Open workspace
            </Link>
            <Link to="/contact" className="holo-btn holo-btn--primary holo-btn--sm">
              {PILOT_CONTENT.primaryCta}
            </Link>
          </div>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <span className="wordmark">
              <span className="wordmark__mark" aria-hidden="true" />
              <span>
                Hologram<span className="wordmark__thin"> Learning</span>
              </span>
            </span>
            <p className="site-footer__note">{PILOT_CONTENT.qualifiedPositioning}</p>
            <p className="site-footer__note">{PILOT_CONTENT.demoNotice}</p>
          </div>
          <nav className="site-footer__links" aria-label="Footer">
            {FOOTER.map((item) => (
              <Link key={item.to} to={item.to} className="site-footer__link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="site-footer__legal">
          © {PILOT_CONTENT.copyrightYear} Hologram Learning. Pilot evaluation materials. All figures
          and student records shown anywhere in this product are illustrative demo data.
        </p>
      </footer>
    </div>
  );
}
