import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { usePharmacy } from "@/hooks/use-pharmacy";
import { usePatients } from "@/hooks/use-patients";
import { categoryLabels, movementLabels, MedicationCategory, Medication, MovementType, Movement } from "@/lib/pharmacy-store";
import { RENAME_2024, MedicationLibEntry } from "@/constants/medications";
import { Patient } from "@/hooks/use-patients";
import { toast } from "sonner";
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Search, 
  TrendingDown, 
  ArrowDownUp, 
  Pill, 
  ShieldAlert,
  MapPin,
  Activity,
  User,
  FileText,
  MoreVertical,
  ChevronDown,
  X
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'psychotropic':
    case 'narcotic':
      return "bg-slate-950 text-white border-slate-950 hover:bg-slate-900"; // Preta: Controlados
    case 'thermolabile':
      return "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"; // Azul: Geladeira
    case 'high-alert':
      return "bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-200"; // Rosa Pink: Alta Vigilância (ISMP)
    case 'emergency':
    case 'allergy':
      return "bg-red-600 text-white border-red-600 hover:bg-red-700"; // Vermelha: Emergência
    case 'chemotherapy':
      return "bg-yellow-400 text-slate-900 border-yellow-500 hover:bg-yellow-500"; // Amarela: Quimio
    case 'enteral':
      return "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"; // Roxa: Enteral
    case 'non-standard':
      return "bg-[#ff8c69] text-white border-[#ff8c69] hover:opacity-90 transition-opacity whitespace-nowrap"; // Salmão: Não padronizado
    case 'general':
    case 'solution':
      return "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"; // Verde: Uso Geral
    case 'antibiotic':
    case 'analgesic':
    case 'anti-inflammatory':
    case 'cardiovascular':
    case 'respiratory':
    case 'gastrointestinal':
    case 'endocrine':
    case 'obstetric':
    case 'corticoid':
      return "bg-slate-600 text-white border-slate-600 hover:bg-slate-700"; // Outras (Padronizado normal)
    case 'pediatric':
      return "bg-pink-500 text-white border-pink-500 hover:bg-pink-600";
    case 'ppe':
      return "bg-sky-600 text-white border-sky-600 hover:bg-sky-700";
    case 'supply':
      return "bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700";
    case 'admin':
      return "bg-slate-500 text-white border-slate-500 hover:bg-slate-600"; // Administrativo
    default:
      return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
  }
};

