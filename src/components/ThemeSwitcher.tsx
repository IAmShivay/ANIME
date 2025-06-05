'use client';

import { Moon, Sun, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', icon: Sun },
    { id: 'dark', icon: Moon },
    { id: 'purple', icon: Palette },
  ];

  return (
    <div className="flex items-center gap-2">
      {themes.map(({ id, icon: Icon }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(id as 'light' | 'dark' | 'purple')}
          className={`p-2 rounded-full transition-colors ${
            theme === id
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Icon className="w-5 h-5" />
        </motion.button>
      ))}
    </div>
  );
};