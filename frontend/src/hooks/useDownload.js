import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { 
  StartDownload, 
  GetAllDownloads,
  PauseDownload,
  ResumeDownload,
  CancelDownload 
} from '../../wailsjs/go/main/App';

export const useDownload = () => {
  const { downloads, updateDownload, addDownload, removeDownload } = useAppStore();
  const pollingIntervalRef = useRef(null);
  const isPollingRef = useRef(false);

  // Start polling
  const startPolling = useCallback(() => {
    if (isPollingRef.current) return;
    
    console.log('Starting download polling');
    isPollingRef.current = true;
    
    const poll = async () => {
      try {
        const allDownloads = await GetAllDownloads();
        console.log('Polling downloads, got:', allDownloads.length, 'downloads');
        
        let hasActiveDownloads = false;
        allDownloads.forEach(download => {
          console.log('Download update:', {
            id: download.id,
            status: download.status,
            progress: download.progress,
            speed: download.speed,
            downloaded: download.downloadedBytes,
            total: download.totalBytes
          });
          
          updateDownload(download.id, download);
          
          // Check if there are any active downloads
          if (download.status === 'downloading' || download.status === 'queued') {
            hasActiveDownloads = true;
          }
        });
        
        // Stop polling if no active downloads
        if (!hasActiveDownloads && isPollingRef.current) {
          console.log('No active downloads, stopping polling');
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          isPollingRef.current = false;
        }
      } catch (error) {
        console.error('Error polling download progress:', error);
      }
    };
    
    // Start the interval
    pollingIntervalRef.current = setInterval(poll, 500); // Poll every 500ms
    
    // Also poll immediately
    poll();
  }, [updateDownload]);

  // Stop polling
  const stopPolling = useCallback(() => {
    console.log('Stopping download polling');
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Start a new download
  const startDownload = useCallback(async (url, fileName) => {
    try {
      console.log('Starting download:', { url, fileName });
      
      const downloadId = await StartDownload(url, fileName);
      console.log('Download started with ID:', downloadId);
      
      const newDownload = {
        id: downloadId,
        url,
        fileName,
        status: 'downloading',
        progress: 0,
        speed: 0,
        remainingTime: 0,
        downloadedBytes: 0,
        totalBytes: 0,
        error: '',
      };

      addDownload(newDownload);
      
      // Start polling for updates
      startPolling();
      
      return downloadId;
    } catch (error) {
      console.error('Error starting download:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Error string:', String(error));
      throw new Error(error?.message || String(error) || 'Unknown error');
    }
  }, [addDownload, startPolling]);

  // Pause a download
  const pauseDownload = useCallback(async (downloadId) => {
    try {
      console.log('Pausing download:', downloadId);
      
      await PauseDownload(downloadId);
      
      updateDownload(downloadId, { status: 'paused' });
    } catch (error) {
      console.error('Error pausing download:', error);
      throw error;
    }
  }, [updateDownload]);

  // Resume a download
  const resumeDownload = useCallback(async (downloadId) => {
    try {
      console.log('Resuming download:', downloadId);
      
      await ResumeDownload(downloadId);
      
      updateDownload(downloadId, { status: 'downloading' });
      
      // Start polling for updates
      startPolling();
    } catch (error) {
      console.error('Error resuming download:', error);
      throw error;
    }
  }, [updateDownload, startPolling]);

  // Cancel a download
  const cancelDownload = useCallback(async (downloadId) => {
    try {
      console.log('Cancelling download:', downloadId);
      
      await CancelDownload(downloadId);
      
      removeDownload(downloadId);
    } catch (error) {
      console.error('Error cancelling download:', error);
      throw error;
    }
  }, [removeDownload]);

  // Load all downloads on mount
  const loadDownloads = useCallback(async () => {
    try {
      console.log('Loading all downloads...');
      const allDownloads = await GetAllDownloads();
      console.log('Loaded downloads:', allDownloads);
      
      let hasActiveDownloads = false;
      allDownloads.forEach(download => {
        addDownload(download);
        if (download.status === 'downloading' || download.status === 'queued') {
          hasActiveDownloads = true;
        }
      });
      
      // Start polling if there are active downloads
      if (hasActiveDownloads) {
        startPolling();
      }
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
  }, [addDownload, startPolling]);

  // Format bytes to human-readable string
  const formatBytes = useCallback((bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  // Format speed to human-readable string
  const formatSpeed = useCallback((bytesPerSecond) => {
    if (bytesPerSecond === 0) return '0 KB/s';
    if (bytesPerSecond < 1024 * 1024) {
      return (bytesPerSecond / 1024).toFixed(0) + ' KB/s';
    }
    return (bytesPerSecond / (1024 * 1024)).toFixed(1) + ' MB/s';
  }, []);

  // Format time remaining to human-readable string
  const formatTimeRemaining = useCallback((seconds) => {
    if (seconds === 0 || !isFinite(seconds)) return '--';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }, []);

  return {
    downloads,
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    loadDownloads,
    formatBytes,
    formatSpeed,
    formatTimeRemaining,
  };
};

