import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import "@/api/dbClient";

import EscalaDashboard from "../../pages/EscalaDashboard";
import NewEmployee from "../../pages/NewEmployee";
import SearchPage from "../../pages/Search";
import Management from "../../pages/Management";
import Certificates from "../../pages/Certificates";
import EscalaReports from "../../pages/EscalaReports";
import EscalaControl from "../../pages/EscalaControl";
import { AuthProvider } from "../../lib/AuthContext";

export default function EscalaAppRouting() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<EscalaDashboard />} />
          <Route path="novo" element={<NewEmployee />} />
          <Route path="pesquisar" element={<SearchPage />} />
          <Route path="gerenciamento" element={<Management />} />
          <Route path="atestados" element={<Certificates />} />
          <Route path="relatorios" element={<EscalaReports />} />
          <Route path="/" element={<EscalaControl />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
