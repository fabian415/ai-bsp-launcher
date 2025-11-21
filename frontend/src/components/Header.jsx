import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Languages, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../hooks/useTranslation';
import { LANGUAGE_OPTIONS } from '../utils/translations';
import '../assets/styles/layout.scss';
import '../assets/styles/components.scss';

const Header = () => {
  const { t } = useTranslation();
  const { 
    theme, 
    lang, 
    buildStatus, 
    selectedPlatform, 
    activeTab,
    setTheme, 
    setLang 
  } = useAppStore();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLangChange = (code) => {
    setLang(code);
    setIsLangMenuOpen(false);
  };

  const getStatusColor = () => {
    if (buildStatus === 'ready') return 'var(--color-success, #10b981)';
    if (buildStatus === 'completed') return 'var(--color-primary, #3b82f6)';
    return 'var(--color-warning, #f59e0b)';
  };

  return (
    <header className="header">
      <div className="header__breadcrumb">
        <span>{t('launchPad')}</span>
        <ChevronRight size={14} style={{ margin: '0 0.5rem' }} />
        <span>{selectedPlatform ? selectedPlatform.name : t(activeTab)}</span>
      </div>

      <div className="header__actions">
        {/* Status Indicator */}
        <div className="status-indicator">
          <div 
            className="status-indicator__dot"
            style={{ backgroundColor: getStatusColor() }}
          />
          <span className="status-indicator__text">
            {t(buildStatus)}
          </span>
        </div>

        {/* Language Selector */}
        <div className="dropdown" ref={langMenuRef}>
          <button 
            className="btn btn--icon"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          >
            <Languages size={20} />
          </button>
          {isLangMenuOpen && (
            <div className="dropdown__menu" style={{ display: 'block' }}>
              {LANGUAGE_OPTIONS.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => handleLangChange(opt.code)}
                  className={`dropdown__item ${lang === opt.code ? 'dropdown__item--active' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn--icon"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Avatar */}
        <div className="user-avatar">AD</div>
      </div>
    </header>
  );
};

export default Header;

