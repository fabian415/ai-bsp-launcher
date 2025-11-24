import React, { useEffect, useState } from 'react';
import { 
  RefreshCw, 
  Folder, 
  Download, 
  CheckCircle, 
  Pause, 
  Play, 
  X, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useDownload } from '../hooks/useDownload';
import { MOCK_DOWNLOADS } from '../utils/constants';
import './Downloads.scss';

const Downloads = () => {
  const { t } = useTranslation();
  const {
    downloads,
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    loadDownloads,
    formatBytes,
    formatSpeed,
    formatTimeRemaining,
  } = useDownload();

  const [availableDownloads] = useState(MOCK_DOWNLOADS);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  const handleStartDownload = async (file) => {
    try {
      // Check if there's a failed download for this file, remove it first
      const existingDownload = downloads.find(d => d.url === file.url);
      if (existingDownload && existingDownload.status === 'failed') {
        console.log('Removing failed download before retry:', existingDownload.id);
        // Remove the failed download from backend
        try {
          await cancelDownload(existingDownload.id);
        } catch (e) {
          console.warn('Could not cancel old download:', e);
        }
      }
      
      await startDownload(file.url, file.fileName);
    } catch (error) {
      console.error('Failed to start download:', error);
      alert(`Failed to start download: ${error.message}`);
    }
  };

  const handlePause = async (downloadId) => {
    try {
      await pauseDownload(downloadId);
    } catch (error) {
      console.error('Failed to pause download:', error);
    }
  };

  const handleResume = async (downloadId) => {
    try {
      await resumeDownload(downloadId);
    } catch (error) {
      console.error('Failed to resume download:', error);
    }
  };

  const handleCancel = async (downloadId, downloadedBytes) => {
    const sizeInGB = downloadedBytes / (1024 * 1024 * 1024);
    if (sizeInGB > 0.1) {
      const confirmed = window.confirm(
        `Cancel download? ${formatBytes(downloadedBytes)} will be lost.`
      );
      if (!confirmed) return;
    }

    try {
      await cancelDownload(downloadId);
    } catch (error) {
      console.error('Failed to cancel download:', error);
    }
  };

  const handleRefresh = () => {
    loadDownloads();
  };

  const getDownloadForSample = (sampleId) => {
    return downloads.find(d => 
      d.url === availableDownloads.find(s => s.id === sampleId)?.url
    );
  };

  const renderDownloadActions = (sample) => {
    const activeDownload = getDownloadForSample(sample.id);

    if (activeDownload) {
      const { status, progress, speed, remainingTime, error, downloadedBytes, totalBytes } = activeDownload;

      if (status === 'downloading') {
        return (
          <div className="download-active">
            <div className="download-active__info">
              <div className="download-active__progress-text">
                {progress.toFixed(1)}% • {formatSpeed(speed)} • {formatTimeRemaining(remainingTime)}
              </div>
              <div className="download-active__bytes">
                {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}
              </div>
            </div>
            <div className="download-progress__bar">
              <div 
                className="download-progress__fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="download-active__actions">
              <button 
                className="btn-icon btn-icon--sm"
                onClick={() => handlePause(activeDownload.id)}
                title="Pause"
              >
                <Pause size={14} />
              </button>
              <button 
                className="btn-icon btn-icon--sm btn-icon--danger"
                onClick={() => handleCancel(activeDownload.id, downloadedBytes)}
                title="Cancel"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      }

      if (status === 'paused') {
        return (
          <div className="download-active">
            <div className="download-active__info">
              <div className="download-active__progress-text">
                Paused at {progress.toFixed(1)}%
              </div>
              <div className="download-active__bytes">
                {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}
              </div>
            </div>
            <div className="download-progress__bar">
              <div 
                className="download-progress__fill download-progress__fill--paused" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="download-active__actions">
              <button 
                className="btn-icon btn-icon--sm btn-icon--primary"
                onClick={() => handleResume(activeDownload.id)}
                title="Resume"
              >
                <Play size={14} />
              </button>
              <button 
                className="btn-icon btn-icon--sm btn-icon--danger"
                onClick={() => handleCancel(activeDownload.id, downloadedBytes)}
                title="Cancel"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      }

      if (status === 'queued') {
        return (
          <div className="download-queued">
            <Clock size={14} />
            <span>Waiting in queue...</span>
            <button 
              className="btn-icon btn-icon--sm btn-icon--danger"
              onClick={() => handleCancel(activeDownload.id, 0)}
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        );
      }

      if (status === 'completed') {
        return (
          <span className="badge badge--success">
            <CheckCircle size={12} /> {t('ready')}
          </span>
        );
      }

      if (status === 'failed') {
        return (
          <div className="download-failed">
            <span className="badge badge--error">
              <AlertCircle size={12} /> Failed
            </span>
            <span className="download-failed__error">{error}</span>
            <button 
              className="btn-link"
              onClick={() => handleStartDownload(sample)}
            >
              Retry
            </button>
          </div>
        );
      }
    }

    return (
      <button 
        className="btn-link"
        onClick={() => handleStartDownload(sample)}
      >
        <Download size={16} /> Download
      </button>
    );
  };

  return (
    <div className="downloads">
      <div className="downloads__header">
        <h2 className="downloads__title">{t('downloadCenter')}</h2>
        <button className="btn btn--icon" onClick={handleRefresh}>
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="downloads-table">
        <table>
          <thead>
            <tr>
              <th>{t('fileName')}</th>
              <th>Description</th>
              <th>{t('size')}</th>
              <th className="text-right">{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {availableDownloads.map((file) => (
              <tr key={file.id}>
                <td>
                  <div className="file-name">
                    <div className="file-icon">
                      <Folder size={16} />
                    </div>
                    {file.name}
                  </div>
                </td>
                <td className="file-description">{file.description}</td>
                <td className="file-size">{file.size}</td>
                <td className="text-right action-cell">
                  {renderDownloadActions(file)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {downloads.length > 0 && (
        <div className="downloads__summary">
          <p>
            Active downloads: {downloads.filter(d => d.status === 'downloading').length} | 
            Completed: {downloads.filter(d => d.status === 'completed').length} | 
            Total: {downloads.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default Downloads;

