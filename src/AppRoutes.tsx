import React from "react";
import { Route, Routes } from "react-router-dom";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Pharmacy = React.lazy(() => import("./pages/Pharmacy"));
const SatellitePharmacy = React.lazy(() => import("./pages/SatellitePharmacy"));
const Sectors = React.lazy(() => import("./pages/Sectors"));
const Queue = React.lazy(() => import("./pages/Queue"));
const NewPatient = React.lazy(() => import("./pages/NewPatient"));
const Triage = React.lazy(() => import("./pages/Triage"));
const Arrival = React.lazy(() => import("./pages/Arrival"));
const Attendances = React.lazy(() => import("./pages/Attendances"));
const Beds = React.lazy(() => import("./pages/Beds"));
const PatientRecord = React.lazy(() => import("./pages/PatientRecord"));
const SUSIntegration = React.lazy(() => import("./pages/SUSIntegration"));
const Patients = React.lazy(() => import("./pages/Patients"));
const CallPanel = React.lazy(() => import("./pages/CallPanel"));
const PatientEvolution = React.lazy(() => import("./pages/PatientEvolution"));
const EvolucaoMedica = React.lazy(() => import("./pages/EvolucaoMedica"));
const EvolucaoEnfermagem = React.lazy(() => import("./pages/EvolucaoEnfermagem"));
const AnotacaoEnfermagem = React.lazy(() => import("./pages/AnotacaoEnfermagem"));
const EvolucaoFisioterapia = React.lazy(() => import("./pages/EvolucaoFisioterapia"));
const EvolucaoNutricao = React.lazy(() => import("./pages/EvolucaoNutricao"));
const EvolucaoPsicologia = React.lazy(() => import("./pages/EvolucaoPsicologia"));
const EvolucaoServicoSocial = React.lazy(() => import("./pages/EvolucaoServicoSocial"));
const EvolucaoTerapiaOcupacional = React.lazy(() => import("./pages/EvolucaoTerapiaOcupacional"));
const EvolucaoFonoaudiologia = React.lazy(() => import("./pages/EvolucaoFonoaudiologia"));
const EvolucaoFarmaciaClinica = React.lazy(() => import("./pages/EvolucaoFarmaciaClinica"));
const UserManagement = React.lazy(() => import("./pages/Admin/UserManagement"));
const AuditLogs = React.lazy(() => import("./pages/Admin/AuditLogs"));
const BackupAdmin = React.lazy(() => import("./pages/Admin/BackupAdmin"));
const Consentimentos = React.lazy(() => import("./pages/Admin/Consentimentos"));
const RetencaoDados = React.lazy(() => import("./pages/Admin/RetencaoDados"));
const Anonimizacao = React.lazy(() => import("./pages/Admin/Anonimizacao"));
const CentralIntegracoes = React.lazy(
  () => import("./pages/Admin/CentralIntegracoes"),
);
const Reports = React.lazy(() => import("./pages/Reports"));
const HR = React.lazy(() => import("./pages/HR"));
const Same = React.lazy(() => import("./pages/Same"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Pediatria = React.lazy(() => import("./pages/Pediatria"));
const AtendimentosPediatrico = React.lazy(
  () => import("./pages/AtendimentosPediatrico"),
);
const MyHR = React.lazy(() => import("./pages/MyHR"));
const DoctorDashboard = React.lazy(() => import("./pages/DoctorDashboard"));
const NurseDashboard = React.lazy(() => import("./pages/NurseDashboard"));
const MyWorkspace = React.lazy(() => import("./pages/MyWorkspace"));

// Novas Telas
const EscalaAppRouting = React.lazy(
  () => import("./pages/EscalaApp/EscalaAppRouting"),
);
const Laboratory = React.lazy(() => import("./pages/Laboratory"));
const Inventory = React.lazy(() => import("./pages/Inventory"));
const NursingCheck = React.lazy(() => import("./pages/NursingCheck"));
const TriageRoom = React.lazy(() => import("./pages/TriageRoom"));
const PediatriaRoom = React.lazy(() => import("./pages/PediatriaRoom"));
const NursingCheckRoom = React.lazy(() => import("./pages/NursingCheckRoom"));
const Billing = React.lazy(() => import("./pages/Billing"));
const Governance = React.lazy(() => import("./pages/Governance"));
const Login = React.lazy(() => import("./pages/Login"));
const NirDashboard = React.lazy(() => import("./pages/NirDashboard"));
const CleaningDashboard = React.lazy(() => import("./pages/CleaningDashboard"));
const InpatientList = React.lazy(() => import("./pages/InpatientList"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/fila" element={<Queue />} />
      <Route path="/novo-paciente" element={<NewPatient />} />
      <Route path="/triagem" element={<Triage />} />
      <Route path="/entrada" element={<Arrival />} />
      <Route path="/atendimentos" element={<Attendances />} />
      <Route path="/painel-chamadas" element={<CallPanel />} />
      <Route path="/pacientes" element={<Patients />} />
      <Route path="/leitos" element={<Beds />} />
      <Route path="/setores" element={<Sectors />} />
      <Route path="/farmacia" element={<Pharmacy />} />
      <Route path="/farmacia-satelite" element={<SatellitePharmacy />} />
      <Route path="/rh" element={<HR />} />
      <Route path="/meu-rh" element={<MyHR />} />
      <Route path="/escala/*" element={<EscalaAppRouting />} />
      <Route path="/sus" element={<SUSIntegration />} />
      <Route path="/relatorios" element={<Reports />} />
      <Route path="/same" element={<Same />} />
      <Route path="/paciente/:id" element={<PatientRecord />} />
      <Route path="/paciente/:id/evolucao" element={<PatientEvolution />} />
      <Route
        path="/paciente/:id/evolucao/medica"
        element={<EvolucaoMedica />}
      />
      <Route
        path="/paciente/:id/perfil-enfermagem"
        element={<PatientEvolution />}
      />
      <Route
        path="/paciente/:id/evolucao/enfermagem"
        element={<EvolucaoEnfermagem />}
      />
      <Route
        path="/paciente/:id/evolucao/anotacao-enfermagem"
        element={<AnotacaoEnfermagem />}
      />
      <Route
        path="/paciente/:id/evolucao/fisioterapia"
        element={<EvolucaoFisioterapia />}
      />
      <Route
        path="/paciente/:id/evolucao/nutricao"
        element={<EvolucaoNutricao />}
      />
      <Route
        path="/paciente/:id/evolucao/psicologia"
        element={<EvolucaoPsicologia />}
      />
      <Route
        path="/paciente/:id/evolucao/servico-social"
        element={<EvolucaoServicoSocial />}
      />
      <Route
        path="/paciente/:id/evolucao/terapia-ocupacional"
        element={<EvolucaoTerapiaOcupacional />}
      />
      <Route
        path="/paciente/:id/evolucao/fonoaudiologia"
        element={<EvolucaoFonoaudiologia />}
      />
      <Route
        path="/paciente/:id/evolucao/farmacia-clinica"
        element={<EvolucaoFarmaciaClinica />}
      />
      <Route path="/admin/usuarios" element={<UserManagement />} />
      <Route path="/admin/auditoria" element={<AuditLogs />} />
      <Route path="/admin/backups" element={<BackupAdmin />} />
      <Route path="/admin/consentimentos" element={<Consentimentos />} />
      <Route path="/admin/retencao" element={<RetencaoDados />} />
      <Route path="/admin/anonimizacao" element={<Anonimizacao />} />
      <Route path="/admin/integracoes" element={<CentralIntegracoes />} />
      <Route path="/pediatria" element={<Pediatria />} />
      <Route path="/sala/triagem" element={<TriageRoom />} />
      <Route path="/sala/pediatria" element={<PediatriaRoom />} />
      <Route path="/sala/checagem" element={<NursingCheckRoom />} />
      <Route
        path="/atendimentos-pediatricos"
        element={<AtendimentosPediatrico />}
      />
      <Route path="/painel-medico" element={<DoctorDashboard />} />
      <Route path="/painel-enfermagem" element={<NurseDashboard />} />
      <Route path="/meu-consultorio" element={<MyWorkspace />} />

      {/* Novas Rotas (Esqueletos) */}
      <Route path="/laboratorio" element={<Laboratory />} />
      <Route path="/almoxarifado" element={<Inventory />} />
      <Route path="/checagem-enfermagem" element={<NursingCheck />} />
      <Route path="/faturamento" element={<Billing />} />
      <Route path="/governanca" element={<Governance />} />

      <Route path="/nir" element={<NirDashboard />} />
      <Route path="/higiene" element={<CleaningDashboard />} />
      <Route path="/lista-internacao" element={<InpatientList />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
