import React from 'react';
import { RefreshCw, Folder, Download, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { MOCK_DOWNLOADS } from '../utils/constants';
import './Downloads.scss';

const Downloads = () => {
  const { t } = useTranslation();

  return (
    <div className="downloads">
      <div className="downloads__header">
        <h2 className="downloads__title">{t('downloadCenter')}</h2>
        <button className="btn btn--icon">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="downloads-table">
        <table>
          <thead>
            <tr>
              <th>{t('fileName')}</th>
              <th>{t('size')}</th>
              <th>{t('date')}</th>
              <th className="text-right">{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DOWNLOADS.map((file) => (
              <tr key={file.id}>
                <td>
                  <div className="file-name">
                    <div className="file-icon">
                      <Folder size={16} />
                    </div>
                    {file.name}
                  </div>
                </td>
                <td className="file-size">{file.size}</td>
                <td className="file-date">{file.date}</td>
                <td className="text-right">
                  {file.status === 'downloading' ? (
                    <div className="download-progress">
                      <span className="download-progress__text">{file.progress}%</span>
                      <div className="download-progress__bar">
                        <div 
                          className="download-progress__fill" 
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : file.status === 'downloaded' ? (
                    <span className="badge badge--success">
                      <CheckCircle size={12} /> {t('ready')}
                    </span>
                  ) : (
                    <button className="btn-link">
                      <Download size={16} /> Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Downloads;

