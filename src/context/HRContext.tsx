import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: "In-Shift" | "Off-Shift" | "On-Call";
  shift: string;
  specialty: string;
  category: "medico" | "enfermagem" | "administrativo" | "geral";
  docStatus: "active" | "warning" | "missing";
  training: number;
}

export interface SwapRequest {
  id: number;
  from: string;
  to: string;
  date: string;
  shift: string;
  sector: string;
  status: "pending" | "approved" | "denied";
  reason: string;
  requestedAt: string;
}

export interface MyShift {
  date: string;
  day: string;
  time: string;
  type: "Diurno" | "Noturno" | "Especial";
  sector: string;
  status: "confirmed" | "swap_pending";
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 1,
    name: "Dr. João Mendes",
    role: "Médico Plantonista",
    status: "In-Shift",
    shift: "07:00 - 19:00",
    specialty: "Clínica Médica",
    category: "medico",
    docStatus: "active",
    training: 90,
  },
  {
    id: 2,
    name: "Dra. Maria Clara",
    role: "Médico Plantonista",
    status: "Off-Shift",
    shift: "N/A",
    specialty: "Pediatria",
    category: "medico",
    docStatus: "warning",
    training: 45,
  },
  {
    id: 3,
    name: "Ricardo Silva",
    role: "Enfermeiro Triagem",
    status: "In-Shift",
    shift: "13:00 - 01:00",
    specialty: "Emergência",
    category: "enfermagem",
    docStatus: "active",
    training: 100,
  },
  {
    id: 4,
    name: "Amanda Lemos",
    role: "Técnico Enfermagem",
    status: "On-Call",
    shift: "Sobreaviso",
    specialty: "Geral",
    category: "enfermagem",
    docStatus: "active",
    training: 85,
  },
  {
    id: 5,
    name: "Soraia Alves",
    role: "Gestão/Adm",
    status: "In-Shift",
    shift: "08:00 - 18:00",
    specialty: "Recursos Humanos",
    category: "administrativo",
    docStatus: "active",
    training: 100,
  },
];

const DEFAULT_SWAPS: SwapRequest[] = [
  {
    id: 1,
    from: "Dr. João Mendes",
    to: "Dra. Maria Clara",
    date: "25/06/2026",
    shift: "Diurno",
    sector: "Clínica Médica",
    status: "pending",
    reason: "Participação em congresso médico internacional",
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    from: "Ricardo Silva",
    to: "Ana Paula",
    date: "27/06/2026",
    shift: "Noturno",
    sector: "Triagem",
    status: "pending",
    reason: "Motivos pessoais familiares",
    requestedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    from: "Enf. Carla",
    to: "Soraia Alves",
    date: "30/06/2026",
    shift: "Noturno",
    sector: "Urgência",
    status: "approved",
    reason: "Consulta médica agendada",
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const DEFAULT_MY_SHIFTS: MyShift[] = [
  {
    date: "25/06/2026",
    day: "Quinta",
    time: "07:00 - 19:00",
    type: "Diurno",
    sector: "Urgência",
    status: "confirmed",
  },
  {
    date: "27/06/2026",
    day: "Sábado",
    time: "19:00 - 07:00",
    type: "Noturno",
    sector: "Clínica Médica",
    status: "confirmed",
  },
  {
    date: "30/06/2026",
    day: "Terça",
    time: "07:00 - 19:00",
    type: "Diurno",
    sector: "Triagem",
    status: "swap_pending",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface HRContextValue {
  // Staff
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, "id">) => void;
  updateStaffStatus: (id: number, status: StaffMember["status"]) => void;

  // Swap requests
  swapRequests: SwapRequest[];
  addSwapRequest: (
    req: Omit<SwapRequest, "id" | "requestedAt" | "status">,
  ) => void;
  updateSwapStatus: (id: number, status: "approved" | "denied") => void;

  // My shifts (logged-in employee view)
  myShifts: MyShift[];

  // Logged-in user profile (pulled from localStorage)
  activeEmployee: { name: string; role: string; specialty: string } | null;

  // Derived stats
  onShiftCount: number;
  deficitCount: number;
  pendingSwapsCount: number;

  // Notifications
  notifications: { id: number; text: string; type: "warning" | "info" }[];
}

const HRContext = createContext<HRContextValue | null>(null);

const LS_KEY = "upa_hr_data";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      staff: StaffMember[];
      swapRequests: SwapRequest[];
    };
  } catch {
    return null;
  }
}

