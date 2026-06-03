import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stethoscope, Baby, DoorOpen, User, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { cn, formatWords } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ROOMS = [
  { id: "CONSULTÓRIO CLÍNICO 1", name: "Consultório Clínico 1", type: "adult", icon: Stethoscope, color: "blue" },
  { id: "CONSULTÓRIO CLÍNICO 2", name: "Consultório Clínico 2", type: "adult", icon: Stethoscope, color: "blue" },
  { id: "CONSULTÓRIO CLÍNICO 3", name: "Consultório Clínico 3", type: "adult", icon: Stethoscope, color: "blue" },
  { id: "CONSULTÓRIO CLÍNICO 4", name: "Consultório Clínico 4", type: "adult", icon: Stethoscope, color: "blue" },
  { id: "CONSULTÓRIO CLÍNICO 5", name: "Consultório Clínico 5", type: "adult", icon: Stethoscope, color: "blue" },
  { id: "CONSULTÓRIO CLÍNICO 6", name: "Consultório Clínico 6", type: "adult", icon: Stethoscope, color: "blue" },

  { id: "CONSULTÓRIO PEDIÁTRICO 1", name: "Consultório Pediátrico 1", type: "pediatric", icon: Baby, color: "orange" },
  { id: "CONSULTÓRIO PEDIÁTRICO 2", name: "Consultório Pediátrico 2", type: "pediatric", icon: Baby, color: "orange" },
  { id: "CONSULTÓRIO PEDIÁTRICO 3", name: "Consultório Pediátrico 3", type: "pediatric", icon: Baby, color: "orange" },
  { id: "SALA VERMELHA", name: "Sala Vermelha", type: "emergency", icon: AlertTriangle, color: "red" },
  { id: "SALA DE EMERGÊNCIA 1", name: "Sala de Emergência 1", type: "emergency", icon: AlertTriangle, color: "red" },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<typeof ROOMS[0] | null>(null);
  const [doctorName, setDoctorName] = useState("");
  const [crmNumber, setCrmNumber] = useState(() => localStorage.getItem("upa_stamp_number") || "");
  const [crmState, setCrmState] = useState(() => localStorage.getItem("upa_stamp_state") || "");
  const [occupiedRooms, setOccupiedRooms] = useState<Record<string, string>>({});
  const currentRoomId = localStorage.getItem("upa_active_room");
  const lastColorRef = useRef<string>("blue");

  const handleSelectRoom = (room: typeof ROOMS[0]) => {
    setSelectedRoom(room);
    const savedDoctor = localStorage.getItem("upa_active_doctor");
    const savedCrm = localStorage.getItem("upa_stamp_number") || "";
    const savedState = localStorage.getItem("upa_stamp_state") || "SP";
    const isMyRoom = localStorage.getItem("upa_active_room") === room.id;
    
    if (isMyRoom && savedDoctor) {
      let initialName = savedDoctor;
      if (!/^dr[a]?\.?\s+/i.test(initialName.trim())) {
        initialName = `Dr. ${initialName.trim()}`;
      }
      setDoctorName(initialName);
      setCrmNumber(savedCrm);
      setCrmState(savedState);
    } else {
      setDoctorName("Dr. ");
      setCrmNumber("");
      setCrmState("");
    }
  };

  useEffect(() => {
    if (selectedRoom) {
      lastColorRef.current = selectedRoom.color;
    }
  }, [selectedRoom]);

  useEffect(() => {
    // In a real app, this would be fetched from a server.
    // For now, let's just see if the current browser has a room logged in.
    const currentRoom = localStorage.getItem("upa_active_room");
    const currentDoctor = localStorage.getItem("upa_active_doctor");
    
    if (currentRoom && currentDoctor) {
      setOccupiedRooms(prev => ({ ...prev, [currentRoom]: currentDoctor }));
    }
  }, []);

  const handleAssumir = () => {
    if (!selectedRoom || !doctorName.trim()) return;

    localStorage.setItem("upa_active_room", selectedRoom.id);
    localStorage.setItem("upa_active_doctor", doctorName.trim());
    
    // Salvar carimbo digital integrado para evoluções e prescrições
    localStorage.setItem("upa_stamp_name", doctorName.trim());
    localStorage.setItem("upa_stamp_council", "CRM");
    localStorage.setItem("upa_stamp_number", crmNumber.trim());
    localStorage.setItem("upa_stamp_state", (crmState || "SP").trim());
    localStorage.setItem("upa_shift_start", new Date().toISOString());

    navigate("/meu-consultorio");
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] p-4 sm:p-8 pt-12 sm:pt-20 relative">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl w-full z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 mb-2">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
            Painel de Plantão
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs max-w-xl mx-auto opacity-80">
            Selecione uma sala disponível para iniciar seu turno de atendimento.
          </p>
        </div>

        <Tabs defaultValue="adult" className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 p-1.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-2xl h-14">
              <TabsTrigger 
                value="adult" 
                className="rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest data-[state=active]:bg-[#006699] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                <Stethoscope className="h-4 w-4 mr-1 sm:mr-2" />
                Adulto
              </TabsTrigger>
              <TabsTrigger 
                value="pediatric" 
                className="rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                <Baby className="h-4 w-4 mr-1 sm:mr-2" />
                Pediatria
              </TabsTrigger>
              <TabsTrigger 
                value="emergency" 
                className="rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                <AlertTriangle className="h-4 w-4 mr-1 sm:mr-2" />
                Emergência
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="adult" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROOMS.filter(r => r.type === 'adult').map((room) => {
                const isOccupied = !!occupiedRooms[room.id];
                const occupant = occupiedRooms[room.id];
                const isOccupiedByMe = currentRoomId === room.id;
                const Icon = room.icon;

                return (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={cn(
                        "relative overflow-hidden cursor-pointer transition-all duration-300 h-full border-2",
                        isOccupiedByMe
                          ? "border-emerald-500/40 dark:border-emerald-400/40 hover:border-emerald-500/60 shadow-[0_4px_20px_0_rgba(16,185,129,0.1)] bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-xl"
                          : isOccupied 
                          ? "opacity-80 border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md hover:border-slate-400 dark:hover:border-slate-600" 
                          : "border-[#006699]/20 dark:border-sky-400/20 hover:border-[#006699]/40 dark:hover:border-sky-400/40 hover:shadow-[0_8px_32px_0_rgba(0,102,153,0.15)] dark:hover:shadow-[0_8px_32px_0_rgba(14,165,233,0.15)] bg-gradient-to-br from-[#006699]/10 to-[#006699]/5 dark:from-[#006699]/20 dark:to-[#006699]/10 backdrop-blur-xl shadow-[0_4px_16px_0_rgba(0,0,0,0.05)]"
                      )}
                      onClick={() => handleSelectRoom(room)}
                    >
                      <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
                        <div className={cn(
                          "p-4 rounded-2xl transition-colors",
                          isOccupiedByMe
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : isOccupied 
                            ? "bg-red-500/10 text-red-500 dark:text-red-400"
                            : "bg-[#006699]/15 text-[#006699] dark:bg-sky-400/20 dark:text-sky-400"
                        )}>
                          <Icon className="h-8 w-8" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-foreground">
                            {room.name}
                          </h3>
                          <div className="flex justify-center">
                            {isOccupiedByMe ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Sua Sala - Voltar</span>
                              </div>
                            ) : isOccupied ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <span>Ocupado: {occupant}</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-[#006699]/15 text-[#006699] dark:bg-sky-400/20 dark:text-sky-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#006699] dark:bg-sky-400 animate-pulse" />
                                Livre para Entrada
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="pediatric" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROOMS.filter(r => r.type === 'pediatric').map((room) => {
                const isOccupied = !!occupiedRooms[room.id];
                const occupant = occupiedRooms[room.id];
                const isOccupiedByMe = currentRoomId === room.id;
                const Icon = room.icon;

                return (
                  <motion.div
                    key={room.id}
                    whileHover={!isOccupied || isOccupiedByMe ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isOccupied || isOccupiedByMe ? { scale: 0.98 } : {}}
                  >
                    <Card 
                      className={cn(
                        "relative overflow-hidden cursor-pointer transition-all duration-300 h-full border-2",
                        isOccupiedByMe
                          ? "border-emerald-500/40 dark:border-emerald-400/40 hover:border-emerald-500/60 shadow-[0_4px_20px_0_rgba(16,185,129,0.1)] bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-xl"
                          : isOccupied 
                          ? "opacity-80 border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md hover:border-slate-400 dark:hover:border-slate-600" 
                          : "border-orange-500/20 dark:border-orange-400/20 hover:border-orange-500/40 dark:hover:border-orange-400/40 hover:shadow-[0_8px_32px_0_rgba(249,115,22,0.15)] dark:hover:shadow-[0_8px_32px_0_rgba(249,115,22,0.15)] bg-gradient-to-br from-orange-500/10 to-orange-500/5 dark:from-orange-500/20 dark:to-orange-500/10 backdrop-blur-xl shadow-[0_4px_16px_0_rgba(0,0,0,0.05)]"
                      )}
                      onClick={() => handleSelectRoom(room)}
                    >
                      <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
                        <div className={cn(
                          "p-4 rounded-2xl transition-colors",
                          isOccupiedByMe
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : isOccupied 
                            ? "bg-red-500/10 text-red-500 dark:text-red-400"
                            : "bg-orange-500/15 text-orange-600 dark:bg-orange-400/20 dark:text-orange-400"
                        )}>
                          <Icon className="h-8 w-8" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-foreground">
                            {room.name}
                          </h3>
                          <div className="flex justify-center">
                            {isOccupiedByMe ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Sua Sala - Voltar</span>
                              </div>
                            ) : isOccupied ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <span>Ocupado: {occupant}</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-orange-500/15 text-orange-600 dark:bg-orange-400/20 dark:text-orange-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse" />
                                Livre para Entrada
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROOMS.filter(r => r.type === 'emergency').map((room) => {
                const isOccupied = !!occupiedRooms[room.id];
                const occupant = occupiedRooms[room.id];
                const isOccupiedByMe = currentRoomId === room.id;
                const Icon = room.icon;

                return (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={cn(
                        "relative overflow-hidden cursor-pointer transition-all duration-300 h-full border-2",
                        isOccupiedByMe
                          ? "border-emerald-500/40 dark:border-emerald-400/40 hover:border-emerald-500/60 shadow-[0_4px_20px_0_rgba(16,185,129,0.1)] bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-xl"
                          : isOccupied 
                          ? "opacity-80 border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md hover:border-slate-400 dark:hover:border-slate-600" 
                          : "border-red-600/20 dark:border-red-500/20 hover:border-red-600/40 dark:hover:border-red-500/40 hover:shadow-[0_8px_32px_0_rgba(220,38,38,0.15)] dark:hover:shadow-[0_8px_32px_0_rgba(239,68,68,0.15)] bg-gradient-to-br from-red-600/10 to-red-600/5 dark:from-red-500/20 dark:to-red-500/10 backdrop-blur-xl shadow-[0_4px_16px_0_rgba(0,0,0,0.05)]"
                      )}
                      onClick={() => handleSelectRoom(room)}
                    >
                      <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
                        <div className={cn(
                          "p-4 rounded-2xl transition-colors",
                          isOccupiedByMe
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : isOccupied 
                            ? "bg-slate-500/10 text-slate-500 dark:text-slate-400"
                            : "bg-red-600/15 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                        )}>
                          <Icon className="h-8 w-8" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-black text-sm sm:text-base uppercase tracking-tight text-foreground">
                            {room.name}
                          </h3>
                          <div className="flex justify-center">
                            {isOccupiedByMe ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Sua Sala - Voltar</span>
                              </div>
                            ) : isOccupied ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                <span>Ocupado: {occupant}</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-red-600/15 text-red-600 dark:bg-red-500/20 dark:text-red-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 animate-pulse" />
                                Livre para Entrada
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        {selectedRoom && (() => {
          const isSelectedRoomOccupied = !!occupiedRooms[selectedRoom.id];
          const occupantOfSelectedRoom = occupiedRooms[selectedRoom.id];
          const isSelectedOccupiedByMe = currentRoomId === selectedRoom.id;
          
          const willOverwrite = isSelectedRoomOccupied && doctorName.trim() && doctorName !== occupantOfSelectedRoom;
          const willResume = isSelectedRoomOccupied && doctorName.trim() === occupantOfSelectedRoom;

          return (
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
              <div className={cn(
                "p-8 text-center text-white relative shadow-lg backdrop-blur-md transition-colors duration-300",
                isSelectedRoomOccupied && !willResume
                  ? "bg-gradient-to-br from-red-600/90 to-red-800/90 dark:from-red-600/50 dark:to-red-900/50"
                  : selectedRoom.color === "blue" 
                  ? "bg-gradient-to-br from-[#006699]/90 to-[#004466]/90 dark:from-sky-600/50 dark:to-sky-900/50"
                  : "bg-gradient-to-br from-orange-500/90 to-orange-700/90 dark:from-orange-600/50 dark:to-orange-900/50"
              )}>
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  {isSelectedRoomOccupied ? <AlertTriangle className="h-8 w-8 text-white" /> : <DoorOpen className="h-8 w-8" />}
                </div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                  {isSelectedRoomOccupied ? "Atenção: Sala Ocupada" : "Assumir Sala"}
                </DialogTitle>
                <DialogDescription className="text-white/80 font-medium text-sm">
                  {isSelectedRoomOccupied ? (
                    <>
                      O <strong className="text-white">{selectedRoom.name}</strong> está logado no momento com o <strong className="text-white">{occupantOfSelectedRoom}</strong>.
                    </>
                  ) : (
                    <>
                      Você está prestes a iniciar os atendimentos no <strong className="text-white">{selectedRoom.name}</strong>.
                    </>
                  )}
                </DialogDescription>
              </div>
              
              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                    Nome Completo do Médico:
                  </label>
                  <Input 
                    value={doctorName}
                    onChange={(e) => setDoctorName(formatWords(e.target.value))}
                    placeholder="Ex: Dr. Ricardo Braga"
                    className={cn(
                      "h-12 rounded-xl px-4 text-sm font-bold border-2 focus-visible:ring-2",
                      willOverwrite ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400" :
                      willResume ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" :
                      "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    )}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                    CRM / UF:
                  </label>
                  <Input 
                    value={`CRM-${crmState}${crmNumber ? ` ${crmNumber}` : ''}`}
                    onChange={(e) => {
                      // Remove fixed prefix and clean
                      const val = e.target.value.toUpperCase().replace('CRM-', '').replace(/[^0-9A-Z]/g, '');
                      // Separate letters (UF) and numbers (CRM)
                      const letters = val.replace(/[^A-Z]/g, '').slice(0, 2);
                      const numbers = val.replace(/[^0-9]/g, '').slice(0, 8);
                      setCrmState(letters);
                      setCrmNumber(numbers);
                    }}
                    placeholder="CRM-SP 123456"
                    className="h-12 rounded-xl px-4 text-sm font-bold border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                  />
                  <p className="text-[10px] text-muted-foreground">Digite a UF e depois os números (ex: SP123456).</p>
                </div>

                {isSelectedRoomOccupied && (
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest text-center mt-2",
                    willOverwrite ? "text-red-500" :
                    willResume ? "text-emerald-500" :
                    "text-slate-500"
                  )}>
                    {willResume ? "Identidade confirmada! Pronto para retomar sessão." :
                     willOverwrite ? "Cuidado! Você irá encerrar a sessão do outro colega." :
                     "Digite seu nome para continuar ou assumir."}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="h-12 rounded-xl font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800"
                    onClick={() => setSelectedRoom(null)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className={cn(
                      "h-12 rounded-xl text-white font-black uppercase tracking-widest border-0 shadow-lg text-[10px] leading-tight",
                      willOverwrite 
                        ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                        : willResume
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                        : selectedRoom.color === "blue" 
                        ? "bg-[#006699] hover:bg-[#005580] shadow-blue-500/20 dark:bg-sky-500 dark:hover:bg-sky-600"
                        : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
                    )}
                    onClick={handleAssumir}
                    disabled={!doctorName.trim()}
                  >
                    {willOverwrite ? "Sobrescrever Sessão" : willResume ? "Retomar Sessão" : "Entrar na Sala"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          );
        })()}
      </Dialog>
    </div>
  );
}
