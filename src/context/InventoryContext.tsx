import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

export interface InventoryItem {
  id: string;
  name: string;
  category: "consumables" | "solutions" | "needles_syringes" | "diagnostics";
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
}

export interface RequisitionItem {
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface Requisition {
  id: string;
  sector: string;
  requestedBy: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  items: RequisitionItem[];
  processedAt?: string;
  processedBy?: string;
}

export interface InventoryContextType {
  items: InventoryItem[];
  requisitions: Requisition[];
  requestSupplies: (
    sector: string,
    requestedBy: string,
    items: { itemId: string; quantity: number }[],
  ) => void;
  processRequisition: (
    id: string,
    status: "approved" | "rejected",
    processedBy: string,
  ) => void;
  adjustStock: (itemId: string, newStock: number) => void;
  decrementStockDirectly: (itemName: string, quantity: number) => void;
  simulateRequisition: () => void;
  resetInventory: () => void;
}

const initialItems: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Seringa 10ml c/ Agulha",
    category: "needles_syringes",
    currentStock: 450,
    minStock: 100,
    maxStock: 1000,
    unit: "un",
    location: "Bancada A",
  },
  {
    id: "inv-2",
    name: "Seringa 5ml c/ Agulha",
    category: "needles_syringes",
    currentStock: 300,
    minStock: 100,
    maxStock: 800,
    unit: "un",
    location: "Bancada A",
  },
  {
    id: "inv-3",
    name: "Agulha Descartável 25x7",
    category: "needles_syringes",
    currentStock: 600,
    minStock: 150,
    maxStock: 1500,
    unit: "un",
    location: "Bancada B",
  },
  {
    id: "inv-4",
    name: "Soro Fisiológico 0.9% 500ml",
    category: "solutions",
    currentStock: 180,
    minStock: 50,
    maxStock: 500,
    unit: "bl",
    location: "Prateleira C",
  },
  {
    id: "inv-5",
    name: "Soro Glicosado 5% 250ml",
    category: "solutions",
    currentStock: 90,
    minStock: 30,
    maxStock: 300,
    unit: "bl",
    location: "Prateleira C",
  },
  {
    id: "inv-6",
    name: "Tubo de Coleta (Sangue)",
    category: "diagnostics",
    currentStock: 150,
    minStock: 40,
    maxStock: 500,
    unit: "un",
    location: "Gabinete D",
  },
  {
    id: "inv-7",
    name: "Filme de Raio-X 35x43",
    category: "diagnostics",
    currentStock: 75,
    minStock: 20,
    maxStock: 200,
    unit: "un",
    location: "Gabinete D",
  },
  {
    id: "inv-8",
    name: "Cateter Intravenoso 20G (Abocath)",
    category: "consumables",
    currentStock: 120,
    minStock: 30,
    maxStock: 300,
    unit: "un",
    location: "Bancada B",
  },
  {
    id: "inv-9",
    name: "Esparadrapo Micropore 5cm x 10m",
    category: "consumables",
    currentStock: 40,
    minStock: 15,
    maxStock: 100,
    unit: "un",
    location: "Prateleira E",
  },
  {
    id: "inv-10",
    name: "Luvas de Procedimento (M)",
    category: "consumables",
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unit: "cx",
    location: "Prateleira E",
  },
  {
    id: "inv-11",
    name: "Garrote de Borracha",
    category: "consumables",
    currentStock: 25,
    minStock: 5,
    maxStock: 50,
    unit: "un",
    location: "Bancada B",
  },
  {
    id: "inv-12",
    name: "Máscara Descartável",
    category: "consumables",
    currentStock: 1000,
    minStock: 200,
    maxStock: 5000,
    unit: "un",
    location: "Prateleira E",
  },
];

