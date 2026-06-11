import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Shield, UserCog, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type UserRole =
  | "ADMIN"
  | "MEDICO"
  | "ENFERMEIRO"
  | "TECNICO"
  | "FISIOTERAPEUTA"
  | "NUTRICIONISTA"
  | "PSICOLOGO"
  | "RECEPCAO";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
}

const defaultMockUsers: MockUser[] = [
  {
    id: "1",
    name: "Administrador do Sistema",
    email: "admin@upa.com.br",
    role: "ADMIN",
    status: "active",
  },
  {
    id: "2",
    name: "Dr. Ricardo Braga",
    email: "ricardo@upa.com.br",
    role: "MEDICO",
    status: "active",
  },
  {
    id: "3",
    name: "Enf. Juliana",
    email: "juliana@upa.com.br",
    role: "ENFERMEIRO",
    status: "active",
  },
  {
    id: "4",
    name: "Fisio. Carlos",
    email: "carlos@upa.com.br",
    role: "FISIOTERAPEUTA",
    status: "active",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "MEDICO" as UserRole,
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    const saved = localStorage.getItem("upa_mock_users");
    if (saved) setUsers(JSON.parse(saved));
    else setUsers(defaultMockUsers);
  }, []);

  const saveUsers = (newUsers: MockUser[]) => {
    setUsers(newUsers);
    localStorage.setItem("upa_mock_users", JSON.stringify(newUsers));
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenModal = (user?: MockUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", role: "MEDICO", status: "active" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingUser) {
      const updated = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...formData } : u,
      );
      saveUsers(updated);
      toast.success("Usuário atualizado com sucesso!");
    } else {
      const newUser: MockUser = { ...formData, id: Date.now().toString() };
      saveUsers([...users, newUser]);
      toast.success("Colaborador cadastrado (Mock)!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl flex gap-3 items-start">
        <AlertCircle className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400">
          <strong>Aviso de Protótipo:</strong> O sistema utiliza Supabase para
          autenticação real. Criar usuários por este painel no frontend requer
          Edge Functions/Admin API. Atualmente este painel funciona como um{" "}
          <strong>Mock de Interface</strong> para gerenciar os 120 colaboradores
          visualmente.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#006699] dark:text-sky-400 uppercase tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6" /> Gestão de Colaboradores
          </h1>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Controle de {users.length} acessos e perfis da equipe
            multidisciplinar
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#006699] hover:bg-[#005580] text-white gap-2 rounded-xl h-10 shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      <Card className="border-white/40 dark:border-white/10 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-border/50 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 rounded-xl"
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as UserRole | "ALL")}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Filtrar Cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Cargos</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="MEDICO">Médico</SelectItem>
                  <SelectItem value="ENFERMEIRO">Enfermeiro</SelectItem>
                  <SelectItem value="TECNICO">Técnico Enfermagem</SelectItem>
                  <SelectItem value="FISIOTERAPEUTA">Fisioterapia</SelectItem>
                  <SelectItem value="NUTRICIONISTA">Nutrição</SelectItem>
                  <SelectItem value="PSICOLOGO">Psicologia</SelectItem>
                  <SelectItem value="RECEPCAO">Recepção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-slate-50/50 dark:bg-slate-900/20 border-b">
                <tr>
                  <th className="px-6 py-4 font-black tracking-wider">
                    Colaborador
                  </th>
                  <th className="px-6 py-4 font-black tracking-wider">
                    E-mail
                  </th>
                  <th className="px-6 py-4 font-black tracking-wider">
                    Especialidade
                  </th>
                  <th className="px-6 py-4 font-black tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-muted/30"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#006699]/10 text-[#006699] flex items-center justify-center font-black text-xs">
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">
                              {user.name}
                            </p>
                            <span
                              className={
                                user.status === "active"
                                  ? "text-[9px] font-black uppercase text-emerald-500"
                                  : "text-[9px] font-black uppercase text-rose-500"
                              }
                            >
                              {user.status === "active" ? "Ativo" : "Bloqueado"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="font-bold text-[10px] uppercase tracking-wider"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(user)}
                          className="h-8 text-xs font-bold text-[#006699] hover:bg-[#006699]/10 rounded-lg"
                        >
                          <UserCog className="h-4 w-4 mr-2" /> Editar
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight text-[#006699] dark:text-sky-400 flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              {editingUser ? "Editar Colaborador" : "Novo Colaborador"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nome Completo
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Dra. Ana Silva"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                E-mail Institucional
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Ex: ana.silva@upa.com.br"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Especialidade / Cargo
              </Label>
              <Select
                value={formData.role}
                onValueChange={(v: UserRole) =>
                  setFormData({ ...formData, role: v })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador (TI)</SelectItem>
                  <SelectItem value="MEDICO">Médico</SelectItem>
                  <SelectItem value="ENFERMEIRO">Enfermeiro</SelectItem>
                  <SelectItem value="TECNICO">Técnico de Enfermagem</SelectItem>
                  <SelectItem value="FISIOTERAPEUTA">Fisioterapeuta</SelectItem>
                  <SelectItem value="NUTRICIONISTA">Nutricionista</SelectItem>
                  <SelectItem value="PSICOLOGO">Psicólogo</SelectItem>
                  <SelectItem value="RECEPCAO">Recepção / Triagem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#006699] hover:bg-[#005580] text-white font-bold tracking-wider rounded-xl h-11 mt-2"
            >
              {editingUser ? "Salvar Alterações" : "Cadastrar Colaborador"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
