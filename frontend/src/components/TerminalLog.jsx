import React from 'react';
import { Terminal } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import './TerminalLog.scss';

const TerminalLog = ({ logs, buildStatus, progress }) => {
  const { t } = useTranslation();

  return (
    <div className="terminal">
      <div className="terminal__header">
        <div className="terminal__title">
          <Terminal size={16} />
          <span>{t('logs')}</span>
        </div>
        <div className="terminal__controls">
          <div className="terminal__dot terminal__dot--red" />
          <div className="terminal__dot terminal__dot--yellow" />
          <div className="terminal__dot terminal__dot--green" />
        </div>
      </div>
      
      <div className="terminal__content">
        {logs.length === 0 ? (
          <div className="terminal__empty">
            Waiting for process to start...
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="terminal__line">
              <span className="terminal__prompt">➜</span>
              {log}
            </div>
          ))
        )}
        {buildStatus === 'completed' && (
          <div className="terminal__success">
            Done. Process exited with code 0.
          </div>
        )}
      </div>

      {(buildStatus === 'building' || buildStatus === 'flashing' || buildStatus === 'completed') && (
        <div className="terminal__progress">
          <div 
            className="terminal__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default TerminalLog;

