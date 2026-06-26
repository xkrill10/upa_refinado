import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Lock, UserCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DoubleCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (checkerName: string) => void;
  medicationName: string;
}

// Fictional nurses for the mock
const MOCK_NURSES = [
  { id: "1", name: "Enf. Ana Rosa" },
  { id: "2", name: "Enf. Carlos Mendes" },
  { id: "3", name: "Enf. Julia Campos" },
  { id: "4", name: "Enf. Supervisor Marcos" },
];

export function DoubleCheckModal({
  isOpen,
  onClose,
  onSuccess,
  medicationName,
}: DoubleCheckModalProps) {
  const [selectedNurse, setSelectedNurse] = useState("");
  const [pin, setPin] = useState("");

  const handleAuthenticate = () => {
    if (!selectedNurse.trim()) {
      toast.error("Digite o COREN ou Usuário do profissional.");
      return;
    }
    if (pin.length < 4) {
      toast.error("Digite o PIN (senha) de 4 dígitos.");
      return;
    }
    
    // In a real app, verify the PIN against the database
    // Here we just accept anything >= 4 chars for the mock
    onSuccess(`COREN: ${selectedNurse}`);
    setPin("");
    setSelectedNurse("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] border-amber-500/30 glass-card-premium">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <ShieldAlert className="h-5 w-5" />
            Dupla Checagem Obrigatória
          </DialogTitle>
          <DialogDescription className="text-amber-500/80 font-medium">
            Alta Vigilância: {medicationName}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-sm mb-2 mt-2">
          <p className="text-amber-600 font-bold flex items-center gap-2">
            <Lock className="h-4 w-4" /> Autorização Necessária
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            A administração deste medicamento exige a conferência visual e a
            assinatura (PIN) de um segundo Enfermeiro.
          </p>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nurse" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-cyan-500" />
              COREN / Usuário do Conferente
            </Label>
            <Input
              id="nurse"
              placeholder="Ex: 123456"
              value={selectedNurse}
              onChange={(e) => setSelectedNurse(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pin" className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-500" />
              PIN (Senha)
            </Label>
            <Input
              id="pin"
              type="password"
              placeholder="****"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="font-mono text-center tracking-[1em]"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleAuthenticate}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold"
          >
            Autenticar e Administrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
