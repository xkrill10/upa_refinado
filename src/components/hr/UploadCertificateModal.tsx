import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, CheckCircle2, ShieldAlert, Calendar, FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadCertificateModal({ open, onOpenChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: ""
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      toast.success("Arquivo anexado com sucesso!");
    }
  };

  const simulateClickUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.png';
    input.onchange = () => {
      if (input.files?.length) {
        setFile(input.files[0]);
        toast.success("Arquivo anexado com sucesso!");
      }
    };
    input.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Por favor, anexe o atestado médico.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error("Preencha as datas de início e fim do afastamento.");
      return;
    }

    toast.info("Enviando atestado...");
    setTimeout(() => {
      toast.success("Atestado enviado com sucesso!", {
        description: "O RH avaliará seu documento em breve."
      });
      onOpenChange(false);
      setFile(null);
      setFormData({ startDate: "", endDate: "", reason: "" });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <FilePlus2 className="absolute right-8 top-1/2 -translate-y-1/2 h-24 w-24 text-white/10 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                <FilePlus2 className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
                Comunicação de Ausência
              </Badge>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tight mission-control-title">
              Enviar Atestado Médico
            </DialogTitle>
            <DialogDescription className="text-emerald-50 font-medium">
              Anexe seu atestado ou declaração para justificar sua ausência na escala.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-6">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={!file ? simulateClickUpload : undefined}
              className={cn(
                "border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden",
                isDragging ? "border-emerald-500 bg-emerald-500/10 ring-4 ring-emerald-500/20" : 
                file ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-300 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-4 text-center pointer-events-none"
                  >
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <UploadCloud className={cn("h-8 w-8 text-emerald-600 dark:text-emerald-400 transition-transform", isDragging && "scale-125 animate-bounce")} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Arraste seu documento aqui ou <span className="text-emerald-600 dark:text-emerald-400">clique para buscar</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG ou PNG (Máx 5MB)</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="file"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-4 w-full"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{file.name}</p>
                      <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Arquivo Anexado
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    >
                      Remover
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Data Início</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    className="pl-10 h-14 rounded-2xl border-emerald-500/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
                    value={formData.startDate}
                    onChange={(e) => setFormData(p => ({ ...p, startDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Data Fim</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    className="pl-10 h-14 rounded-2xl border-emerald-500/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
                    value={formData.endDate}
                    onChange={(e) => setFormData(p => ({ ...p, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Observações (Opcional)</Label>
              <Textarea 
                placeholder="Ex: Atestado de 2 dias referente ao plantão de sábado..."
                className="resize-none h-20 rounded-2xl border-emerald-500/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
                value={formData.reason}
                onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full rounded-xl h-14 font-black uppercase tracking-widest text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Enviar Documentação
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
