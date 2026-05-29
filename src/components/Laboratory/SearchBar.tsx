import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Filters {
  status: string;
  priority: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Filters) => void;
}

export function SearchBar({ onSearch, onFilter }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => onSearch(query.trim().toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  // Notify filter changes immediately
  useEffect(() => {
    onFilter({ 
      status: status === "all" ? "" : status, 
      priority: priority === "all" ? "" : priority 
    });
  }, [status, priority, onFilter]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Buscar por paciente, exame ou ticket…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending_collection">Aguardando Coleta</SelectItem>
          <SelectItem value="in_analysis">Em Análise</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
        </SelectContent>
      </Select>
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="normal">Rotina</SelectItem>
          <SelectItem value="urgent">Urgente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
