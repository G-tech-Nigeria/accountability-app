import React, { useState, useEffect } from 'react';
import { Palette, Type, Eye, Check } from 'lucide-react';
import { themes, fonts, applyTheme, saveThemePreferences, loadThemePreferences, applyFont, loadFontPreference } from '../utils/themes';

const ThemeSelector = ({ isOpen, onClose }) => {
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedFont, setSelectedFont] = useState('sans');
  const [customColors, setCustomColors] = useState({});
  const [activeTab, setActiveTab] = useState('themes');

  useEffect(() => {
    if (isOpen) {
      const { themeName, customColors: savedColors } = loadThemePreferences();
      const fontName = loadFontPreference();
      setSelectedTheme(themeName);
      setSelectedFont(fontName);
      setCustomColors(savedColors);
    }
  }, [isOpen]);

  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName);
    applyTheme(themeName, customColors);
    saveThemePreferences(themeName, customColors);
  };

  const handleFontChange = (fontName) => {
    setSelectedFont(fontName);
    applyFont(fontName);
  };

  const handleCustomColorChange = (property, value) => {
    const newCustomColors = { ...customColors, [property]: value };
    setCustomColors(newCustomColors);
    applyTheme(selectedTheme, newCustomColors);
    saveThemePreferences(selectedTheme, newCustomColors);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '1.5rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid var(--sidebar-border)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            🎨 Customize Appearance
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              fontSize: '1.5rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--sidebar-border)',
          paddingBottom: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('themes')}
            style={{
              background: activeTab === 'themes' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'themes' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <Palette size={16} />
            Themes
          </button>
          <button
            onClick={() => setActiveTab('fonts')}
            style={{
              background: activeTab === 'fonts' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'fonts' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <Type size={16} />
            Fonts
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            style={{
              background: activeTab === 'colors' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'colors' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <Eye size={16} />
            Custom Colors
          </button>
        </div>

        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              Choose Theme
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem'
            }}>
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  style={{
                    background: selectedTheme === key ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                    border: '2px solid',
                    borderColor: selectedTheme === key ? 'var(--accent-blue)' : 'var(--sidebar-border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: theme.colors['--accent-blue'],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    {selectedTheme === key ? <Check size={20} /> : '🎨'}
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: selectedTheme === key ? 'white' : 'var(--text-primary)'
                  }}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fonts Tab */}
        {activeTab === 'fonts' && (
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              Choose Font
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {Object.entries(fonts).map(([key, font]) => (
                <button
                  key={key}
                  onClick={() => handleFontChange(key)}
                  style={{
                    background: selectedFont === key ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                    border: '1px solid',
                    borderColor: selectedFont === key ? 'var(--accent-blue)' : 'var(--sidebar-border)',
                    borderRadius: '6px',
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: font.family,
                    fontSize: '1rem',
                    color: selectedFont === key ? 'white' : 'var(--text-primary)'
                  }}
                >
                  <span>{font.name}</span>
                  {selectedFont === key && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Colors Tab */}
        {activeTab === 'colors' && (
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              Customize Colors
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {[
                { key: '--accent-blue', label: 'Primary Blue', default: '#3b82f6' },
                { key: '--accent-green', label: 'Success Green', default: '#10b981' },
                { key: '--accent-orange', label: 'Warning Orange', default: '#f59e0b' },
                { key: '--accent-red', label: 'Error Red', default: '#ef4444' }
              ].map(({ key, label, default: defaultValue }) => (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <label style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    minWidth: '120px'
                  }}>
                    {label}
                  </label>
                  <input
                    type="color"
                    value={customColors[key] || defaultValue}
                    onChange={(e) => handleCustomColorChange(key, e.target.value)}
                    style={{
                      width: '50px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                  <button
                    onClick={() => handleCustomColorChange(key, defaultValue)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--sidebar-border)',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    Reset
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
