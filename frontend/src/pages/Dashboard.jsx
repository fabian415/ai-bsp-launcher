import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, FileCode, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useWails } from '../hooks/useWails';
import { useActivities } from '../hooks/useActivities';
import './Dashboard.scss';

const Dashboard = () => {
  const { t } = useTranslation();
  const { getSystemMetrics } = useWails();
  const { activities } = useActivities(10);
  
  const [metrics, setMetrics] = useState({
    cpu: { usagePercent: 0 },
    memory: { usedGB: 0, totalGB: 0, usedPercent: 0 },
    disk: { usedGB: 0, totalGB: 0, usedPercent: 0, path: '' }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch system metrics
  const fetchMetrics = async () => {
    try {
      const data = await getSystemMetrics();
      setMetrics(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      setIsLoading(false);
    }
  };

  // Set up polling interval (2 seconds)
  useEffect(() => {
    // Fetch immediately on mount
    fetchMetrics();

    // Set up interval for subsequent fetches
    const intervalId = setInterval(fetchMetrics, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this runs once on mount

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">{t('dashboard')}</h2>
      
      {/* Stats Cards */}
      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__header">
            <h3 className="stat-card__label">{t('cpuUsage')}</h3>
            <Activity className="stat-card__icon stat-card__icon--blue" size={20} />
          </div>
          <div className="stat-card__value">
            {isLoading ? 'Loading...' : `${metrics.cpu.usagePercent.toFixed(1)}%`}
          </div>
          <div className="stat-card__bar">
            <div 
              className="stat-card__progress stat-card__progress--blue" 
              style={{ width: `${Math.min(metrics.cpu.usagePercent, 100)}%` }} 
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <h3 className="stat-card__label">{t('ramUsage')}</h3>
            <Cpu className="stat-card__icon stat-card__icon--purple" size={20} />
          </div>
          <div className="stat-card__value">
            {isLoading 
              ? 'Loading...' 
              : `${metrics.memory.usedGB.toFixed(1)} GB / ${metrics.memory.totalGB.toFixed(1)} GB`
            }
          </div>
          <div className="stat-card__bar">
            <div 
              className="stat-card__progress stat-card__progress--purple" 
              style={{ width: `${Math.min(metrics.memory.usedPercent, 100)}%` }} 
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <h3 className="stat-card__label">{t('diskUsage')}</h3>
            <HardDrive className="stat-card__icon stat-card__icon--green" size={20} />
          </div>
          <div className="stat-card__value">
            {isLoading 
              ? 'Loading...' 
              : `${metrics.disk.usedGB.toFixed(0)} GB / ${metrics.disk.totalGB.toFixed(0)} GB`
            }
          </div>
          <div className="stat-card__bar">
            <div 
              className="stat-card__progress stat-card__progress--green" 
              style={{ width: `${Math.min(metrics.disk.usedPercent, 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">{t('recentActivity')}</h3>
        </div>
        <div className="activity-list">
          {activities.length === 0 ? (
            <div className="activity-item activity-item--empty">
              <p className="activity-item__empty-text">No recent activities</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-item__icon ${activity.status === 'success' ? 'activity-item__icon--success' : 'activity-item__icon--error'}`}>
                  {activity.status === 'success' ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>
                <div className="activity-item__content">
                  <div className="activity-item__header">
                    <span className="activity-item__title">
                      {activity.operation.charAt(0).toUpperCase() + activity.operation.slice(1)} {activity.platformName}
                    </span>
                    <span className="activity-item__time">{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                  <p className="activity-item__description">
                    {activity.status === 'success' 
                      ? `Completed successfully in ${formatDuration(activity.duration)}`
                      : `Failed: ${activity.error || 'Unknown error'}`
                    }
                  </p>
                  <span className={`activity-item__badge activity-item__badge--${activity.bootOption}`}>
                    {activity.bootOption === 'sd' ? 'SD Card' : 'eMMC'} Boot
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

