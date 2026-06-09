import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plug, Server, Activity, Key, CheckCircle2, AlertCircle, RefreshCcw, Network, Ambulance, FlaskConical, MessageSquare, Globe } from "lucide-react";

export default function CentralIntegracoes() {
  const integracoes = [
    {
      nome: "RNDS - Ministério da Saúde",
      descricao: "Envio de Resumo de Atendimento Clínico (RAC) via HL7 FHIR.",
      status: "online",
      ultimaSinc: "Hoje, 15:45",
      icone: Server,
      tipo: "Governamental"
    },
    {
      nome: "e-SUS APS",
      descricao: "Sincronização de prontuários com a Atenção Primária à Saúde.",
      status: "offline",
      ultimaSinc: "Ontem, 23:00",
      icone: Network,
      tipo: "Governamental"
    },
    {
      nome: "Gateway ICP-Brasil",
      descricao: "Validador de assinaturas digitais de prontuários (A1/A3).",
      status: "online",
      ultimaSinc: "Tempo Real",
      icone: Key,
      tipo: "Segurança"
    },
    {
      nome: "TISS / TUSS (ANS)",
      descricao: "Integração de códigos de faturamento para convênios e auditoria.",
      status: "online",
      ultimaSinc: "01/06/2026",
      icone: Activity,
      tipo: "Financeiro"
    },
    {
      nome: "Consulta CPF (Receita Federal)",
      descricao: "Validação de dados cadastrais de pacientes na recepção.",
      status: "online",
      ultimaSinc: "Tempo Real",
      icone: Network,
      tipo: "Governamental"
    },
    {
      nome: "CadSUS (Cartão Nacional de Saúde)",
      descricao: "Busca automática de CNS e histórico do paciente no SUS.",
      status: "online",
      ultimaSinc: "Tempo Real",
      icone: Server,
      tipo: "Governamental"
    },
    {
      nome: "CROSS / SISREG (Regulação)",
      descricao: "Central de regulação para transferência de pacientes críticos (UTI).",
      status: "online",
      ultimaSinc: "Hoje, 16:20",
      icone: Ambulance,
      tipo: "Governamental"
    },
    {
      nome: "LIS / PACS (Laboratório e Imagem)",
      descricao: "Comunicação direta com máquinas de Raio-X (DICOM) e Sangue (HL7).",
      status: "online",
      ultimaSinc: "Tempo Real",
      icone: FlaskConical,
      tipo: "Equipamentos"
    },
    {
      nome: "WhatsApp Business API",
      descricao: "Disparo automático de mensagens (Painel de senhas e laudos).",
      status: "offline",
      ultimaSinc: "Aguardando Token",
      icone: MessageSquare,
      tipo: "Comunicação"
    },
    {
      nome: "ViaCEP (Correios)",
      descricao: "Preenchimento automático de endereço do paciente na Recepção.",
      status: "online",
      ultimaSinc: "Tempo Real",
      icone: Globe,
      tipo: "Utilitário"
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full pb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/20">
          <Plug className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
            Central de Integrações
          </h1>
          <h2 className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            Gerenciamento de APIs e Conexões Externas
          </h2>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
        Painel de demonstração arquitetural. Aqui serão configurados os Webhooks, chaves de API (Tokens) e monitorados os status das conexões do UPA Control com órgãos governamentais (SUS, CFM) e sistemas de faturamento.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
        {integracoes.map((api, index) => (
          <Card key={index} className="shadow-md border-slate-200/60 dark:border-slate-800 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <api.icone className="h-5 w-5" />
                </div>
                <Badge variant="outline" className={api.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}>
                  {api.status === 'online' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                  {api.status.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-base mt-4 font-bold text-slate-800 dark:text-white">{api.nome}</CardTitle>
              <Badge variant="secondary" className="w-fit text-[10px] mt-1 uppercase">{api.tipo}</Badge>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{api.descricao}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold uppercase">Última Sincronização:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{api.ultimaSinc}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full text-xs font-semibold h-8">Configurar Chaves</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-violet-600 bg-violet-50 hover:bg-violet-100" title="Testar Conexão">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-6 rounded-2xl border border-dashed border-violet-300 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-900/10 flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
          <Plug className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Marketplace de Integrações</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-4">
          Nossa arquitetura está preparada para receber novos plugins. Quando o banco de dados for estabelecido, novas conexões poderão ser ativadas com apenas um clique.
        </p>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 shadow-md shadow-violet-500/20">
          Explorar Novos Plugins
        </Button>
      </div>
    </div>
  );
}
