// Layout.tsx
// Shared layout component with mobile-first responsive navigation.

import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/guestbook", label: "Guestbook" },
    { path: "/howitworks", label: "How It Works" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0B0D] text-white font-sans">
      {/* Navigation Bar */}
      <nav className="w-full bg-[#1E1E1E] border-b-4 border-[#0052FF] px-4 py-3 md:px-6 md:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg md:text-xl font-black uppercase tracking-tight text-[#0052FF]">
            Base Guestbook
          </Link>

          {/* Mobile Menu Button & Connect Wallet */}
          <div className="flex items-center gap-2 md:hidden">
            <ConnectWalletButton className="border-2 px-3 py-1.5 text-[10px]" />
            <button
              className="p-2 text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 lg:gap-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 lg:px-4 font-bold uppercase text-xs lg:text-sm transition-all ${location.pathname === link.path
                  ? "bg-[#0052FF] text-white shadow-[2px_2px_0px_0px_#FFFFFF]"
                  : "text-gray-400 hover:text-white hover:bg-[#0052FF]/20"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <ConnectWalletButton />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-700 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 font-bold uppercase text-sm transition-all ${location.pathname === link.path
                  ? "bg-[#0052FF] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#0052FF]/20"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#1E1E1E] border-t-4 border-[#0052FF] px-4 py-4 md:px-6 md:py-5">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <p className="text-gray-500 text-xs md:text-sm">
            Built on <span className="text-[#0052FF] font-bold">Base</span> • Powered by Farcaster
          </p>
          <a
            href="https://psylabsweb3.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          >
            <span className="text-[10px] md:text-xs uppercase tracking-wide font-bold text-[#F7D731]">Made with passion by</span>
            <img
              src="/psylabs-logo.png"
              alt="Psy_Labs"
              className="h-5 md:h-6 group-hover:scale-105 transition-transform"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}
