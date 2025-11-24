import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { GetRecentActivities } from '../../wailsjs/go/main/App';

export const useActivities = (limit = 10) => {
  const { activities, setActivities } = useAppStore();

  const fetchActivities = async () => {
    try {
      const recentActivities = await GetRecentActivities(limit);
      setActivities(recentActivities || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setActivities([]);
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Refresh activities periodically (every 5 seconds)
    const interval = setInterval(() => {
      fetchActivities();
    }, 5000);

    return () => clearInterval(interval);
  }, [limit]);

  return {
    activities,
    refreshActivities: fetchActivities
  };
};

