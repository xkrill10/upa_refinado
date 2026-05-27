import { useState } from "react";
import { Activity, Lock, Mail, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha E-mail e Senha.");
      return;
    }

    setIsLoading(true);
    
    // Supabase Real Authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Acesso Negado", { description: "E-mail ou senha incorretos." });
      } else {
        toast.error("Erro no Login", { description: error.message });
      }
    } else {
      toast.success("Acesso Concedido", { description: "Bem-vindo ao UPA Control." });
      // O redirecionamento agora é automático pelo AuthContext
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-600/30 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="backdrop-blur-2xl bg-slate-900/50 border border-white/10 shadow-2xl rounded-3xl p-8 overflow-hidden relative">
          
          {/* Shine effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

          {/* Logo/Brand */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 border border-sky-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.3)] mb-4 relative group">
              <Activity className="h-8 w-8 text-sky-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
              <div className="absolute inset-0 rounded-2xl bg-sky-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mission-control-title">
              UPA Control
            </h1>
            <p className="text-sky-200/60 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Acesso Restrito
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="E-mail Corporativo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all shadow-inner font-medium"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="Senha de Acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all shadow-inner font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-14 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]",
                isLoading && "opacity-70 cursor-wait"
              )}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verificando Credenciais...
                </>
              ) : (
                <>
                  Validar Acesso
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-2">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Autenticação Criptografada via Supabase
            </p>
            <p className="text-[9px] text-slate-500/70 font-medium">
              Ambiente Seguro • UPA Control V1
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
