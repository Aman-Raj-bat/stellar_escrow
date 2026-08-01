import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './store/WalletContext';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { Dashboard } from './pages/Dashboard';
import { CreateEscrow } from './pages/CreateEscrow';
import { EscrowDetail } from './pages/EscrowDetail';

import { HowItWorks } from './pages/HowItWorks';
import { Docs } from './pages/Docs';
import { About } from './pages/About';

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
              <Route path="how-it-works" element={<HowItWorks />} />
              <Route path="docs" element={<Docs />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </ErrorBoundary>
  );
};
