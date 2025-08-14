import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Award, 
  Settings,
  Palette
} from 'lucide-react';

const Sidebar = ({ isOpen = false, onRouteChange, onThemeClick }) => {
  const location = useLocation();

  const navItems = [
    {
      section: 'main',
      items: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: Home,
          active: location.pathname === '/dashboard'
        },
        {
          path: '/tasks',
          label: 'Daily Tasks',
          icon: Calendar,
          active: location.pathname === '/tasks'
        },
        {
          path: '/achievements',
          label: 'Achievements',
          icon: Award,
          active: location.pathname === '/achievements'
        }
      ]
    }
  ];

  const handleNavClick = () => {
    if (onRouteChange) {
      onRouteChange();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span>AT</span>
        </div>
        <div className="sidebar-title">Accountability</div>
      </div>

      {/* Sidebar Navigation */}
      <div className="sidebar-nav">
        {navItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            {section.title && (
              <div className="nav-section-title">{section.title}</div>
            )}
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <Link
                  key={itemIndex}
                  to={item.path}
                  className={`nav-item ${item.active ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <div className="nav-item-icon">
                    <Icon size={18} />
                  </div>
                  <span className="nav-item-label">{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <Link to="/settings" className="nav-item" onClick={handleNavClick}>
          <div className="nav-item-icon">
            <Settings size={18} />
          </div>
          <span className="nav-item-label">Settings</span>
        </Link>
        <button 
          className="nav-item" 
          onClick={onThemeClick}
          style={{
            background: 'none',
            border: 'none',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          <div className="nav-item-icon">
            <Palette size={18} />
          </div>
          <span className="nav-item-label">Themes</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
