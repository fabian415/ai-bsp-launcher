// This hook encapsulates Wails API calls
import { 
  GetSystemMetrics, 
  GetCPUUsage, 
  GetMemoryUsage, 
  GetDiskUsage,
  SaveSettings,
  GetSettings,
  GetWorkspacePath,
  SetWorkspacePath,
  SelectDirectory
} from '../../wailsjs/go/main/App';

export const useWails = () => {
  // File Operations
  const selectDirectory = async () => {
    try {
      const result = await SelectDirectory();
      console.log('Selected directory:', result);
      return result || null;
    } catch (error) {
      console.error('Error selecting directory:', error);
      return null;
    }
  };

  // System Metrics
  /**
   * Get all system metrics (CPU, memory, disk) in one call
   * @returns {Promise<{cpu: {usagePercent: number}, memory: {usedGB: number, totalGB: number, usedPercent: number}, disk: {usedGB: number, totalGB: number, usedPercent: number, path: string}}>}
   */
  const getSystemMetrics = async () => {
    try {
      return await GetSystemMetrics();
    } catch (error) {
      console.error('Error getting system metrics:', error);
      return {
        cpu: { usagePercent: 0 },
        memory: { usedGB: 0, totalGB: 0, usedPercent: 0 },
        disk: { usedGB: 0, totalGB: 0, usedPercent: 0, path: '' }
      };
    }
  };

  /**
   * Get CPU usage percentage
   * @returns {Promise<{usagePercent: number}>}
   */
  const getCPUUsage = async () => {
    try {
      return await GetCPUUsage();
    } catch (error) {
      console.error('Error getting CPU usage:', error);
      return { usagePercent: 0 };
    }
  };

  /**
   * Get memory usage in GB
   * @returns {Promise<{usedGB: number, totalGB: number, usedPercent: number}>}
   */
  const getMemoryUsage = async () => {
    try {
      return await GetMemoryUsage();
    } catch (error) {
      console.error('Error getting memory usage:', error);
      return { usedGB: 0, totalGB: 0, usedPercent: 0 };
    }
  };

  /**
   * Get disk usage for primary system disk
   * @returns {Promise<{usedGB: number, totalGB: number, usedPercent: number, path: string}>}
   */
  const getDiskUsage = async () => {
    try {
      return await GetDiskUsage();
    } catch (error) {
      console.error('Error getting disk usage:', error);
      return { usedGB: 0, totalGB: 0, usedPercent: 0, path: '' };
    }
  };

  // Settings Management
  const saveSettings = async (workspacePath, proxyURL, notificationsEnabled) => {
    try {
      console.log('Saving settings:', { workspacePath, proxyURL, notificationsEnabled });
      await SaveSettings(workspacePath, proxyURL, notificationsEnabled);
      console.log('Settings saved successfully');
      
      // Verify the settings were saved
      const savedSettings = await GetSettings();
      console.log('Verified saved settings:', savedSettings);
      
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      console.error('Error details:', error?.message || String(error));
      throw error;
    }
  };

  const getSettings = async () => {
    try {
      const settings = await GetSettings();
      console.log('Settings retrieved:', settings);
      return settings;
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  };

  const getWorkspacePath = async () => {
    try {
      const path = await GetWorkspacePath();
      console.log('Workspace path retrieved:', path);
      return path;
    } catch (error) {
      console.error('Error getting workspace path:', error);
      return '';
    }
  };

  const setWorkspacePath = async (path) => {
    try {
      await SetWorkspacePath(path);
      console.log('Workspace path set to:', path);
      return true;
    } catch (error) {
      console.error('Error setting workspace path:', error);
      throw error;
    }
  };

  return {
    selectDirectory,
    getSystemMetrics,
    getCPUUsage,
    getMemoryUsage,
    getDiskUsage,
    saveSettings,
    getSettings,
    getWorkspacePath,
    setWorkspacePath
  };
};

