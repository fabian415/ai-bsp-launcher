import React from 'react';
import { Cpu, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../hooks/useTranslation';
import { LANGUAGE_OPTIONS } from '../utils/translations';
import './Login.scss';

const Login = () => {
  const { t } = useTranslation();
  const { theme, lang, authMode, setIsAuthenticated, setAuthMode, setTheme, setLang } = useAppStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <Cpu size={32} />
        </div>
        
        <h2 className="login-title">{t('launchPad')}</h2>
        <p className="login-desc">{t('welcomeDesc')}</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <input 
              type="email" 
              className="input"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input 
              type="password" 
              className="input"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn btn--primary btn--full">
            {authMode === 'login' ? t('login') : t('register')}
          </button>
        </form>

        <div className="login-footer">
          <span className="login-footer__text">
            {authMode === 'login' ? t('account') : t('haveAccount')}
          </span>
          <button 
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="login-footer__link"
          >
            {authMode === 'login' ? t('signUp') : t('signIn')}
          </button>
        </div>

        <div className="login-controls">
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="login-select"
          >
            {LANGUAGE_OPTIONS.map(opt => (
              <option key={opt.code} value={opt.code}>{opt.label}</option>
            ))}
          </select>
          
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn--icon"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

