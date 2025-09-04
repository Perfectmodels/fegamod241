import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkStyle = {
    color: '#D4AF37',
    textDecoration: 'underline',
    textUnderlineOffset: '8px',
  };

  return (
    <header className="sticky top-0 z-50 bg-off-white/80 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <img 
              src="https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/473677977_9128296503952662_8897451079006998067_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF15cwlhZa3g07xq8eJZJn_0kSjya3bNOHSRKPJrds04ShhLQu6TtldL5jFLqDcu7ESrlXo6BRF8_GsYUW-19SI&_nc_ohc=YqYKcRYF5DAQ7kNvwHWSaUe&_nc_oc=Adned4RCPgvNp4Q5mvomLWNxgz2jSsDHSMXjFHVXZYcxS6lOSlxFdEbJXvHsH700q30&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=tAF9UE47VMF8_0c2QO1M2g&oh=00_AfYfSzd3BQt0PGZwDFqjM-hYsZviBMMzICyf6U-AtKE1yA&oe=68BECA2C" 
              alt="FEGAMOD Logo" 
              className="h-16 w-16 object-contain"
            />
            <span className="font-serif text-2xl font-bold text-deep-black group-hover:text-emerald transition-colors duration-300">FEGAMOD</span>
          </NavLink>

          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                className="text-base font-medium text-deep-black hover:text-metallic-gold transition-colors duration-300"
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-deep-black focus:outline-none"
              aria-label="Open menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-off-white pb-4">
          <nav className="flex flex-col items-center space-y-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                className="text-lg font-medium text-deep-black hover:text-metallic-gold transition-colors duration-300"
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;