function saveToStorage(staff: StaffMember[], swapRequests: SwapRequest[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ staff, swapRequests }));
    // NOTE: Do NOT dispatch a StorageEvent here — browsers automatically fire
    // the 'storage' event in OTHER tabs when localStorage changes. Dispatching
    // it manually in the same tab causes an infinite loop.
  } catch {}
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function HRProvider({ children }: { children: React.ReactNode }) {
  const saved = loadFromStorage();
  const [staff, setStaff] = useState<StaffMember[]>(
    saved?.staff ?? DEFAULT_STAFF,
  );
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(
    saved?.swapRequests ?? DEFAULT_SWAPS,
  );
  const [myShifts] = useState<MyShift[]>(DEFAULT_MY_SHIFTS);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== LS_KEY) return;
      const fresh = loadFromStorage();
      if (fresh) {
        setStaff(fresh.staff);
        setSwapRequests(fresh.swapRequests);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Persist on every change
  useEffect(() => {
    saveToStorage(staff, swapRequests);
  }, [staff, swapRequests]);

  // Logged-in employee from localStorage (set by DoctorDashboard / PainelMedico)
  const [activeEmployee, setActiveEmployee] =
    useState<HRContextValue["activeEmployee"]>(null);

  useEffect(() => {
    const doctorName = localStorage.getItem("upa_active_doctor");
    if (doctorName) {
      const match = staff.find(
        (s) =>
          s.name.toLowerCase().includes(doctorName.toLowerCase()) ||
          doctorName.toLowerCase().includes(s.name.toLowerCase()),
      );
      setActiveEmployee({
        name: doctorName,
        role: match?.role ?? "Médico Plantonista",
        specialty: match?.specialty ?? "Clínica Médica",
      });
    } else {
      const first = staff.find((s) => s.status === "In-Shift");
      setActiveEmployee(
        first
          ? { name: first.name, role: first.role, specialty: first.specialty }
          : null,
      );
    }
  }, [staff]);

  // ── Actions ──

  const addStaff = useCallback((member: Omit<StaffMember, "id">) => {
    setStaff((prev) => [...prev, { ...member, id: Date.now() }]);
  }, []);

  const updateStaffStatus = useCallback(
    (id: number, status: StaffMember["status"]) => {
      setStaff((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    },
    [],
  );

  const addSwapRequest = useCallback(
    (req: Omit<SwapRequest, "id" | "requestedAt" | "status">) => {
      const newReq: SwapRequest = {
        ...req,
        id: Date.now(),
        status: "pending",
        requestedAt: new Date().toISOString(),
      };
      setSwapRequests((prev) => [newReq, ...prev]);

      // Mark corresponding shift as swap_pending
      // (myShifts is local state per employee – reflected via swapRequests)
    },
    [],
  );

  const updateSwapStatus = useCallback(
    (id: number, status: "approved" | "denied") => {
      setSwapRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    },
    [],
  );

  // ── Derived ──

  const onShiftCount = staff.filter((s) => s.status === "In-Shift").length;
  const deficitCount = 2; // Could be derived from required posts vs. In-Shift count
  const pendingSwapsCount = swapRequests.filter(
    (r) => r.status === "pending",
  ).length;

  const notifications: HRContextValue["notifications"] = [
    ...staff
      .filter((s) => s.docStatus === "warning")
      .map((s) => ({
        id: s.id,
        text: `CRM vencendo em 15 dias: ${s.name}`,
        type: "warning" as const,
      })),
    ...swapRequests
      .filter((r) => r.status === "pending")
      .slice(0, 1)
      .map((r) => ({
        id: r.id + 1000,
        text: `Pedido de troca aguardando: ${r.from}`,
        type: "info" as const,
      })),
  ];

  return (
    <HRContext.Provider
      value={{
        staff,
        addStaff,
        updateStaffStatus,
        swapRequests,
        addSwapRequest,
        updateSwapStatus,
        myShifts,
        activeEmployee,
        onShiftCount,
        deficitCount,
        pendingSwapsCount,
        notifications,
      }}
    >
      {children}
    </HRContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useHR() {
  const ctx = useContext(HRContext);
  if (!ctx) throw new Error("useHR must be used inside <HRProvider>");
  return ctx;
}
