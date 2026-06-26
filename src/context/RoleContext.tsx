import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "diretoria" | "medico" | "enfermeiro" | "recepcao";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<Role>(() => {
    let initialRole: Role = "diretoria";
    const savedRole = localStorage.getItem("simulated_role");
    
    // Auto-sync role based on the current URL
    if (window.location.pathname === "/") {
      initialRole = "diretoria";
    } else if (window.location.pathname.startsWith("/painel-enfermagem")) {
      initialRole = "enfermeiro";
    } else if (window.location.pathname.startsWith("/painel-medico")) {
      initialRole = "medico";
    } else {
      initialRole = (savedRole as Role) || "diretoria";
    }
    
    if (initialRole !== savedRole) {
      localStorage.setItem("simulated_role", initialRole);
    }
    
    return initialRole;
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("simulated_role", newRole);

    // Automatically redirect based on role
    if (newRole === "medico") {
      window.location.href = "/painel-medico";
    } else if (newRole === "enfermeiro") {
      window.location.href = "/painel-enfermagem";
    } else if (newRole === "recepcao") {
      window.location.href = "/novo-paciente";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
