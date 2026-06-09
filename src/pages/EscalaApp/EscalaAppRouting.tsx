import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import NewEmployee from './pages/NewEmployee';
import SearchPage from './pages/Search';
import Management from './pages/Management';
import Certificates from './pages/Certificates';
import Reports from './pages/Reports';
import EscalaControl from './pages/EscalaControl';

export default function EscalaAppRouting() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="novo" element={<NewEmployee />} />
        <Route path="pesquisar" element={<SearchPage />} />
        <Route path="gerenciamento" element={<Management />} />
        <Route path="atestados" element={<Certificates />} />
        <Route path="relatorios" element={<Reports />} />
        <Route path="/" element={<EscalaControl />} />
      </Route>
    </Routes>
  );
}
