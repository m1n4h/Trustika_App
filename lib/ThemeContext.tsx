import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  colors: {
    background: string;
    text: string;
    sectionBackground: string;
    border: string;
    primary: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const colors = {
    background: isDarkMode ? '#1F2937' : '#fff',
    text: isDarkMode ? '#fff' : '#1F2937',
    sectionBackground: isDarkMode ? '#2D3748' : '#F9FAFB',
    border: isDarkMode ? '#374151' : '#E5E7EB',
    primary: '#FF6B6B',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
