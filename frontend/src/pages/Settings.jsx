import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Save, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useWails } from '../hooks/useWails';
import { useNotifications } from '../hooks/useNotifications';
import './Settings.scss';

const Settings = () => {
  const { t } = useTranslation();
  const { selectDirectory, saveSettings, getSettings } = useWails();
  const { requestPermission, checkPermission } = useNotifications();
  const [workspacePath, setWorkspacePath] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'success', 'error'
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    loadSettings();
    setNotificationPermission(checkPermission());
  }, [checkPermission]);

  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      setWorkspacePath(settings.workspacePath || '');
      setProxyUrl(settings.proxyURL || '');
      setNotificationsEnabled(settings.notificationsEnabled !== false);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleBrowse = async () => {
    console.log('📁 Opening directory selection dialog...');
    const path = await selectDirectory();
    if (path) {
      console.log('✅ Directory selected:', path);
      setWorkspacePath(path);
      console.log('⚠️ Remember to click "Save Changes" to persist this path!');
    } else {
      console.log('❌ Directory selection cancelled');
    }
  };

  const handleSave = async () => {
    console.log('💾 Saving settings...');
    console.log('Settings to save:', { workspacePath, proxyUrl, notificationsEnabled });
    
    // Validate workspace path
    if (!workspacePath || workspacePath.trim() === '') {
      console.error('❌ Workspace path is empty!');
      alert('Please select a workspace directory first.');
      return;
    }
    
    setSaveStatus('saving');
    try {
      await saveSettings(workspacePath, proxyUrl, notificationsEnabled);
      
      console.log('✅ Settings saved successfully!');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      setSaveStatus('error');
      alert(`Failed to save settings: ${error.message || error}`);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleNotificationToggle = async () => {
    const newValue = !notificationsEnabled;
    
    if (newValue && notificationPermission === 'default') {
      const granted = await requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        setNotificationPermission('granted');
      }
    } else {
      setNotificationsEnabled(newValue);
    }
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
                  placeholder="Click Browse to select a directory..."
                />
                <button onClick={handleBrowse} className="btn btn--secondary">
                  Browse
                </button>
              </div>
              {workspacePath && (
                <p className="form-help" style={{ color: '#f59e0b', marginTop: '4px' }}>
                  ⚠️ Selected: {workspacePath} - Click "Save Changes" below to persist!
                </p>
              )}
              {!workspacePath && (
                <p className="form-help" style={{ color: '#6b7280', marginTop: '4px' }}>
                  Please select a directory where downloaded files will be saved.
                </p>
              )}
            </div>

            <div className="form-group">
              <div className="toggle-group">
                <span className="toggle-label">{t('enableNotifications')}</span>
                <button
                  onClick={handleNotificationToggle}
                  className={`toggle ${notificationsEnabled ? 'toggle--active' : ''}`}
                >
                  <span className="toggle__slider" />
                </button>
              </div>
              {notificationPermission === 'denied' && (
                <p className="form-help form-help--error">
                  Notifications blocked by system. Grant permission in OS settings.
                </p>
              )}
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
          <button 
            onClick={handleSave} 
            className={`btn btn--primary ${saveStatus === 'saving' ? 'btn--loading' : ''}`}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'success' ? (
              <>
                <CheckCircle size={18} /> Saved!
              </>
            ) : (
              <>
                <Save size={18} /> {t('saveChanges')}
              </>
            )}
          </button>
          {saveStatus === 'error' && (
            <span className="save-error">Failed to save settings</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

