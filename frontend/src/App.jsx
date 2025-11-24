import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import { useNotifications } from './hooks/useNotifications';

// Layouts
import DefaultLayout from './layouts/DefaultLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Platforms from './pages/Platforms';
import Downloads from './pages/Downloads';
import Settings from './pages/Settings';
import PlatformWorkspace from './pages/PlatformWorkspace';

// Styles
import './assets/styles/base.scss';

function App() {
  const { isAuthenticated, selectedPlatform, initialize } = useAppStore();
  const { requestPermission, checkPermission } = useNotifications();

  useEffect(() => {
    initialize();
    
    // Request notification permission if not already granted
    const permission = checkPermission();
    if (permission === 'default') {
      requestPermission();
    }
  }, [initialize, requestPermission, checkPermission]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <HashRouter>
      <DefaultLayout>
        {selectedPlatform ? (
          <PlatformWorkspace />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/platforms" element={<Platforms />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </DefaultLayout>
    </HashRouter>
  );
}

export default App;


