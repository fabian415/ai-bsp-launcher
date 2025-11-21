import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Save } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useWails } from '../hooks/useWails';
import './Settings.scss';

const Settings = () => {
  const { t } = useTranslation();
  const { selectDirectory } = useWails();
  const [workspacePath, setWorkspacePath] = useState('/home/user/bsp_workspace');
  const [proxyUrl, setProxyUrl] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleBrowse = async () => {
    const path = await selectDirectory();
    if (path) {
      setWorkspacePath(path);
    }
  };

  const handleSave = () => {
    console.log('Saving settings:', { workspacePath, proxyUrl, notificationsEnabled });
    // TODO: Call Wails API to save settings
  };

  return (
    <div className="settings">
      <h2 className="settings__title">{t('settings')}</h2>
      
      <div className="settings__content">
        {/* General Settings */}
        <div className="card">
          <h3 className="settings__section-title">
            <SettingsIcon size={20} /> {t('general')}
          </h3>
          <div className="settings__section">
            <div className="form-group">
              <label className="form-label">{t('workspacePath')}</label>
              <div className="input-group">
                <input 
                  type="text" 
                  value={workspacePath}
                  onChange={(e) => setWorkspacePath(e.target.value)}
                  className="input"
                />
                <button onClick={handleBrowse} className="btn btn--secondary">
                  Browse
                </button>
              </div>
            </div>

            <div className="form-group">
              <div className="toggle-group">
                <span className="toggle-label">{t('enableNotifications')}</span>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`toggle ${notificationsEnabled ? 'toggle--active' : ''}`}
                >
                  <span className="toggle__slider" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="card">
          <h3 className="settings__section-title">
            <Globe size={20} /> {t('network')}
          </h3>
          <div className="settings__section">
            <div className="form-group">
              <label className="form-label">{t('proxySettings')}</label>
              <input 
                type="text" 
                value={proxyUrl}
                onChange={(e) => setProxyUrl(e.target.value)}
                placeholder="http://proxy.example.com:8080"
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="settings__actions">
          <button onClick={handleSave} className="btn btn--primary">
            <Save size={18} /> {t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

