// This hook encapsulates Wails API calls
// Import actual Wails generated functions when available
// Example: import { ValidateImageExisted, GetConfig } from '../../wailsjs/go/main/App';
import { GetSystemMetrics, GetCPUUsage, GetMemoryUsage, GetDiskUsage } from '../../wailsjs/go/main/App';

export const useWails = () => {
  // Platform Management
  const validateImageExisted = async (path) => {
    try {
      // TODO: Replace with actual Wails call
      // return await ValidateImageExisted(path);
      console.log('Validating image:', path);
      return true;
    } catch (error) {
      console.error('Error validating image:', error);
      return false;
    }
  };

  // Config Management
  const getConfig = async () => {
    try {
      // TODO: Replace with actual Wails call
      // return await GetConfig();
      console.log('Getting config');
      return {};
    } catch (error) {
      console.error('Error getting config:', error);
      return null;
    }
  };

  const saveConfig = async (config) => {
    try {
      // TODO: Replace with actual Wails call
      // return await SaveConfig(config);
      console.log('Saving config:', config);
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  };

  // Build Operations
  const startBuild = async (platform, options) => {
    try {
      // TODO: Replace with actual Wails call
      // return await StartBuild(platform, options);
      console.log('Starting build for platform:', platform, options);
      return { success: true };
    } catch (error) {
      console.error('Error starting build:', error);
      return { success: false, error: error.message };
    }
  };

  const flashImage = async (platform, imagePath) => {
    try {
      // TODO: Replace with actual Wails call
      // return await FlashImage(platform, imagePath);
      console.log('Flashing image:', platform, imagePath);
      return { success: true };
    } catch (error) {
      console.error('Error flashing image:', error);
      return { success: false, error: error.message };
    }
  };

  // File Operations
  const selectDirectory = async () => {
    try {
      // TODO: Use Wails runtime dialog
      // const result = await window.runtime.Dialog.SelectDirectory();
      console.log('Selecting directory');
      return '/home/user/bsp_workspace';
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

  return {
    validateImageExisted,
    getConfig,
    saveConfig,
    startBuild,
    flashImage,
    selectDirectory,
    getSystemMetrics,
    getCPUUsage,
    getMemoryUsage,
    getDiskUsage
  };
};

