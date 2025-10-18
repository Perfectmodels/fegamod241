import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useSettings } from '../services/convexService';
import type { SiteSettings } from '../types';

const SocialIcon: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-off-white/80 hover:text-metallic-gold transition-colors duration-300">
        {children}
    </a>
);

const Footer: React.FC = () => {
  const settings = useSettings();

  return (
    <footer className="bg-deep-black text-off-white/80 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl text-off-white mb-4">FEGAMOD</h3>
            <p className="max-w-md">
              La Fédération Gabonaise de la Mode, unissant et promouvant les talents de la mode au Gabon et à l'international.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-lg text-off-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 6).map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-metallic-gold transition-colors duration-300">{link.name}</Link>
                </li>
              ))}
              <li className="pt-2 mt-2 border-t border-off-white/10">
                  <Link to="/admin/login" className="hover:text-metallic-gold transition-colors duration-300">
                      Accès Panel Admin
                  </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="font-serif text-lg text-off-white mb-4">Contact</h3>
            <ul className="space-y-2 mb-4">
                <li>{settings?.email || 'contact@fegamod.ga'}</li>
                <li>{settings?.phone || '+241 01 23 45 67'}</li>
                <li>{settings?.address || 'Libreville, Gabon'}</li>
            </ul>
            <div className="flex space-x-4">
                <SocialIcon href="#">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
                </SocialIcon>
                <SocialIcon href="#">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.177-1.354.23-2.074.084.607 1.882 2.373 3.256 4.466 3.293-1.728 1.354-3.895 2.111-6.266 2.111-.408 0-.81-.023-1.206-.07z"/></svg>
                </SocialIcon>
                <SocialIcon href="#">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>
                </SocialIcon>
            </div>
          </div>
        </div>

        <div className="border-t border-off-white/20 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FEGAMOD. Tous droits réservés. Conçu avec excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

