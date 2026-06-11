import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle2,
  ShieldAlert,
  UploadCloud,
  FileCheck2,
  Calendar,
  User,
  FileX2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface Doc {
  id: string;
  name: string;
  status: "valid" | "warning" | "expired" | "missing";
  expiry?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffName: string;
  staffRole: string;
}

export function StaffDocumentsModal({
  open,
  onOpenChange,
  staffName,
  staffRole,
}: Props) {
  const [docs, setDocs] = useState<Doc[]>([
    {
      id: "1",
      name: "CRM / Registro Profissional",
      status: "warning",
      expiry: "15/06/2030",
    },
    {
      id: "2",
      name: "Certificado BLS/ACLS",
      status: "valid",
      expiry: "10/12/2032",
    },
    { id: "3", name: "Treinamento NR-32", status: "missing" },
    {
      id: "4",
      name: "Contrato de Serviços",
      status: "valid",
      expiry: "01/01/2035",
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDragTarget(docId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragTarget(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setIsDragging(false);
    setDragTarget(null);

    // Simulate file upload validation
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => {
          if (d.id === docId) {
            return { ...d, status: "valid", expiry: "22/05/2031" };
          }
          return d;
        }),
      );
      toast.success("Documento processado com sucesso!");
    }, 500);
  };

  const simulateClickUpload = (docId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.png";
    input.onchange = () => {
      if (input.files?.length) {
        toast.info("Fazendo upload e validando documento...");
        setTimeout(() => {
          setDocs((prev) =>
            prev.map((d) =>
              d.id === docId
                ? { ...d, status: "valid", expiry: "22/05/2031" }
                : d,
            ),
          );
          toast.success("Documento anexado com sucesso!");
        }, 1500);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem]">
        <DialogHeader className="p-8 bg-gradient-to-r from-blue-600 to-sky-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <FileText className="absolute right-8 top-1/2 -translate-y-1/2 h-24 w-24 text-white/5 pointer-events-none" />

          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <Badge className="bg-white/10 text-white border-none uppercase text-[9px] font-black tracking-widest w-fit mb-1">
                Dossiê do Profissional
              </Badge>
              <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-white">
                {staffName}
              </DialogTitle>
              <DialogDescription className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">
                {staffRole}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docs.map((doc) => (
              <motion.div
                layout
                key={doc.id}
                onDragOver={(e) => handleDragOver(e, doc.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, doc.id)}
                className={cn(
                  "p-5 rounded-3xl border backdrop-blur-md shadow-sm relative overflow-hidden transition-all group",
                  dragTarget === doc.id
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                    : "bg-white/50 dark:bg-slate-900/50 border-white/40 dark:border-white/10",
                  doc.status === "valid"
                    ? "hover:border-emerald-500/30"
                    : doc.status === "warning"
                      ? "hover:border-amber-500/30 bg-amber-500/5 border-amber-500/20"
                      : "hover:border-red-500/30 bg-red-500/5 border-red-500/20",
                )}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-2xl flex items-center justify-center shadow-inner",
                          doc.status === "valid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : doc.status === "warning"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400",
                        )}
                      >
                        {doc.status === "valid" ? (
                          <FileCheck2 className="h-5 w-5" />
                        ) : doc.status === "warning" ? (
                          <FileText className="h-5 w-5" />
                        ) : (
                          <FileX2 className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">
                          {doc.name}
                        </span>
                        {doc.status === "valid" && (
                          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Verificado
                          </span>
                        )}
                        {doc.status === "warning" && (
                          <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3" /> Vence em Breve
                          </span>
                        )}
                        {doc.status === "missing" && (
                          <span className="text-[10px] font-black uppercase text-red-600 tracking-widest flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3" /> Pendente
                          </span>
                        )}
                        {doc.status === "expired" && (
                          <span className="text-[10px] font-black uppercase text-red-600 tracking-widest flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3" /> Vencido
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {doc.expiry && (
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-black/5 dark:bg-white/5 p-2 px-3 rounded-xl w-fit">
                      <Calendar className="h-3.5 w-3.5" />
                      Validade: {doc.expiry}
                    </div>
                  )}

                  {doc.status !== "valid" && (
                    <div
                      onClick={() => simulateClickUpload(doc.id)}
                      className={cn(
                        "mt-2 border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer",
                        dragTarget === doc.id
                          ? "border-primary bg-primary/10"
                          : "border-slate-300 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5",
                      )}
                    >
                      <UploadCloud
                        className={cn(
                          "h-6 w-6",
                          dragTarget === doc.id
                            ? "text-primary animate-bounce"
                            : "text-muted-foreground",
                        )}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                        Arraste o PDF aqui ou{" "}
                        <span className="text-primary">Clique</span>
                      </span>
                    </div>
                  )}

                  {doc.status === "valid" && (
                    <Button
                      variant="outline"
                      className="w-full text-[10px] font-black uppercase tracking-widest h-10 rounded-xl"
                      onClick={() => simulateClickUpload(doc.id)}
                    >
                      Atualizar Documento
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
