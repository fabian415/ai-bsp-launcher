import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, FileCode } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useWails } from '../hooks/useWails';
import './Dashboard.scss';

const Dashboard = () => {
  const { t } = useTranslation();
  const { getSystemMetrics } = useWails();
  
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

  const recentActivities = [
    { id: 1, title: 'Build QSC-8250 Kernel', time: '2 hours ago', duration: '14m 20s' },
    { id: 2, title: 'Flash AGX-Orin Image', time: '5 hours ago', duration: '8m 45s' },
    { id: 3, title: 'Build RK3588 Bootloader', time: '1 day ago', duration: '6m 12s' },
  ];

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
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-item__icon">
                <FileCode size={18} />
              </div>
              <div className="activity-item__content">
                <div className="activity-item__header">
                  <span className="activity-item__title">{activity.title}</span>
                  <span className="activity-item__time">{activity.time}</span>
                </div>
                <p className="activity-item__description">
                  Completed successfully in {activity.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

