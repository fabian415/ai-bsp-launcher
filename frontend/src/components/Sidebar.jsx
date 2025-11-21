import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cpu, Layers, HardDrive, Download, Settings, LogOut } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../hooks/useTranslation';
import '../assets/styles/layout.scss';

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPlatform, setActiveTab, logout } = useAppStore();

  const navItems = [
    { id: 'dashboard', icon: Layers, label: t('dashboard'), path: '/dashboard' },
    { id: 'platforms', icon: HardDrive, label: t('platforms'), path: '/platforms' },
    { id: 'downloads', icon: Download, label: t('downloads'), path: '/downloads' },
    { id: 'settings', icon: Settings, label: t('settings'), path: '/settings' },
  ];

  const handleNavClick = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <Cpu className="sidebar__logo" size={24} />
        <span className="sidebar__title">BSP Launcher</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`nav-item ${location.pathname === item.path && !selectedPlatform ? 'nav-item--active' : ''}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button onClick={logout} className="nav-item">
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

