import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PackageOpen, Boxes, AlertTriangle, ArrowRightLeft, Check, X, Edit, RotateCcw, ClipboardList, MapPin, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useInventory, InventoryItem } from "@/context/InventoryContext";

export default function Inventory() {
  const {
    items,
    requisitions,
    processRequisition,
    adjustStock,
    simulateRequisition,
    resetInventory
  } = useInventory();

  const [activeTab, setActiveTab] = useState("stock");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newStockValue, setNewStockValue] = useState("");

  // Stats calculation
  const totalStockItems = items.reduce((acc, item) => acc + item.currentStock, 0);
  const criticalItemsCount = items.filter(item => item.currentStock <= item.minStock).length;
  const pendingReqsCount = requisitions.filter(r => r.status === 'pending').length;

  const handleOpenAdjust = (item: InventoryItem) => {
    setEditingItem(item);
    setNewStockValue(String(item.currentStock));
  };

  const handleSaveStock = () => {
    if (editingItem && newStockValue !== "") {
      const val = parseInt(newStockValue, 10);
      if (!isNaN(val)) {
        adjustStock(editingItem.id, val);
        setEditingItem(null);
      }
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'consumables': return 'Consumíveis';
      case 'solutions': return 'Soluções/Soros';
      case 'needles_syringes': return 'Seringas & Agulhas';
      case 'diagnostics': return 'Diagnósticos/Exames';
      default: return cat;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <PackageOpen className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-emerald-600 border-emerald-500/20">
              Logística & Suprimentos
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Almoxarifado</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Controle de insumos gerais, seringas, gases e materiais.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button 
            onClick={simulateRequisition}
            className="font-bold text-xs uppercase tracking-widest gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-500/20 h-11 px-6 rounded-xl"
          >
            Simular Nova Requisição
          </Button>
          <Button 
            onClick={resetInventory}
            variant="outline" 
            className="font-bold text-xs uppercase tracking-widest gap-2 bg-background/50 backdrop-blur-sm border-white/20 h-11 px-4 rounded-xl text-red-500 hover:text-white hover:bg-red-500"
          >
            <RotateCcw className="w-4 h-4" /> Resetar Estoque
          </Button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total de Itens em Estoque", icon: Boxes, value: totalStockItems.toLocaleString('pt-BR'), color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Itens em Estoque Crítico", icon: AlertTriangle, value: criticalItemsCount, color: criticalItemsCount > 0 ? "text-red-500" : "text-emerald-500", bg: criticalItemsCount > 0 ? "bg-red-500/10" : "bg-emerald-500/10" },
          { title: "Requisições Pendentes", icon: ArrowRightLeft, value: pendingReqsCount, color: pendingReqsCount > 0 ? "text-amber-500" : "text-slate-450", bg: pendingReqsCount > 0 ? "bg-amber-500/10" : "bg-slate-500/10" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-6 glass-card border-white/20 dark:border-white/5 relative overflow-hidden group hover:shadow-lg transition-all rounded-2xl">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</span>
                  <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-black/5 dark:bg-white/5 border border-white/10 p-1 w-full justify-start overflow-x-auto rounded-2xl">
          <TabsTrigger value="stock" className="text-[10px] font-black uppercase tracking-widest rounded-xl">Estoque Atual</TabsTrigger>
          <TabsTrigger value="pending" className="text-[10px] font-black uppercase tracking-widest rounded-xl text-amber-500 data-[state=active]:bg-amber-500/10">
            Requisições ({pendingReqsCount})
          </TabsTrigger>
          <TabsTrigger value="history" className="text-[10px] font-black uppercase tracking-widest rounded-xl">Histórico de Pedidos</TabsTrigger>
        </TabsList>

        {/* Tab 1: Stock list */}
        <TabsContent value="stock">
          <Card className="p-6 glass-card border-white/20 dark:border-white/5 overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border pb-3">
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Material</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categoria</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Localização</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Estoque Atual</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Estoque Mín</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/45">
                  {items.map(item => {
                    const isCritical = item.currentStock <= item.minStock;
                    return (
                      <tr key={item.id} className="hover:bg-slate-500/5 transition-colors group">
                        <td className="py-4 font-bold text-sm text-foreground">{item.name}</td>
                        <td className="py-4">
                          <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wider bg-slate-500/5 border-slate-500/20">
                            {getCategoryLabel(item.category)}
                          </Badge>
                        </td>
                        <td className="py-4 text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                          {item.location}
                        </td>
                        <td className="py-4 text-center font-black text-sm">
                          {item.currentStock} <span className="text-[10px] text-muted-foreground font-normal">{item.unit}</span>
                        </td>
                        <td className="py-4 text-center text-xs font-bold text-muted-foreground">
                          {item.minStock} {item.unit}
                        </td>
                        <td className="py-4 text-center">
                          {isCritical ? (
                            <Badge className="bg-red-500/10 text-red-500 border-none font-black text-[9px] uppercase px-2.5 py-0.5">
                              Estoque Crítico
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] uppercase px-2.5 py-0.5">
                              Normal
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg font-bold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                            onClick={() => handleOpenAdjust(item)}
                          >
                            <Edit className="w-3.5 h-3.5 mr-1" /> Ajustar
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Pending requisitions */}
        <TabsContent value="pending">
          <div className="space-y-6">
            {requisitions.filter(r => r.status === 'pending').length === 0 ? (
              <Card className="p-12 glass-card border-white/20 text-center flex flex-col items-center justify-center min-h-[250px] rounded-2xl">
                <ClipboardList className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-1">Nenhum Pedido Pendente</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Todos os pedidos dos setores de enfermagem foram processados e atendidos.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {requisitions.filter(r => r.status === 'pending').map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-6 glass-card border-white/20 hover:border-amber-500/20 transition-all rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-amber-500 text-white font-black text-[9px] uppercase border-none px-2 py-0">
                                PENDENTE
                              </Badge>
                              <h3 className="font-black text-base text-foreground uppercase tracking-tight">
                                {req.sector}
                              </h3>
                            </div>
                            <div className="text-xs text-muted-foreground font-semibold flex flex-wrap items-center gap-3 uppercase tracking-wider">
                              <span>Solicitado por: <strong>{req.requestedBy}</strong></span>
                              <span>·</span>
                              <span>Data/Hora: <strong>{new Date(req.requestedAt).toLocaleString('pt-BR')}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-4 gap-1.5 shadow-md shadow-emerald-500/10"
                              onClick={() => processRequisition(req.id, 'approved', 'Almoxarife Carlos')}
                            >
                              <Check className="w-4 h-4" /> Aprovar e Baixar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-10 rounded-xl border-red-200 text-red-500 hover:text-white hover:bg-red-500 text-xs font-black uppercase tracking-wider px-4 gap-1.5"
                              onClick={() => processRequisition(req.id, 'rejected', 'Almoxarife Carlos')}
                            >
                              <X className="w-4 h-4" /> Rejeitar
                            </Button>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-border/45">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Itens Solicitados</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {req.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-500/5 border border-slate-500/10">
                                <span className="font-bold text-xs truncate mr-2">{item.itemName}</span>
                                <span className="text-xs font-black text-foreground shrink-0 bg-slate-500/15 px-2 py-0.5 rounded-md">
                                  {item.quantity} un
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: History */}
        <TabsContent value="history">
          <div className="space-y-4">
            {requisitions.filter(r => r.status !== 'pending').length === 0 ? (
              <Card className="p-12 glass-card border-white/20 text-center flex flex-col items-center justify-center min-h-[250px] rounded-2xl">
                <History className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-1">Sem Histórico</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Nenhum pedido foi processado até o momento nesta sessão.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 text-left">
                {requisitions.filter(r => r.status !== 'pending').map((req) => {
                  const isApproved = req.status === 'approved';
                  return (
                    <Card key={req.id} className="p-5 glass-card border-white/20 rounded-2xl relative overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                      <div className={`absolute top-0 left-0 w-1 h-full ${isApproved ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <Badge className={`font-black text-[9px] uppercase border-none px-2 py-0 ${isApproved ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                              {isApproved ? 'APROVADO' : 'REJEITADO'}
                            </Badge>
                            <h3 className="font-bold text-sm text-foreground uppercase tracking-tight">
                              {req.sector}
                            </h3>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-semibold flex flex-wrap items-center gap-3 uppercase tracking-wider">
                            <span>Solicitado por: <strong>{req.requestedBy}</strong></span>
                            <span>·</span>
                            <span>Em: <strong>{new Date(req.requestedAt).toLocaleString('pt-BR')}</strong></span>
                          </div>
                        </div>

                        {req.processedAt && (
                          <div className="text-right text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            <span>Processado em: <strong>{new Date(req.processedAt).toLocaleString('pt-BR')}</strong></span>
                            <br />
                            <span>Por: <strong>{req.processedBy}</strong></span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/30">
                        <div className="flex flex-wrap gap-2">
                          {req.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-500/5 border border-slate-500/10 text-xs font-semibold">
                              <span>{item.itemName}</span>
                              <span className="font-black text-[10px] text-foreground bg-slate-500/15 px-1.5 py-0.2 rounded">
                                {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Adjust stock dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        {editingItem && (
          <DialogContent className="sm:max-w-md p-8 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shadow-inner">
                <Boxes className="h-8 w-8 text-emerald-600" />
              </div>
              
              <div className="space-y-2 w-full">
                <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-slate-100">
                  Ajustar Estoque
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Ajuste a quantidade em estoque para:<br />
                  <strong className="text-foreground text-sm">{editingItem.name}</strong>
                </DialogDescription>
              </div>

              <div className="w-full space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                  Quantidade Atual em Estoque ({editingItem.unit}):
                </label>
                <Input
                  type="number"
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  className="h-12 rounded-xl px-4 text-sm font-bold border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 w-full pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800"
                  onClick={() => setEditingItem(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-xl text-white font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                  onClick={handleSaveStock}
                >
                  Salvar Alteração
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