const mockRequisitions: Requisition[] = [
  {
    id: "req-1",
    sector: "Triagem 1",
    requestedBy: "Enf. Juliana Lima",
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
    status: "approved",
    items: [
      { itemId: "inv-10", itemName: "Luvas de Procedimento (M)", quantity: 2 },
      {
        itemId: "inv-9",
        itemName: "Esparadrapo Micropore 5cm x 10m",
        quantity: 1,
      },
    ],
    processedAt: new Date(Date.now() - 3000000).toISOString(),
    processedBy: "Almoxarife Carlos",
  },
  {
    id: "req-2",
    sector: "Sala de Medicação",
    requestedBy: "Enf. Marcos Vale",
    requestedAt: new Date(Date.now() - 1800000).toISOString(),
    status: "pending",
    items: [
      { itemId: "inv-1", itemName: "Seringa 10ml c/ Agulha", quantity: 20 },
      {
        itemId: "inv-4",
        itemName: "Soro Fisiológico 0.9% 500ml",
        quantity: 10,
      },
    ],
  },
];

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("upa_inventory_items");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialItems;
      }
    }
    return initialItems;
  });

  const [requisitions, setRequisitions] = useState<Requisition[]>(() => {
    const saved = localStorage.getItem("upa_inventory_requisitions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockRequisitions;
      }
    }
    return mockRequisitions;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("upa_inventory_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(
      "upa_inventory_requisitions",
      JSON.stringify(requisitions),
    );
  }, [requisitions]);

  // Sync across tabs via BroadcastChannel & Storage Event
  useEffect(() => {
    const channel = new BroadcastChannel("upa_sync_channel");

    const syncInventory = () => {
      try {
        const savedItems = localStorage.getItem("upa_inventory_items");
        const savedRequisitions = localStorage.getItem(
          "upa_inventory_requisitions",
        );

        if (savedItems) {
          const parsed = JSON.parse(savedItems);
          setItems((prev) =>
            JSON.stringify(prev) !== savedItems ? parsed : prev,
          );
        }
        if (savedRequisitions) {
          const parsed = JSON.parse(savedRequisitions);
          setRequisitions((prev) =>
            JSON.stringify(prev) !== savedRequisitions ? parsed : prev,
          );
        }
      } catch (e) {
        console.error("Error syncing inventory:", e);
      }
    };

    channel.onmessage = (event) => {
      if (event.data === "sync_all" || event.data === "sync_inventory") {
        syncInventory();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("upa_inventory_")) {
        syncInventory();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", syncInventory);
    const interval = setInterval(syncInventory, 1000);

    return () => {
      channel.close();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", syncInventory);
      clearInterval(interval);
    };
  }, []);

  const requestSupplies = (
    sector: string,
    requestedBy: string,
    requestItems: { itemId: string; quantity: number }[],
  ) => {
    const fullItems = requestItems
      .map((ri) => {
        const match = items.find((i) => i.id === ri.itemId);
        return {
          itemId: ri.itemId,
          itemName: match ? match.name : "Item Desconhecido",
          quantity: ri.quantity,
        };
      })
      .filter((ri) => ri.quantity > 0);

    if (fullItems.length === 0) return;

    const newReq: Requisition = {
      id: "req-" + Math.random().toString(36).substring(2, 11),
      sector,
      requestedBy,
      requestedAt: new Date().toISOString(),
      status: "pending",
      items: fullItems,
    };

    setRequisitions((prev) => [newReq, ...prev]);
    toast.success("Requisição de insumos enviada com sucesso!", {
      description: `${fullItems.length} tipo(s) de item(ns) solicitado(s) para ${sector}.`,
    });

    new BroadcastChannel("upa_sync_channel").postMessage("sync_inventory");
  };

  const processRequisition = (
    id: string,
    status: "approved" | "rejected",
    processedBy: string,
  ) => {
    setRequisitions((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status,
            processedAt: new Date().toISOString(),
            processedBy,
          };
        }
        return req;
      }),
    );

    if (status === "approved") {
      const req = requisitions.find((r) => r.id === id);
      if (req) {
        setItems((prev) =>
          prev.map((item) => {
            const reqItem = req.items.find((ri) => ri.itemId === item.id);
            if (reqItem) {
              return {
                ...item,
                currentStock: Math.max(0, item.currentStock - reqItem.quantity),
              };
            }
            return item;
          }),
        );
        toast.success(
          `Requisição aprovada por ${processedBy}. Estoque atualizado.`,
        );
      }
    } else {
      toast.info(`Requisição rejeitada por ${processedBy}.`);
    }

    new BroadcastChannel("upa_sync_channel").postMessage("sync_inventory");
  };

  const adjustStock = (itemId: string, newStock: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, currentStock: Math.max(0, newStock) };
        }
        return item;
      }),
    );
    new BroadcastChannel("upa_sync_channel").postMessage("sync_inventory");
  };

  const decrementStockDirectly = (itemName: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.name.toLowerCase().includes(itemName.toLowerCase())) {
          const nextStock = Math.max(0, item.currentStock - quantity);
          if (nextStock <= item.minStock && item.currentStock > item.minStock) {
            toast.warning(
              `Alerta de Estoque: ${item.name} atingiu nível crítico (${nextStock} ${item.unit})!`,
            );
          }
          return { ...item, currentStock: nextStock };
        }
        return item;
      }),
    );
    new BroadcastChannel("upa_sync_channel").postMessage("sync_inventory");
  };

  const simulateRequisition = () => {
    const sectors = [
      "Sala de Medicação",
      "Observação Adulto",
      "Observação Pediátrica",
      "Triagem 2",
      "Triagem Pediátrica 1",
      "Sala Vermelha",
    ];
    const professionals = [
      "Enf. Juliana Lima",
      "Enf. Marcos Vale",
      "Enf. Ricardo Silveira",
      "Enf. Patricia Albuquerque",
    ];
    const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
    const randomProfessional =
      professionals[Math.floor(Math.random() * professionals.length)];

    const itemCount = Math.floor(Math.random() * 3) + 1;
    const shuffledItems = [...items].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledItems.slice(0, itemCount).map((item) => ({
      itemId: item.id,
      quantity: Math.floor(Math.random() * 15) + 5,
    }));

    requestSupplies(randomSector, randomProfessional, selectedItems);
  };

  const resetInventory = () => {
    localStorage.removeItem("upa_inventory_items");
    localStorage.removeItem("upa_inventory_requisitions");
    setItems(initialItems);
    setRequisitions(mockRequisitions);
    toast.success("Estoque e requisições resetados para os padrões.");
    new BroadcastChannel("upa_sync_channel").postMessage("sync_inventory");
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        requisitions,
        requestSupplies,
        processRequisition,
        adjustStock,
        decrementStockDirectly,
        simulateRequisition,
        resetInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
