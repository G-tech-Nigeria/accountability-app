import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const TaskIconSelector = ({ selectedIcon, onIconSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const iconCategories = {
    all: { name: 'All Icons', icons: [] },
    fitness: { 
      name: 'Fitness & Health', 
      icons: ['💪', '🏃‍♂️', '🏋️‍♂️', '🧘‍♀️', '🚴‍♂️', '🏊‍♂️', '⚽', '🏀', '🎾', '🏸', '🥊', '🧗‍♂️', '🏃‍♀️', '🚶‍♂️', '💃', '🕺', '🏃', '🏃‍♀️', '🚴‍♀️', '🏊‍♀️']
    },
    work: { 
      name: 'Work & Study', 
      icons: ['💼', '📚', '✏️', '📝', '💻', '📱', '📊', '📈', '📉', '🎯', '📋', '📅', '⏰', '🎓', '📖', '✍️', '🔍', '💡', '📌', '📎']
    },
    home: { 
      name: 'Home & Life', 
      icons: ['🏠', '🧹', '🧺', '👕', '🍳', '🛒', '🌱', '🐕', '🐱', '🪴', '🛏️', '🚿', '🧽', '🧴', '🪞', '🪑', '🛋️', '📺', '🔌', '💡']
    },
    learning: { 
      name: 'Learning & Skills', 
      icons: ['🎨', '🎭', '🎵', '🎹', '🎸', '🎤', '📷', '🎬', '🎮', '🧩', '🎯', '🎪', '🎨', '✏️', '📝', '📚', '🎓', '🔬', '🧪', '🔭']
    },
    social: { 
      name: 'Social & Fun', 
      icons: ['👥', '🎉', '🎊', '🎈', '🎁', '🍕', '🍔', '🍦', '☕', '🍷', '🍺', '🎮', '🎲', '🎭', '🎪', '🎨', '📸', '🎵', '💃', '🕺']
    },
    finance: { 
      name: 'Finance & Money', 
      icons: ['💰', '💳', '🏦', '📊', '📈', '💵', '💸', '🪙', '💎', '🏆', '🎯', '📋', '📝', '💼', '📱', '💻', '📊', '📈', '📉', '🎯']
    }
  };

  // Combine all icons for search
  const allIcons = Object.values(iconCategories)
    .filter(cat => cat.name !== 'All Icons')
    .flatMap(cat => cat.icons);

  // Filter icons based on search and category
  const getFilteredIcons = () => {
    let icons = selectedCategory === 'all' ? allIcons : iconCategories[selectedCategory]?.icons || [];
    
    if (searchTerm) {
      icons = icons.filter(icon => 
        iconCategories[Object.keys(iconCategories).find(key => 
          iconCategories[key].icons.includes(icon)
        )]?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return [...new Set(icons)]; // Remove duplicates
  };

  const filteredIcons = getFilteredIcons();

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
        maxWidth: '600px',
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
            🎯 Choose Task Icon
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
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{
          position: 'relative',
          marginBottom: '1rem'
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid var(--sidebar-border)',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          {Object.entries(iconCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                background: selectedCategory === key ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                color: selectedCategory === key ? 'white' : 'var(--text-primary)',
                border: '1px solid',
                borderColor: selectedCategory === key ? 'var(--accent-blue)' : 'var(--sidebar-border)',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
          gap: '0.75rem',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {filteredIcons.map((icon) => (
            <button
              key={icon}
              onClick={() => {
                onIconSelect(icon);
                onClose();
              }}
              style={{
                background: selectedIcon === icon ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                border: '2px solid',
                borderColor: selectedIcon === icon ? 'var(--accent-blue)' : 'var(--sidebar-border)',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                minHeight: '60px'
              }}
              title={icon}
            >
              {icon}
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
          }}>
            No icons found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskIconSelector;
