// Theme system for the accountability app
export const themes = {
  dark: {
    name: 'Dark',
    colors: {
      '--bg-primary': '#0f0f0f',
      '--bg-secondary': '#1a1a1a',
      '--bg-card': '#2a2a2a',
      '--text-primary': '#ffffff',
      '--text-secondary': '#b0b0b0',
      '--text-muted': '#666666',
      '--accent-blue': '#3b82f6',
      '--accent-green': '#10b981',
      '--accent-orange': '#f59e0b',
      '--accent-red': '#ef4444',
      '--sidebar-bg': '#1a1a1a',
      '--sidebar-border': '#333333'
    }
  },
  light: {
    name: 'Light',
    colors: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8f9fa',
      '--bg-card': '#ffffff',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#666666',
      '--text-muted': '#999999',
      '--accent-blue': '#3b82f6',
      '--accent-green': '#10b981',
      '--accent-orange': '#f59e0b',
      '--accent-red': '#ef4444',
      '--sidebar-bg': '#f8f9fa',
      '--sidebar-border': '#e5e7eb'
    }
  },
  blue: {
    name: 'Ocean Blue',
    colors: {
      '--bg-primary': '#0f172a',
      '--bg-secondary': '#1e293b',
      '--bg-card': '#334155',
      '--text-primary': '#f1f5f9',
      '--text-secondary': '#cbd5e1',
      '--text-muted': '#64748b',
      '--accent-blue': '#0ea5e9',
      '--accent-green': '#10b981',
      '--accent-orange': '#f59e0b',
      '--accent-red': '#ef4444',
      '--sidebar-bg': '#1e293b',
      '--sidebar-border': '#475569'
    }
  },
  green: {
    name: 'Forest Green',
    colors: {
      '--bg-primary': '#064e3b',
      '--bg-secondary': '#065f46',
      '--bg-card': '#047857',
      '--text-primary': '#ecfdf5',
      '--text-secondary': '#d1fae5',
      '--text-muted': '#6ee7b7',
      '--accent-blue': '#3b82f6',
      '--accent-green': '#10b981',
      '--accent-orange': '#f59e0b',
      '--accent-red': '#ef4444',
      '--sidebar-bg': '#065f46',
      '--sidebar-border': '#047857'
    }
  },
  purple: {
    name: 'Royal Purple',
    colors: {
      '--bg-primary': '#1e1b4b',
      '--bg-secondary': '#312e81',
      '--bg-card': '#4338ca',
      '--text-primary': '#faf5ff',
      '--text-secondary': '#e9d5ff',
      '--text-muted': '#c4b5fd',
      '--accent-blue': '#3b82f6',
      '--accent-green': '#10b981',
      '--accent-orange': '#f59e0b',
      '--accent-red': '#ef4444',
      '--sidebar-bg': '#312e81',
      '--sidebar-border': '#4338ca'
    }
  }
};

export const fonts = {
  sans: {
    name: 'Sans Serif',
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  serif: {
    name: 'Serif',
    family: 'Georgia, "Times New Roman", serif'
  },
  mono: {
    name: 'Monospace',
    family: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
  }
};

// Apply theme to document
export const applyTheme = (themeName, customColors = {}) => {
  const theme = themes[themeName] || themes.dark;
  const root = document.documentElement;
  
  // Apply theme colors
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Apply custom colors if provided
  Object.entries(customColors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

// Save theme preferences
export const saveThemePreferences = (themeName, customColors = {}) => {
  localStorage.setItem('accountability-theme', themeName);
  localStorage.setItem('accountability-custom-colors', JSON.stringify(customColors));
};

// Load theme preferences
export const loadThemePreferences = () => {
  const themeName = localStorage.getItem('accountability-theme') || 'dark';
  const customColors = JSON.parse(localStorage.getItem('accountability-custom-colors') || '{}');
  return { themeName, customColors };
};

// Apply font
export const applyFont = (fontName) => {
  const font = fonts[fontName] || fonts.sans;
  document.documentElement.style.setProperty('--font-family', font.family);
  localStorage.setItem('accountability-font', fontName);
};

// Load font preference
export const loadFontPreference = () => {
  const fontName = localStorage.getItem('accountability-font') || 'sans';
  return fontName;
};
