/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import { seedMenu } from './seed';
import { useState, useEffect } from 'react';
import MenuPage from './pages/MenuPage';
import AdminPanel from './pages/AdminPanel';
import DriverPanel from './pages/DriverPanel';
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedMenu();
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<div className="p-12 text-center text-4xl font-light tracking-tight">Welcome to Ramyasri Food & Beverage</div>} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/driver" element={<DriverPanel />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
