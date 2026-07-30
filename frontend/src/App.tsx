import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './store/WalletContext';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { Dashboard } from './pages/Dashboard';
import { CreateEscrow } from './pages/CreateEscrow';
import { EscrowDetail } from './pages/EscrowDetail';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="escrow/create" element={<CreateEscrow />} />
              <Route path="escrow/:id" element={<EscrowDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </ErrorBoundary>
  );
};
