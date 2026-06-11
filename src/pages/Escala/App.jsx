import { Toaster } from "@/pages/Escala/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/pages/Escala/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/pages/Escala/lib/AuthContext";
import UserNotRegisteredError from "@/pages/Escala/components/UserNotRegisteredError";

import AppLayout from "@/pages/Escala/components/layout/AppLayout";
import Dashboard from "@/pages/Escala/pages/Dashboard";
import NewEmployee from "@/pages/Escala/pages/NewEmployee";
import SearchPage from "@/pages/Escala/pages/Search";
import Management from "@/pages/Escala/pages/Management";
import Certificates from "@/pages/Escala/pages/Certificates";
import Reports from "@/pages/Escala/pages/Reports";
import EscalaControl from "@/pages/Escala/pages/EscalaControl";

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/novo" element={<NewEmployee />} />
        <Route path="/pesquisar" element={<SearchPage />} />
        <Route path="/gerenciamento" element={<Management />} />
        <Route path="/atestados" element={<Certificates />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="/escala-control" element={<EscalaControl />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
