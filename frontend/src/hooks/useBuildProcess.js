import { useAppStore } from '../store/appStore';

export const useBuildProcess = () => {
  const { buildStatus, progress, logs, setBuildStatus, setProgress, addLog, resetBuild } = useAppStore();

  const startProcess = (type) => {
    if (buildStatus !== 'ready' && buildStatus !== 'completed') return;
    
    setBuildStatus(type === 'build' ? 'building' : 'flashing');
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

