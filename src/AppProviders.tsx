import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import { PatientsProvider } from "@/context/PatientsContext";
import { BedsProvider } from "@/context/BedsContext";
import { PrescriptionsProvider } from "@/context/PrescriptionsContext";
import { SameProvider } from "@/context/SameContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { HRProvider } from "@/context/HRContext";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AuthProvider>
            <RoleProvider>
              <PatientsProvider>
                <BedsProvider>
                  <PrescriptionsProvider>
                    <SameProvider>
                      <InventoryProvider>
                        <HRProvider>
                          <TooltipProvider>
                            <Sonner />
                            {children}
                          </TooltipProvider>
                        </HRProvider>
                      </InventoryProvider>
                    </SameProvider>
                  </PrescriptionsProvider>
                </BedsProvider>
              </PatientsProvider>
            </RoleProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
