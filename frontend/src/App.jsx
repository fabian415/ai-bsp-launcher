import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';

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

  useEffect(() => {
    initialize();
  }, [initialize]);

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

