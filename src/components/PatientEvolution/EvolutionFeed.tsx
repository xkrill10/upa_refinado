import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Activity } from "lucide-react";
import { format } from "date-fns";

export type MockEvolution = {
  id: string;
  timestamp: Date;
  role: string;
  professionalName: string;
  content: string;
  type: string;
};

type Props = {
  feed: MockEvolution[];
};

export function EvolutionFeed({ feed }: Props) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full animate-in slide-in-from-bottom-4 duration-500">
      {feed.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 font-medium">Nenhuma evolução registrada ainda.</p>
        </div>
      ) : (
        feed.map((ev) => (
          <Card key={ev.id} className="border-l-4 shadow-sm" style={{ borderLeftColor: ev.role === 'medico' ? '#10b981' : '#3b82f6' }}>
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{ev.type}</CardTitle>
                  <div className="text-sm text-slate-500 font-medium">
                    {ev.professionalName}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-500 gap-1 bg-slate-100 px-2 py-1 rounded-md">
                <Clock className="h-4 w-4" />
                {format(ev.timestamp, "dd/MM/yyyy HH:mm")}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap">{ev.content}</p>
            </CardContent>
          </Card>
        ))
      )}
      
      <div className="flex items-center gap-4 text-slate-400 py-4 justify-center">
        <Activity className="h-5 w-5" />
        <span className="text-sm font-medium">Fim do Histórico</span>
      </div>
    </div>
  );
}