export default function Pharmacy() {
  const { medications, movements, addMedication, addMovement, lowStock, expiringSoon } = usePharmacy();
  const { patients } = usePatients();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [specialFilter, setSpecialFilter] = useState<"all" | "lowStock" | "expiring" | "narcotics" | "controlled">("all");
  const [movSearch, setMovSearch] = useState("");
  const [selectedMedDetails, setSelectedMedDetails] = useState<Medication | null>(null);
  const [activeTab, setActiveTab] = useState("stock");
  const [medForStockEntry, setMedForStockEntry] = useState<Medication | null>(null);
  const [medForQuickDispense, setMedForQuickDispense] = useState<Medication | null>(null);
  const [medForControlledDispatch, setMedForControlledDispatch] = useState<Medication | null>(null);
  const [entryQty, setEntryQty] = useState("1");
  const [quickDispenseData, setQuickDispenseData] = useState({ patientId: "", qty: "1", professional: "", obs: "" });
  const [controlledDispatchData, setControlledDispatchData] = useState({ 
    patientId: "", 
    qty: "1", 
    professional: "", 
    professionalId: "", 
    obs: "" 
  });

  const filtered = medications.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.genericName.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || m.category === catFilter;
    
    let matchSpecial = true;
    if (specialFilter === "lowStock") {
      matchSpecial = m.currentStock <= m.minStock;
    } else if (specialFilter === "expiring") {
      matchSpecial = expiringSoon.some(e => e.id === m.id);
    } else if (specialFilter === "narcotics") {
      matchSpecial = m.category === 'narcotic' || (m.controlled && (
        m.name.toUpperCase().includes("MORFINA") || 
        m.name.toUpperCase().includes("FENTANIL") || 
        m.name.toUpperCase().includes("PETIDINA") || 
        m.name.toUpperCase().includes("TRAMADOL") ||
        m.name.toUpperCase().includes("METADONA") ||
        m.name.toUpperCase().includes("CODEÍNA") ||
        m.name.toUpperCase().includes("OXICODONA")
      ));
    } else if (specialFilter === "controlled") {
      matchSpecial = m.controlled || m.category === 'psychotropic' || m.category === 'narcotic';
    }
    
    return matchSearch && matchCat && matchSpecial;
  });

  const filteredMovements = movements.filter(m => {
    const med = medications.find(md => md.id === m.medicationId);
    return (med?.name.toLowerCase().includes(movSearch.toLowerCase()) || m.patientName?.toLowerCase().includes(movSearch.toLowerCase()) || m.professional.toLowerCase().includes(movSearch.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl mission-control-title bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Farmácia Central</h1>
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Pill className="h-4 w-4 text-emerald-500 animate-pulse" />
              GESTOR DE SUPRIMENTOS / BANCO 2024
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black text-primary/60 uppercase tracking-widest px-1">
              <span>PJF - Prefeitura de Juiz de Fora</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Logística: Panvel</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab("register")} variant={activeTab === "register" ? "default" : "outline"} className="gap-2">
            <Plus className="h-4 w-4" />
            Cadastrar
          </Button>
          <Button onClick={() => setActiveTab("dispensing")} variant={activeTab === "dispensing" ? "default" : "outline"} className="gap-2">
            <Pill className="h-4 w-4" />
            Dispensar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
        <Card 
          className={cn(
            "glass-card cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-2",
            specialFilter === "all" ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5" : "hover:bg-primary/5 border-transparent opacity-80 hover:opacity-100"
          )}
          onClick={() => {
            setActiveTab("stock");
            setSearch("");
            setCatFilter("all");
            setSpecialFilter("all");
            toast.info("Mostrando todos os medicamentos");
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estoque Total</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-black">{medications.length}</div></CardContent>
        </Card>

        <Card 
          className={cn(
            "glass-card cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-2", 
            specialFilter === "lowStock" 
              ? "bg-destructive/10 border-destructive shadow-lg shadow-destructive/5" 
              : lowStock.length > 0 
                ? "border-destructive/30 bg-destructive/5 opacity-80 hover:opacity-100" 
                : "hover:bg-destructive/5 border-transparent opacity-80 hover:opacity-100"
          )}
          onClick={() => {
            setActiveTab("stock");
            setSearch("");
            setCatFilter("all");
            setSpecialFilter("lowStock");
            toast.warning(`Filtrando ${lowStock.length} itens com estoque crítico`);
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estoque Crítico</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-black text-destructive">{lowStock.length}</div></CardContent>
        </Card>

        <Card 
          className={cn(
            "glass-card cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-2", 
            specialFilter === "thermolabile"
              ? "bg-blue-600/10 border-blue-600 shadow-lg shadow-blue-600/5"
              : "hover:bg-blue-600/5 border-transparent opacity-80 hover:opacity-100"
          )}
          onClick={() => {
            setActiveTab("stock");
            setSearch("");
            setCatFilter("thermolabile");
            setSpecialFilter("all");
            toast.info("Cadeia de Frio: Exibindo Termolábeis");
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-blue-600">Termolábeis</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-black text-blue-700">{medications.filter(m => m.category === 'thermolabile').length}</div></CardContent>
        </Card>

        <Card 
          className={cn(
            "glass-card cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-2", 
            specialFilter === "highAlert"
              ? "bg-pink-600/10 border-pink-600 shadow-lg shadow-pink-600/5"
              : "hover:bg-pink-600/5 border-transparent opacity-80 hover:opacity-100"
          )}
          onClick={() => {
            setActiveTab("stock");
            setSearch("");
            setCatFilter("high-alert");
            setSpecialFilter("all");
            toast.error("ALTA VIGILÂNCIA: Risco de Erro Fatal");
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-pink-600">Alta Vigilância</CardTitle>
            <ShieldAlert className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-black text-pink-700">{medications.filter(m => m.category === 'high-alert').length}</div></CardContent>
        </Card>

        <Card 
          className={cn(
            "glass-card cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-2",
            specialFilter === "controlled" ? "bg-slate-900/10 border-slate-900 shadow-lg shadow-slate-900/5" : "hover:bg-slate-900/5 border-transparent opacity-80 hover:opacity-100"
          )}
          onClick={() => {
            setActiveTab("controlled");
            setSpecialFilter("controlled");
            toast.info("Portaria 344: Psicotrópicos");
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Psicotrópicos</CardTitle>
            <ShieldAlert className="h-4 w-4 text-slate-800" />
          </CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-black text-slate-900">{medications.filter(m => m.category === 'psychotropic').length}</div></CardContent>
        </Card>

        <Card 
          className={cn(
            "glass-card cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-2 border-slate-950/20",
            specialFilter === "narcotics" ? "bg-slate-950/20 border-slate-950" : "hover:bg-slate-950/5 opacity-80 hover:opacity-100"
          )}
          onClick={() => {
            setActiveTab("stock");
            setSearch("");
            setCatFilter("narcotic");
            setSpecialFilter("all");
            toast.error("MODO ALTA VIGILÂNCIA: Narcóticos");
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-950">Narcóticos</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-600 animate-pulse" />
          </CardHeader>
          <CardContent className="p-4 pt-0"><div className="text-2xl font-black text-slate-950">{medications.filter(m => m.category === 'narcotic').length}</div></CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="stock" className="gap-2"><Package className="h-4 w-4" />Estoque</TabsTrigger>
          <TabsTrigger value="controlled" className="gap-2"><ShieldAlert className="h-4 w-4" />Psicotrópicos / Narcóticos</TabsTrigger>
          <TabsTrigger value="dispensing" className="gap-2"><Pill className="h-4 w-4" />Dispensação</TabsTrigger>
          <TabsTrigger value="movements" className="gap-2"><ArrowDownUp className="h-4 w-4" />Movimentações</TabsTrigger>
          <TabsTrigger value="register" className="gap-2"><Plus className="h-4 w-4" />Cadastrar</TabsTrigger>
        </TabsList>

        {/* STOCK TAB */}
        <TabsContent value="stock" className="space-y-4">
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou principio ativo (lupa)..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11 border-primary/20 focus:border-primary" />
            </div>
            {specialFilter !== "all" && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSpecialFilter("all")}
                className="h-11 px-4 gap-2 border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary/10"
              >
                <X className="h-4 w-4" />
                Limpar Filtro Especial
              </Button>
            )}
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-[200px] h-11"><SelectValue placeholder="Filtrar Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <MedicationTable medications={filtered} onSelect={setSelectedMedDetails} onQuickDispense={setMedForQuickDispense} onControlledDispatch={setMedForControlledDispatch} onStockEntry={setMedForStockEntry} />
        </TabsContent>

        {/* CONTROLLED TAB */}
        <TabsContent value="controlled" className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Psicotrópicos e Narcóticos (Portaria 344)
            </h3>
            <p className="text-xs text-muted-foreground font-medium">Exibindo apenas itens com exigência de retenção de receita e guarda em cofre.</p>
          </div>
          <MedicationTable 
            medications={medications.filter(m => m.controlled || m.category === 'psychotropic' || m.category === 'narcotic')} 
            onSelect={setSelectedMedDetails} 
            onQuickDispense={setMedForQuickDispense} 
            onControlledDispatch={setMedForControlledDispatch} 
            onStockEntry={setMedForStockEntry} 
          />
        </TabsContent>

        {/* DISPENSING TAB */}
        <TabsContent value="dispensing">
          <DispensingForm 
            medications={medications} 
            patients={patients} 
            onDispense={addMovement} 
          />
        </TabsContent>

        {/* MOVEMENTS TAB */}
        <TabsContent value="movements" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filtrar por paciente, medicamento ou profissional..." value={movSearch} onChange={e => setMovSearch(e.target.value)} className="pl-9" />
          </div>
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold">Data/Hora</TableHead>
                    <TableHead className="font-bold">Tipo</TableHead>
                    <TableHead className="font-bold">Medicamento</TableHead>
                    <TableHead className="text-center font-bold">Qtd</TableHead>
                    <TableHead className="font-bold">Paciente</TableHead>
                    <TableHead className="font-bold">Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map(m => {
                    const med = medications.find(md => md.id === m.medicationId);
                    return (
                      <TableRow key={m.id} className="text-xs">
                        <td className="px-4 py-3 font-mono opacity-70">
                          {m.date}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={m.type === 'entry' ? 'default' : m.type === 'dispensing' ? 'secondary' : m.type === 'expired' ? 'destructive' : 'outline'} className="text-[10px] font-black uppercase border-0 w-[100px] justify-center">
                            {movementLabels[m.type]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-bold">{med?.name || m.medicationId}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={m.type === 'entry' ? 'text-green-600 font-black' : 'text-foreground font-medium'}>
                            {m.type === 'entry' ? '+' : '-'}{m.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium uppercase">{m.patientName || '—'}</td>
                        <td className="px-4 py-3 opacity-80">{m.professional}</td>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REGISTER TAB */}
        <TabsContent value="register">
          <RegisterMedicationForm 
            onSave={(m) => {
              addMedication(m);
              setActiveTab("stock");
              toast.success("Medicamento cadastrado com sucesso");
            }} 
          />
        </TabsContent>
      </Tabs>

      {/* MEDICATION DETAILS DIALOG */}
      <Dialog open={!!selectedMedDetails} onOpenChange={(open) => !open && setSelectedMedDetails(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2rem]">
          <DialogHeader className={cn(
            "p-8 text-white transition-colors duration-500",
            ['psychotropic', 'narcotic'].includes(selectedMedDetails?.category || '') ? "bg-slate-950" : 
            selectedMedDetails?.category === 'high-alert' ? "bg-rose-600" :
            ['emergency', 'allergy'].includes(selectedMedDetails?.category || '') ? "bg-red-600" :
            selectedMedDetails?.category === 'thermolabile' ? "bg-blue-600" :
            selectedMedDetails?.category === 'chemotherapy' ? "bg-yellow-500 text-slate-950" :
            selectedMedDetails?.category === 'enteral' ? "bg-purple-600" :
            selectedMedDetails?.category === 'non-standard' ? "bg-[#ff8c69]" :
            ['general', 'solution'].includes(selectedMedDetails?.category || '') ? "bg-emerald-600" :
            "bg-slate-600"
          )}>
            <div className="flex justify-between items-start">
               <div>
                  <Badge 
                    variant="outline" 
                    className="bg-white/20 text-white border-white/50 mb-2 uppercase font-black text-[10px] backdrop-blur-md"
                  >
                    {selectedMedDetails && categoryLabels[selectedMedDetails.category]}
                  </Badge>
                  <DialogTitle className="text-3xl font-black">{selectedMedDetails?.name}</DialogTitle>
                  <p className="opacity-80 text-sm font-medium uppercase tracking-widest mt-1">{selectedMedDetails?.genericName}</p>
               </div>
               {selectedMedDetails?.controlled && (
                 <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                   <ShieldAlert className="h-8 w-8" />
                 </div>
               )}
            </div>
          </DialogHeader>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Estoque Atual</p>
                  <div className="text-2xl font-black">
                    {selectedMedDetails?.currentStock} <span className="text-xs font-normal opacity-60">{selectedMedDetails?.unit}</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Lote Atual</p>
                  <div className="text-2xl font-black">{selectedMedDetails?.lot}</div>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <Clock className="h-5 w-5 text-muted-foreground" />
                   <div>
                     <p className="text-[10px] font-black uppercase text-muted-foreground">Validade</p>
                     <p className="font-bold">{selectedMedDetails?.expirationDate}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <MapPin className="h-5 w-5 text-muted-foreground" />
                   <div>
                     <p className="text-[10px] font-black uppercase text-muted-foreground">Localização</p>
                     <p className="font-bold">{selectedMedDetails?.location}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <Activity className="h-5 w-5 text-muted-foreground" />
                   <div>
                     <p className="text-[10px] font-black uppercase text-muted-foreground">Apresentação</p>
                     <p className="font-bold">{selectedMedDetails?.presentation}</p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center border-l pl-8">
              <p className="text-sm font-bold text-muted-foreground mb-2">Ações Rápidas</p>
              <Button className="w-full h-12 rounded-xl gap-2 font-black uppercase tracking-wider" onClick={() => {
                setActiveTab("dispensing");
                setSelectedMedDetails(null);
              }}>
                <Pill className="h-5 w-5" />
                Dispensar Agora
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-xl gap-2 font-black uppercase tracking-wider">
                <ArrowDownUp className="h-5 w-5" />
                Ajustar Estoque
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-xl gap-2 font-black uppercase tracking-wider">
                <FileText className="h-5 w-5" />
                Ver Histórico
              </Button>
            </div>
          </div>
          
          <DialogFooter className="bg-muted/30 p-4 border-t">
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-xl">Fechar Detalhes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QUICK STOCK ENTRY DIALOG */}
      <Dialog open={!!medForStockEntry} onOpenChange={(open) => !open && setMedForStockEntry(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2rem]">
          <DialogHeader className="p-8 bg-green-600 text-white">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Entrada de Estoque
            </DialogTitle>
            <p className="opacity-80 text-sm">{medForStockEntry?.name}</p>
          </DialogHeader>
          
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Quantidade a Adicionar</Label>
              <Input 
                type="number" 
                min="1" 
                value={entryQty} 
                onChange={e => setEntryQty(e.target.value)} 
                className="h-12 text-xl font-black border-green-600/20 focus:border-green-600" 
              />
              <p className="text-[10px] text-muted-foreground">
                O estoque atual é de {medForStockEntry?.currentStock} {medForStockEntry?.unit}.
              </p>
            </div>

            <Button 
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black uppercase tracking-wider shadow-lg shadow-green-600/20"
              onClick={() => {
                if (!medForStockEntry) return;
                const qty = parseInt(entryQty);
                if (isNaN(qty) || qty <= 0) {
                  toast.error("Quantidade inválida");
                  return;
                }
                addMovement({
                  medicationId: medForStockEntry.id,
                  type: 'entry',
                  quantity: qty,
                  date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  professional: "Farm. Responsável",
                  observation: "Entrada via Ações Rápidas"
                });
                toast.success(`${qty} doses adicionadas ao estoque`);
                setMedForStockEntry(null);
                setEntryQty("1");
              }}
            >
              Confirmar Entrada
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QUICK DISPENSE DIALOG */}
      <Dialog open={!!medForQuickDispense} onOpenChange={(open) => !open && setMedForQuickDispense(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2rem]">
          <DialogHeader className="p-8 bg-primary text-white">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <Pill className="h-6 w-6" />
              Dispensação Rápida
            </DialogTitle>
            <p className="opacity-80 text-sm">{medForQuickDispense?.name}</p>
          </DialogHeader>
          
          <div className="p-8 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paciente</Label>
              <Select value={quickDispenseData.patientId} onValueChange={v => setQuickDispenseData(prev => ({ ...prev, patientId: v }))}>
                <SelectTrigger className="h-11 border-primary/20">
                  <SelectValue placeholder="Selecione o paciente..." />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {patients.filter(p => p.status !== 'completed').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantidade</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={quickDispenseData.qty} 
                  onChange={e => setQuickDispenseData(prev => ({ ...prev, qty: e.target.value }))} 
                  className="h-11 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estoque Disponível</Label>
                <div className="h-11 flex items-center px-4 bg-muted/50 rounded-md font-bold text-sm">
                  {medForQuickDispense?.currentStock} {medForQuickDispense?.unit}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Responsável</Label>
              <Input 
                value={quickDispenseData.professional} 
                onChange={e => setQuickDispenseData(prev => ({ ...prev, professional: e.target.value }))} 
                placeholder="Nome do profissional"
                className="h-11"
              />
            </div>

            <Button 
              className="w-full h-12 text-white rounded-xl font-black uppercase tracking-wider shadow-lg shadow-primary/20 mt-4"
              onClick={() => {
                if (!medForQuickDispense || !quickDispenseData.patientId || !quickDispenseData.professional) {
                  toast.error("Preencha todos os campos");
                  return;
                }
                const qty = parseInt(quickDispenseData.qty);
                if (isNaN(qty) || qty <= 0) {
                  toast.error("Quantidade inválida");
                  return;
                }
                if (qty > medForQuickDispense.currentStock) {
                  toast.error("Estoque insuficiente");
                  return;
                }
                
                const selectedPatient = patients.find(p => p.id === quickDispenseData.patientId);
                
                addMovement({
                  medicationId: medForQuickDispense.id,
                  type: 'dispensing',
                  quantity: qty,
                  date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  professional: quickDispenseData.professional,
                  patientId: quickDispenseData.patientId,
                  patientName: selectedPatient?.name,
                  observation: quickDispenseData.obs || "Dispensação Rápida"
                });
                
                toast.success("Dispensação realizada com sucesso");
                setMedForQuickDispense(null);
                setQuickDispenseData({ patientId: "", qty: "1", professional: "", obs: "" });
              }}
            >
              Confirmar Dispensação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QUICK CONTROLLED DISPATCH DIALOG */}
      <Dialog open={!!medForControlledDispatch} onOpenChange={(open) => !open && setMedForControlledDispatch(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2rem] border-4 border-slate-950">
          <DialogHeader className="p-8 bg-slate-950 text-white relative">
            <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-sm">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
              DESPACHO CONTROLADO
            </DialogTitle>
            <p className="opacity-80 text-sm font-mono">{medForControlledDispatch?.name} ({medForControlledDispatch?.presentation})</p>
            <div className="mt-4 p-2 bg-red-600/20 border border-red-600/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-center">
              Atenção: Medicamento de Alta Vigilância
            </div>
          </DialogHeader>
          
          <div className="p-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                <span>Paciente Destino</span>
                <span className="text-destructive">* Obrigatório</span>
              </Label>
              <Select value={controlledDispatchData.patientId} onValueChange={v => setControlledDispatchData(prev => ({ ...prev, patientId: v }))}>
                <SelectTrigger className="h-12 border-slate-950/20 focus:ring-slate-950">
                  <SelectValue placeholder="Selecione o paciente..." />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {patients.filter(p => p.status !== 'completed').map(p => (
                    <SelectItem key={p.id} value={p.id} className="py-2.5">
                       <div className="flex flex-col">
                         <span className="font-bold text-sm">{p.name}</span>
                         <span className="text-[10px] text-muted-foreground uppercase">{p.risk}</span>
                       </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Qtde</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={controlledDispatchData.qty} 
                  onChange={e => setControlledDispatchData(prev => ({ ...prev, qty: e.target.value }))} 
                  className="h-12 text-center text-xl font-black border-slate-950/20 focus:ring-slate-950"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Disponível</Label>
                <div className="h-12 flex items-center justify-center bg-slate-100 rounded-md font-black text-slate-950 border border-slate-950/10">
                  {medForControlledDispatch?.currentStock} {medForControlledDispatch?.unit}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identificação do Profissional (CRM/COREN)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      value={controlledDispatchData.professional} 
                      onChange={e => setControlledDispatchData(prev => ({ ...prev, professional: e.target.value }))} 
                      placeholder="Nome Completo"
                      className="h-11 border-slate-950/20 text-xs"
                    />
                    <Input 
                      value={controlledDispatchData.professionalId} 
                      onChange={e => setControlledDispatchData(prev => ({ ...prev, professionalId: e.target.value }))} 
                      placeholder="Nº Registro"
                      className="h-11 border-slate-950/20 text-xs"
                    />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Observação do Despacho</Label>
                  <Input 
                    value={controlledDispatchData.obs} 
                    onChange={e => setControlledDispatchData(prev => ({ ...prev, obs: e.target.value }))} 
                    placeholder="Ex: Urgência em leito / Reforço dose"
                    className="h-11 border-slate-950/20 text-xs"
                  />
               </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                variant="outline"
                className="rounded-xl h-12 flex-1"
                onClick={() => setMedForControlledDispatch(null)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-slate-950 hover:bg-black text-white rounded-xl h-12 flex-[2] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-950/20"
                onClick={() => {
                  if (!medForControlledDispatch || !controlledDispatchData.patientId || !controlledDispatchData.professional || !controlledDispatchData.professionalId) {
                    toast.error("Preencha todos os campos e o registro profissional");
                    return;
                  }
                  
                  const qty = parseInt(controlledDispatchData.qty);
                  if (isNaN(qty) || qty <= 0) {
                    toast.error("Quantidade inválida");
                    return;
                  }
                  
                  if (qty > medForControlledDispatch.currentStock) {
                    toast.error("Estoque insuficiente em cofre");
                    return;
                  }

                  const selectedPatient = patients.find(p => p.id === controlledDispatchData.patientId);
                  
                  addMovement({
                    medicationId: medForControlledDispatch.id,
                    type: 'dispensing',
                    quantity: qty,
                    date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                    professional: `${controlledDispatchData.professional} [${controlledDispatchData.professionalId}]`,
                    patientId: controlledDispatchData.patientId,
                    patientName: selectedPatient?.name,
                    observation: `DESPACHO CONTROLADO RÁPIDO: ${controlledDispatchData.obs || 'N/A'}`
                  });
                  
                  toast.success("Medicamento controlado despachado com registro.");
                  setMedForControlledDispatch(null);
                  setControlledDispatchData({ patientId: "", qty: "1", professional: "", professionalId: "", obs: "" });
                }}
              >
                Confirmar Despacho
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ─── Medication Table Component ─── */
function MedicationTable({ 
  medications, 
  onSelect, 
  onQuickDispense, 
  onControlledDispatch, 
  onStockEntry 
}: { 
  medications: Medication[]; 
  onSelect: (m: Medication) => void;
  onQuickDispense: (m: Medication) => void;
  onControlledDispatch: (m: Medication) => void;
  onStockEntry: (m: Medication) => void;
}) {
  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow>
              <TableHead className="data-label py-4">DENOMINAÇÃO / PRINCÍPIO</TableHead>
              <TableHead className="data-label py-4">FORMA</TableHead>
              <TableHead className="data-label py-4">CATEGORIA</TableHead>
              <TableHead className="data-label py-4 text-center">NÍVEL ATUAL</TableHead>
              <TableHead className="data-label py-4 text-center">SAFETY</TableHead>
              <TableHead className="data-label py-4">ENDER.</TableHead>
              <TableHead className="data-label py-4 text-right w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map(m => (
              <TableRow 
                key={m.id} 
                className={cn(
                  "cursor-pointer hover:bg-primary/5 transition-colors group",
                  m.controlled && "bg-slate-950/5 hover:bg-slate-900/10"
                )}
                onClick={() => onSelect(m)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {m.controlled && <ShieldAlert className="h-4 w-4 text-orange-600 animate-pulse" />}
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">{m.name}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase font-mono">{m.genericName}</div>
                </TableCell>
                <TableCell className="text-xs font-medium">{m.presentation}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("text-[10px] font-bold uppercase tracking-wider w-[120px] justify-center", getCategoryColor(m.category))}
                  >
                    {categoryLabels[m.category]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className={cn(
                    "px-2 py-1 rounded-md inline-block",
                    m.currentStock <= m.minStock ? "bg-destructive/10 text-destructive font-black" : "bg-primary/5 text-primary font-bold"
                  )}>
                    {m.currentStock} <span className="text-[10px] opacity-70 font-normal">{m.unit}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-[10px] text-muted-foreground font-bold">{m.minStock}</TableCell>
                <TableCell className="text-[10px] font-mono text-muted-foreground">{m.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      onClick={() => onSelect(m)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all"
                      onClick={() => onQuickDispense(m)}
                      title="Dispensação Comum"
                    >
                      <Pill className="h-4 w-4" />
                    </Button>
                    {m.controlled && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-900 animate-pulse bg-slate-100 hover:bg-slate-200"
                        onClick={() => onControlledDispatch(m)}
                        title="Despacho Controlado (Urgente)"
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50 transition-all"
                      onClick={() => onStockEntry(m)}
                      title="Entrada de Estoque"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {medications.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Search className="h-12 w-12 mb-2 opacity-20" />
                    <p>Nenhum item encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ─── Dispensing Form ─── */
function DispensingForm({ medications, patients, onDispense }: { medications: Medication[]; patients: Patient[]; onDispense: (m: Omit<Movement, 'id'>) => void }) {
  const [medId, setMedId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [qty, setQty] = useState("1");
  const [professional, setProfessional] = useState("");
  const [obs, setObs] = useState("");
  const [medSearch, setMedSearch] = useState("");

  const filteredMeds = medications.filter(m => m.name.toLowerCase().includes(medSearch.toLowerCase()));
  const selectedMed = medications.find(m => m.id === medId);
  const selectedPatient = patients.find(p => p.id === patientId);

  const handleDispense = () => {
    if (!medId || !patientId || !professional || !qty) { toast.error("Preencha todos os campos obrigatórios"); return; }
    const q = parseInt(qty);
    if (isNaN(q) || q <= 0) { toast.error("Quantidade inválida"); return; }
    if (selectedMed && q > selectedMed.currentStock) { toast.error("Estoque insuficiente"); return; }
    onDispense({ medicationId: medId, type: 'dispensing' as MovementType, quantity: q, date: new Date().toISOString().replace('T', ' ').slice(0, 16), professional, patientId, patientName: selectedPatient?.name, observation: obs, userId: 'system' });
    toast.success("Medicamento dispensado com sucesso");
    setMedId(""); setPatientId(""); setQty("1"); setObs("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 glass-card">
        <CardHeader className="bg-primary/5 border-b mb-6">
          <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            Registro de Dispensação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-1">Medicamento <span className="text-destructive">*</span></Label>
              <Select value={medId} onValueChange={setMedId}>
                <SelectTrigger className="h-11 border-primary/20"><SelectValue placeholder="Selecione o item..." /></SelectTrigger>
                <SelectContent>
                  <div className="p-2 border-b"><Input placeholder="Buscar medicamento..." value={medSearch} onChange={e => setMedSearch(e.target.value)} className="h-9 focus:ring-1" /></div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredMeds.map(m => (
                      <SelectItem key={m.id} value={m.id} className="py-3">
                        <div className="flex flex-col">
                          <span className="font-bold">{m.name}</span>
                          <span className="text-[10px] opacity-60">{m.presentation} — Est: {m.currentStock} {m.unit}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-1">Paciente <span className="text-destructive">*</span></Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger className="h-11 border-primary/20"><SelectValue placeholder="Selecione o paciente..." /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {patients.filter(p => p.status !== 'completed').map(p => (
                    <SelectItem key={p.id} value={p.id} className="py-3">
                      <div className="flex flex-col">
                        <span className="font-bold">{p.name}</span>
                        <span className="text-[10px] opacity-60">CPF: {p.cpf}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-1">Quantidade <span className="text-destructive">*</span></Label>
              <Input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} className="h-11 border-primary/20 text-lg font-bold" />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-1">Responsável pela Saída <span className="text-destructive">*</span></Label>
              <Input value={professional} onChange={e => setProfessional(e.target.value)} placeholder="Ex: Farm. Ana Paula" className="h-11 border-primary/20" />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-1">Observações / Receituário</Label>
            <Input value={obs} onChange={e => setObs(e.target.value)} placeholder="Número da receita, posologia ou observação técnica..." className="h-11 border-primary/20" />
          </div>

          <Button onClick={handleDispense} className="w-full h-12 text-md font-black uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 mt-4">
            Confirmar Dispensação
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Resumo da Seleção</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {selectedMed ? (
              <div className="p-4 rounded-2xl bg-primary/5 space-y-3 border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-primary uppercase leading-tight">{selectedMed.name}</p>
                    <p className="text-[10px] text-muted-foreground mb-1">{selectedMed.presentation}</p>
                    <Badge 
                      variant="outline" 
                      className={cn("text-[8px] font-black uppercase px-2 h-4", getCategoryColor(selectedMed.category))}
                    >
                      {categoryLabels[selectedMed.category]}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10">
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Estoque</p>
                    <p className="font-bold text-sm">{selectedMed.currentStock} {selectedMed.unit}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Local</p>
                    <p className="font-bold text-sm">{selectedMed.location}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed rounded-2xl text-center text-muted-foreground">
                <p className="text-xs">Selecione um medicamento para ver detalhes</p>
              </div>
            )}

            {selectedPatient ? (
              <div className="p-4 rounded-2xl bg-secondary/20 space-y-3 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                    <User className="h-6 w-6 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase leading-tight">{selectedPatient.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedPatient.status === 'waiting' ? 'AGUARDANDO' : 
                       selectedPatient.status === 'attending' ? 'EM ATENDIMENTO' : 
                       selectedPatient.status === 'completed' ? 'FINALIZADO' : 
                       selectedPatient.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed rounded-2xl text-center text-muted-foreground">
                <p className="text-xs">Selecione um paciente</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card bg-orange-500/5 border-dashed border-orange-500/20">
           <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-orange-600">
                <ShieldAlert className="h-5 w-5" />
                <p className="text-xs font-bold uppercase">Segurança do Paciente</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                Verifique sempre o bracelete do paciente e a dose prescrita antes de confirmar a dispensação. Medicamentos controlados exigem guarda em cofre.
              </p>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─── Register Medication Form ─── */
function RegisterMedicationForm({ onSave }: { onSave: (m: Omit<Medication, 'id'>) => void }) {
  const [form, setForm] = useState({ 
    name: '', 
    genericName: '', 
    category: 'other' as MedicationCategory, 
    presentation: '', 
    unit: 'cp', 
    currentStock: '', 
    minStock: '', 
    maxStock: '', 
    lot: '', 
    expirationDate: '', 
    location: '', 
    controlled: false 
  });
  const [suggestions, setSuggestions] = useState<MedicationLibEntry[]>([]);
  const [phantomSuggestion, setPhantomSuggestion] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const set = (k: string, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }));

  const handleNameChange = (val: string) => {
    const upperVal = val.toUpperCase();
    set('name', upperVal);
    
    if (upperVal.length > 0) {
      const filtered = RENAME_2024.filter(m => 
        m.name.includes(upperVal) || 
        m.genericName.includes(upperVal)
      );
      
      const topMatch = filtered.find(m => m.name.startsWith(upperVal));
      setSuggestions(filtered.slice(0, 5));
      setPhantomSuggestion(topMatch ? topMatch.name : "");
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setPhantomSuggestion("");
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (entry: MedicationLibEntry) => {
    setForm(prev => ({
      ...prev,
      name: entry.name,
      genericName: entry.genericName,
      category: (entry.category || 'other') as MedicationCategory,
      presentation: entry.presentation,
      unit: entry.unit,
      controlled: entry.controlled || false
    }));
    setPhantomSuggestion("");
    setShowSuggestions(false);
    toast.info(`Dados de "${entry.name}" carregados`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && phantomSuggestion && form.name !== phantomSuggestion) {
      const entry = RENAME_2024.find(m => m.name === phantomSuggestion);
      if (entry) {
        e.preventDefault();
        selectSuggestion(entry);
      }
    }
  };

  const handleSave = () => {
    // Validate required fields
    const required = [
      { field: 'name', label: 'Nome Comercial' },
      { field: 'presentation', label: 'Apresentação' },
      { field: 'currentStock', label: 'Estoque Inicial' },
      { field: 'lot', label: 'Lote' },
      { field: 'expirationDate', label: 'Data de Validade' }
    ];

    const missing = required.filter(r => !form[r.field as keyof typeof form]);
    
    if (missing.length > 0) {
      toast.error(`Campos obrigatórios ausentes: ${missing.map(m => m.label).join(', ')}`);
      return;
    }

    const currentStockNum = parseInt(form.currentStock);
    if (isNaN(currentStockNum)) {
      toast.error("Estoque inicial deve ser um número");
      return;
    }

    onSave({ 
      ...form, 
      currentStock: currentStockNum, 
      minStock: parseInt(form.minStock) || 10, 
      maxStock: parseInt(form.maxStock) || 500 
    });
    
    // Form reset is handled by parent if needed or we can do it here too
    setForm({ 
      name: '', 
      genericName: '', 
      category: 'other', 
      presentation: '', 
      unit: 'cp', 
      currentStock: '', 
      minStock: '', 
      maxStock: '', 
      lot: '', 
      expirationDate: '', 
      location: '', 
      controlled: false 
    });
    setPhantomSuggestion("");
    setShowSuggestions(false);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="bg-muted/30 border-b mb-6">
        <CardTitle className="text-xl font-black uppercase flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Plus className="h-6 w-6 text-primary" />
            Novo Cadastro de Item
          </div>
          <Badge variant="outline" className="text-[9px] font-black tracking-widest border-primary/30 text-primary bg-primary/5 px-3 py-1">RENAME 2024 ACTIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2 relative">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Nome Comercial *
              <Search className="h-3 w-3 opacity-40" />
            </Label>
            <div className="relative">
              <Input 
                value={form.name} 
                onChange={e => handleNameChange(e.target.value)} 
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => form.name && setShowSuggestions(true)}
                placeholder="Digite o nome do medicamento..."
                className="h-10 pl-3 pr-6 rounded-md bg-background border-primary/20 focus:border-primary font-bold relative z-10" 
              />
              {phantomSuggestion && form.name && phantomSuggestion.startsWith(form.name) && (
                <div className="absolute inset-0 flex items-center pl-3 pointer-events-none z-0">
                  <span className="text-sm font-bold opacity-0">{form.name}</span>
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500">{phantomSuggestion.slice(form.name.length)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 px-1">
              {suggestions.length > 0 ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-1 duration-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {suggestions.length} {suggestions.length === 1 ? 'resultado encontrado' : 'resultados encontrados'} na RENAME 2024
                  </span>
                </div>
              ) : form.name.length > 0 ? (
                <div className="flex items-center gap-2 text-muted-foreground/40">
                  <span className="text-[9px] font-black uppercase tracking-widest italic">Item não catalogado - preenchimento manual</span>
                </div>
              ) : (
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 italic">Pressione TAB para autocompletar</span>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white dark:bg-slate-900 border border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 bg-primary/5 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 italic">Sugeridos RENAME 2024</span>
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground/50">TAB para confirmar</span>
                </div>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-primary/5 flex flex-col gap-0.5 border-b last:border-0 transition-colors group"
                    onClick={() => selectSuggestion(s)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-foreground group-hover:text-primary transition-colors">{s.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-[8px] font-black uppercase px-2 h-4 border-0", getCategoryColor(s.category))}
                      >
                        {categoryLabels[s.category as MedicationCategory] || 'Outro'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground font-medium truncate max-w-[180px]">{s.genericName}</span>
                      <span className="text-[9px] font-black text-primary/70">{s.presentation}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Princípio Ativo (Genérico)</Label><Input value={form.genericName} onChange={e => set('genericName', e.target.value.toUpperCase())} className="h-10 border-primary/20" /></div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categoria</Label>
            <Select value={form.category} onValueChange={v => set('category', v)}>
              <SelectTrigger className="h-10 border-primary/20"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Apresentação / Concentração *</Label><Input value={form.presentation} onChange={e => set('presentation', e.target.value)} placeholder="Ex: Comprimido 500mg" className="h-10 border-primary/20" /></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Unidade</Label><Input value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="cp, amp, fr, ml..." className="h-10 border-primary/20" /></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Número do Lote *</Label><Input value={form.lot} onChange={e => set('lot', e.target.value.toUpperCase())} className="h-10 border-primary/20" /></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estoque Inicial *</Label><Input type="number" value={form.currentStock} onChange={e => set('currentStock', e.target.value)} className="h-10 border-primary/20 font-bold" /></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estoque Mínimo (Alerta)</Label><Input type="number" value={form.minStock} onChange={e => set('minStock', e.target.value)} className="h-10 border-primary/20" /></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Endereçamento (Local)</Label><Input value={form.location} onChange={e => set('location', e.target.value.toUpperCase())} placeholder="Ex: A1-P4-G2" className="h-10 border-primary/20" /></div>
          <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Data de Validade *</Label><Input type="date" value={form.expirationDate} onChange={e => set('expirationDate', e.target.value)} className="h-10 border-primary/20" /></div>
          <div className="md:col-span-2 flex items-center gap-4 p-5 bg-slate-950/5 rounded-2xl border-2 border-dashed border-slate-950/20 self-end transition-all hover:bg-slate-950/10 group">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-950 text-white shadow-lg group-hover:scale-110 transition-transform">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={form.controlled} 
                  onChange={e => set('controlled', e.target.checked)} 
                  id="controlled" 
                  className="h-5 w-5 accent-slate-950 transition-all cursor-pointer" 
                />
                <Label htmlFor="controlled" className="cursor-pointer font-black text-slate-950 uppercase tracking-tight text-sm">Medicamento Controlado / Psicotrópico</Label>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Exige retenção de receita (Portaria 344/98) e guarda em armário/cofre sob chave.</p>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t flex justify-end gap-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => {
              setForm({ 
                name: '', 
                genericName: '', 
                category: 'other', 
                presentation: '', 
                unit: 'cp', 
                currentStock: '', 
                minStock: '', 
                maxStock: '', 
                lot: '', 
                expirationDate: '', 
                location: '', 
                controlled: false 
              });
              setPhantomSuggestion("");
              setShowSuggestions(false);
              toast.info("Campos limpos");
            }}
            className="px-8 h-12 rounded-xl font-black uppercase tracking-widest border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            type="button"
            onClick={handleSave} 
            className="px-10 h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            <Plus className="h-5 w-5 mr-3" />
            Salvar Medicamento no Sistema
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
