import React, { useState } from 'react';
import { Settings as SettingsIcon, Play, CheckCircle, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../hooks/useTranslation';
import { useBuildProcess } from '../hooks/useBuildProcess';
import { useNotifications } from '../hooks/useNotifications';
import TerminalLog from '../components/TerminalLog';
import './PlatformWorkspace.scss';

const PlatformWorkspace = () => {
  const { t } = useTranslation();
  const { selectedPlatform, setSelectedPlatform } = useAppStore();
  const { showToast } = useNotifications();
  const { buildStatus, progress, logs, startProcess, cancelProcess } = useBuildProcess(showToast);
  const [bootOption, setBootOption] = useState('sd');

  if (!selectedPlatform) return null;

  const handleStartProcess = (type) => {
    if (selectedPlatform && selectedPlatform.id) {
      startProcess(type, selectedPlatform.id, bootOption);
    }
  };

  const isProcessRunning = buildStatus === 'building' || buildStatus === 'flashing';

  return (
    <div className="platform-workspace">
      <div className="workspace-header">
        <div>
          <button 
            onClick={() => setSelectedPlatform(null)}
            className="back-link"
          >
            ← Back to Selection
          </button>
          <h2 className="workspace-title">
            {selectedPlatform.name}
            <span className="workspace-badge">{selectedPlatform.code}</span>
          </h2>
        </div>
        
        <div className="workspace-actions">
          {isProcessRunning ? (
            <button 
              onClick={cancelProcess}
              className="btn btn--danger"
            >
              <X size={18} />
              Cancel
            </button>
          ) : (
            <>
              <button 
                disabled={isProcessRunning}
                onClick={() => handleStartProcess('build')}
                className="btn btn--secondary"
              >
                <SettingsIcon size={18} />
                {t('build')}
              </button>
              <button 
                disabled={isProcessRunning}
                onClick={() => handleStartProcess('flash')}
                className="btn btn--primary"
              >
                <Play size={18} />
                {t('flash')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="workspace-grid">
        {/* Column 1: Info & Config */}
        <div className="workspace-sidebar">
          <div className="card">
            <h3 className="card__title">{t('status')}</h3>
            <div className="status-list">
              <div className="status-item">
                <span className="status-item__label">Target Device</span>
                <span className="status-item__value status-item__value--success">
                  <CheckCircle size={14} /> Connected
                </span>
              </div>
              <div className="status-item">
                <span className="status-item__label">BSP Version</span>
                <span className="status-item__value status-item__value--mono">REL_35.4.1</span>
              </div>
              <div className="status-item">
                <span className="status-item__label">Disk Space</span>
                <span className="status-item__value">45GB Free</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card__title">Quick Config</h3>
            <div className="config-options">
              <label className="config-option">
                <input 
                  type="radio" 
                  name="boot" 
                  value="sd"
                  checked={bootOption === 'sd'}
                  onChange={(e) => setBootOption(e.target.value)}
                  disabled={isProcessRunning}
                />
                <div className="config-option__content">
                  <span className="config-option__title">SD Card Boot</span>
                  <span className="config-option__desc">Flash to external storage</span>
                </div>
              </label>
              <label className="config-option">
                <input 
                  type="radio" 
                  name="boot" 
                  value="emmc"
                  checked={bootOption === 'emmc'}
                  onChange={(e) => setBootOption(e.target.value)}
                  disabled={isProcessRunning}
                />
                <div className="config-option__content">
                  <span className="config-option__title">eMMC Boot</span>
                  <span className="config-option__desc">Flash to internal storage</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Terminal & Logs */}
        <div className="workspace-main">
          <TerminalLog logs={logs} buildStatus={buildStatus} progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default PlatformWorkspace;


