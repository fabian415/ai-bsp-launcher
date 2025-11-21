import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../assets/styles/layout.scss';

const DefaultLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content-workspace">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;

