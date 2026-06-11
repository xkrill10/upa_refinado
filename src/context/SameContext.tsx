import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DocumentRequest {
  id: string;
  patient: string;
  type: string;
  date: string;
  status: "Pendente" | "Em processamento" | "Pronto";
}

export interface DigitalUpload {
  id: string;
  patient: string;
  type: string;
  date: string;
  size: string;
  professional: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  date: string;
  severity: "low" | "medium" | "high";
}

interface SameContextData {
  documentRequests: DocumentRequest[];
  digitalUploads: DigitalUpload[];
  auditLogs: AuditLog[];
  addDocumentRequest: (
    request: Omit<DocumentRequest, "id" | "date" | "status">,
  ) => void;
  updateRequestStatus: (id: string, status: DocumentRequest["status"]) => void;
  addDigitalUpload: (upload: Omit<DigitalUpload, "id" | "date">) => void;
  addAuditLog: (log: Omit<AuditLog, "id" | "time" | "date">) => void;
}

const SameContext = createContext<SameContextData>({} as SameContextData);

export function SameProvider({ children }: { children: ReactNode }) {
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([
    {
      id: "REQ001",
      patient: "Maria Silva",
      type: "Cópia de Prontuário",
      date: "12/05/2026",
      status: "Pronto",
    },
    {
      id: "REQ002",
      patient: "João Santos",
      type: "Laudo Médico",
      date: "11/05/2026",
      status: "Em processamento",
    },
    {
      id: "REQ003",
      patient: "Ana Oliveira",
      type: "Exames de Imagem",
      date: "10/05/2026",
      status: "Pronto",
    },
  ]);

  const [digitalUploads, setDigitalUploads] = useState<DigitalUpload[]>([
    {
      id: "UP001",
      patient: "Noah Almeida",
      type: "Evolução Médica",
      size: "2.4 MB",
      date: "Hoje, 10:45",
      professional: "Dr. Ricardo Braga",
    },
    {
      id: "UP002",
      patient: "Helena Santos",
      type: "Exame de Imagem",
      size: "15.8 MB",
      date: "Hoje, 09:12",
      professional: "Dra. Carla Mendes",
    },
    {
      id: "UP003",
      patient: "João Santos",
      type: "Receituário",
      size: "1.1 MB",
      date: "Ontem, 16:30",
      professional: "Dra. Beatriz Santos",
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "LOG001",
      user: "Dr. Ricardo Braga",
      action: "Acessou Prontuário",
      target: "Maria Silva",
      time: "10:45",
      date: "12/05/2026",
      severity: "low",
    },
    {
      id: "LOG002",
      user: "Enf. Ana Paula",
      action: "Digitalizou Exame",
      target: "João Santos",
      time: "09:30",
      date: "12/05/2026",
      severity: "low",
    },
    {
      id: "LOG003",
      user: "Admin",
      action: "Alterou Localização",
      target: "CX-12 / ALA-A",
      time: "08:15",
      date: "12/05/2026",
      severity: "medium",
    },
    {
      id: "LOG004",
      user: "Dr. Paulo Souza",
      action: "Exportou Prontuário",
      target: "Ana Oliveira",
      time: "16:40",
      date: "11/05/2026",
      severity: "high",
    },
  ]);

  const addDocumentRequest = (
    request: Omit<DocumentRequest, "id" | "date" | "status">,
  ) => {
    const newRequest: DocumentRequest = {
      ...request,
      id: `REQ${String(documentRequests.length + 1).padStart(3, "0")}`,
      date: new Date().toLocaleDateString("pt-BR"),
      status: "Pendente",
    };
    setDocumentRequests((prev) => [newRequest, ...prev]);
  };

  const updateRequestStatus = (
    id: string,
    status: DocumentRequest["status"],
  ) => {
    setDocumentRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req)),
    );
  };

  const addDigitalUpload = (upload: Omit<DigitalUpload, "id" | "date">) => {
    const newUpload: DigitalUpload = {
      ...upload,
      id: `UP${String(digitalUploads.length + 1).padStart(3, "0")}`,
      date: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setDigitalUploads((prev) => [newUpload, ...prev]);
  };

  const addAuditLog = (log: Omit<AuditLog, "id" | "time" | "date">) => {
    const now = new Date();
    const newLog: AuditLog = {
      ...log,
      id: `LOG${String(auditLogs.length + 1).padStart(3, "0")}`,
      time: now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: now.toLocaleDateString("pt-BR"),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <SameContext.Provider
      value={{
        documentRequests,
        digitalUploads,
        auditLogs,
        addDocumentRequest,
        updateRequestStatus,
        addDigitalUpload,
        addAuditLog,
      }}
    >
      {children}
    </SameContext.Provider>
  );
}

export function useSame() {
  const context = useContext(SameContext);
  if (!context) {
    throw new Error("useSame must be used within a SameProvider");
  }
  return context;
}
