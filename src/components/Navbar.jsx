import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navLinks = [
  { label: "AI Creative Suite", href: "#", active: true },
  { label: "API", href: "#" },
  { label: "Resources", href: "#" },
  { label: "Pricing", href: "#" },
];

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md shadow-sm border-b border-white/10">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter">VoxFlow AI</div>

        {/* Nav links — desktop */}
        <div className="hidden md:flex gap-8 items-center text-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "text-indigo-400 font-bold border-b-2 border-indigo-400 pb-1"
                  : "text-zinc-400 hover:text-zinc-100 transition-colors"
              }
            >
              {link.label}
            </a>
          ))}
          <Link className="text-zinc-400 hover:text-zinc-100 transition-colors" to="/dashboard">
            Dashboard
          </Link>
        </div>

        {/* Tombol kanan — desktop */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated && (
            <Link
              to="/login"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors px-4 py-2"
            >
              Login
            </Link>
          )}
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="bg-indigo-400 text-white text-sm px-6 py-2.5 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all"
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Creating for Free"}
          </Link>
        </div>

        {/* Hamburger button — cuma muncul di mobile */}
        <button
          className="md:hidden text-zinc-100 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Dropdown menu — cuma muncul di mobile saat isMenuOpen true */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={
                link.active
                  ? "text-indigo-400 font-bold text-sm"
                  : "text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
              }
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
          >
            Dashboard
          </Link>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Login
              </Link>
            )}
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              onClick={() => setIsMenuOpen(false)}
              className="bg-indigo-400 text-white text-sm px-6 py-2.5 rounded-full font-bold text-center hover:opacity-90 active:scale-95 transition-all"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Creating for Free"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}