import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark' | 'purple';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
  light: {
    primary: 'from-violet-600 to-indigo-600',
    secondary: 'from-fuchsia-600 to-violet-600',
    background: 'from-slate-50 to-purple-50',
    text: 'text-gray-900',
    navbar: 'bg-white/80',
    card: 'bg-white',
  },
  dark: {
    primary: 'from-red-600 to-rose-600',
    secondary: 'from-rose-600 to-red-600',
    background: 'from-gray-900 to-black',
    text: 'text-white',
    navbar: 'bg-gray-900/80',
    card: 'bg-gray-800',
  },
  purple: {
    primary: 'from-violet-600 to-purple-600',
    secondary: 'from-fuchsia-500 to-purple-500',
    background: 'from-violet-100 to-purple-100',
    text: 'text-gray-900',
    navbar: 'bg-white/80',
    card: 'bg-white',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`min-h-screen bg-gradient-to-br ${themes[theme].background} transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return { ...context, themes };
};