import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "diretoria" | "medico" | "enfermeiro";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRoleState] = useState<Role>(() => {
    const savedRole = localStorage.getItem("simulated_role");
    return (savedRole as Role) || "diretoria";
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("simulated_role", newRole);

    // Automatically redirect based on role
    if (newRole === "medico") {
      window.location.href = "/painel-medico";
    } else if (newRole === "enfermeiro") {
      window.location.href = "/painel-enfermagem";
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
