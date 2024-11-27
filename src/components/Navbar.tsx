import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { themes, theme } = useTheme();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`${themes[theme].navbar} backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${themes[theme].primary}`}>
              AnimeScience
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? `text-${themes[theme].primary.split('-')[1]}-600`
                    : `${themes[theme].text} hover:text-${themes[theme].primary.split('-')[1]}-600`
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${themes[theme].primary}`}
                    initial={false}
                  />
                )}
              </Link>
            ))}
            <ThemeSwitcher />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 hover:bg-${themes[theme].primary.split('-')[1]}-50 rounded-full transition-colors`}
            >
              <ShoppingCart className={`h-6 w-6 text-${themes[theme].primary.split('-')[1]}-600`} />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${themes[theme].text}`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`md:hidden ${themes[theme].navbar} border-t border-gray-100`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? `bg-${themes[theme].primary.split('-')[1]}-50 text-${themes[theme].primary.split('-')[1]}-600`
                    : `${themes[theme].text} hover:bg-${themes[theme].primary.split('-')[1]}-50 hover:text-${themes[theme].primary.split('-')[1]}-600`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};