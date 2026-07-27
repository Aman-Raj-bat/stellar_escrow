import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './store/WalletContext';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';

import { Dashboard } from './pages/Dashboard';
import { CreateEscrow } from './pages/CreateEscrow';

export const App: React.FC = () => {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="escrow/create" element={<CreateEscrow />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
};
