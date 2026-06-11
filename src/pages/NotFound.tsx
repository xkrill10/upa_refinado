import { Button } from "@/components/ui/button";
import { MoveLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-foreground/20">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            O recurso solicitado não existe ou foi movido temporariamente. Por
            favor, verifique o endereço ou retorne ao painel central.
          </p>
        </div>
        <div className="pt-6">
          <Button
            onClick={() => navigate("/")}
            className="gap-2 px-8 py-6 rounded-2xl shadow-xl shadow-primary/20"
          >
            <MoveLeft className="h-5 w-5" />
            Voltar ao Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
