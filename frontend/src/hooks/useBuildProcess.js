import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { BuildPlatform, FlashPlatform, CancelBuildFlash } from '../../wailsjs/go/main/App';
import { EventsOn, EventsOff } from '../../wailsjs/runtime/runtime';

export const useBuildProcess = (showNotification) => {
  const { buildStatus, progress, logs, setBuildStatus, setProgress, addLog, resetBuild, selectedPlatform } = useAppStore();
  const listenerCleanupRef = useRef([]);

  useEffect(() => {
    // Setup event listeners for build/flash logs
    const logListener = EventsOn('build:log', (data) => {
      const timestamp = new Date().toLocaleTimeString();
      const logMessage = `[${timestamp}] ${data.message}`;
      addLog(logMessage);
    });

    const completeListener = EventsOn('build:complete', (data) => {
      setBuildStatus('completed');
      setProgress(100);
      
      if (showNotification) {
        const title = `${data.operation.charAt(0).toUpperCase() + data.operation.slice(1)} Complete`;
        const message = `${data.platform} ${data.operation} completed successfully`;
        showNotification(title, message, 'success');
      }
    });

    const errorListener = EventsOn('build:error', (data) => {
      setBuildStatus('failed');
      addLog(`❌ Error: ${data.error}`);
      
      if (showNotification) {
        showNotification('Operation Failed', data.error, 'error');
      }
    });

    const cancelledListener = EventsOn('build:cancelled', (data) => {
      setBuildStatus('ready');
      addLog(`⚠️ ${data.operation.charAt(0).toUpperCase() + data.operation.slice(1)} cancelled by user`);
      
      if (showNotification) {
        showNotification('Operation Cancelled', `${data.platform} ${data.operation} was cancelled`, 'info');
      }
    });

    // Store cleanup functions
    listenerCleanupRef.current = [logListener, completeListener, errorListener, cancelledListener];

    return () => {
      // Cleanup event listeners
      listenerCleanupRef.current.forEach(cleanup => cleanup());
    };
  }, [addLog, setBuildStatus, setProgress, showNotification]);

  const startProcess = async (type, platformID, bootOption) => {
    if (buildStatus !== 'ready' && buildStatus !== 'completed') {
      console.warn('Another operation is already in progress');
      return;
    }
    
    if (!platformID) {
      if (showNotification) {
        showNotification('Error', 'Please select a platform first', 'error');
      }
      return;
    }

    if (!bootOption) {
      bootOption = 'sd'; // Default to SD card
    }

    const processType = type === 'build' ? 'building' : 'flashing';
    setBuildStatus(processType);
    resetBuild();
    setProgress(0);

    try {
      if (type === 'build') {
        await BuildPlatform(platformID, bootOption);
      } else if (type === 'flash') {
        await FlashPlatform(platformID, bootOption);
      }
    } catch (error) {
      console.error('Failed to start operation:', error);
      setBuildStatus('failed');
      addLog(`❌ Error: ${error.message || error}`);
      
      if (showNotification) {
        showNotification('Operation Failed', error.message || 'Failed to start operation', 'error');
      }
    }
  };

  const cancelProcess = async () => {
    try {
      await CancelBuildFlash();
    } catch (error) {
      console.error('Failed to cancel operation:', error);
      if (showNotification) {
        showNotification('Cancel Failed', error.message || 'Failed to cancel operation', 'error');
      }
    }
  };

  return {
    buildStatus,
    progress,
    logs,
    startProcess,
    cancelProcess,
    resetBuild
  };
};


