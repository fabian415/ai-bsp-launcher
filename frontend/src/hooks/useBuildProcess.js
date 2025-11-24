import { useAppStore } from '../store/appStore';

export const useBuildProcess = (showNotification) => {
  const { buildStatus, progress, logs, setBuildStatus, setProgress, addLog, resetBuild } = useAppStore();

  const startProcess = (type) => {
    if (buildStatus !== 'ready' && buildStatus !== 'completed') return;
    
    const processType = type === 'build' ? 'building' : 'flashing';
    setBuildStatus(processType);
    resetBuild();
    setProgress(0);

    const steps = type === 'build' 
      ? [
          'Initializing build environment...',
          'Checking dependencies...',
          'Compiling kernel...',
          'Linking modules...',
          'Generating rootfs...',
          'Build Successful.'
        ]
      : [
          'Detecting device...',
          'Erasing partition...',
          'Flashing bootloader...',
          'Flashing system...',
          'Verifying checksum...',
          'Flash Complete.'
        ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setBuildStatus('completed');
        setProgress(100);
        
        // Show completion notification
        if (showNotification) {
          const title = type === 'build' ? 'Build Complete' : 'Flash Complete';
          const message = type === 'build' 
            ? 'Compilation has been completed successfully' 
            : 'Flashing process has been completed successfully';
          showNotification(title, message, 'success');
        }
        
        return;
      }

      const newLog = `[${new Date().toLocaleTimeString()}] ${steps[currentStep]}`;
      addLog(newLog);
      setProgress(Math.min((currentStep + 1) * (100 / steps.length), 99));
      currentStep++;
    }, 800);

    return () => clearInterval(interval);
  };

  return {
    buildStatus,
    progress,
    logs,
    startProcess,
    resetBuild
  };
};


