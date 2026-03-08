import { Link } from "react-router-dom";
import "./GamerVerseLogo.css";

interface GamerVerseLogoProps {
  /** Se true, renderiza como Link para "/". Caso contrário, renderiza como div. */
  asLink?: boolean;
  /** Classe CSS adicional no container */
  className?: string;
  /** Mostrar tagline "Conecte. Jogue. Compartilhe." */
  showTagline?: boolean;
}

export function GamerVerseLogo({
  asLink = true,
  className = "",
  showTagline = true,
}: GamerVerseLogoProps) {
  const content = (
    <>
      <svg
        className="gamer-verse-logo-icon"
        viewBox="0 0 80 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M40 12c-8 0-14 5-14 12v8c0 2 1.5 4 4 4h4v12h-6v4h16v-4h-6V36h4c2.5 0 4-2 4-4v-8c0-7-6-12-14-12z"
          fill="currentColor"
        />
        <path
          d="M26 24v-4c0-5 4-9 14-9s14 4 14 9v4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="32"
          cy="38"
          r="5"
          fill="var(--sgn-primary)"
          className="gamer-verse-logo-eye"
        />
        <circle
          cx="48"
          cy="38"
          r="5"
          fill="var(--sgn-primary)"
          className="gamer-verse-logo-eye"
        />
        <circle cx="32" cy="38" r="2.5" fill="white" opacity="0.9" />
        <circle cx="48" cy="38" r="2.5" fill="white" opacity="0.9" />
      </svg>
      <h1 className="gamer-verse-logo-text">
        <span className="gamer-verse-logo-gamer">GAMER</span>
        <span className="gamer-verse-logo-verse">VERSE</span>
      </h1>
      {showTagline && (
        <p className="gamer-verse-logo-tagline">Conecte. Jogue. Compartilhe.</p>
      )}
    </>
  );

  if (asLink) {
    return (
      <Link
        to="/"
        className={`gamer-verse-logo ${className}`.trim()}
        aria-label="GamerVerse - Voltar ao início"
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`gamer-verse-logo gamer-verse-logo-static ${className}`.trim()}
    >
      {content}
    </div>
  );
}
