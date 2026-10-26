import { NavLink } from "react-router-dom";
import "./NavBar.css";

const LINKS = [
  { to: "/", label: "Overview", end: true },
  { to: "/themes", label: "Themes" },
  { to: "/colors", label: "Colors" },
  { to: "/parts", label: "Parts" },
  { to: "/minifigs", label: "Minifigs" },
];

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function NavBar() {
  return (
    <header className="masthead">
      <div className="masthead-dateline">
        <span>{today}</span>
        <span>A data journalism project</span>
      </div>
      <div className="masthead-title">
        <h1>
          Lego <span className="masthead-title-accent">Insights</span>
        </h1>
        <p className="masthead-deck">
          Six decades of LEGO sets, themes, colors, parts and minifigures, charted from the
          Rebrickable catalog.
        </p>
      </div>
      <nav className="nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
