-- Este script deve ser executado no SQL Editor do Supabase

-- 1. Cria a tabela para registrar os "Tokens" (IDs) dos aparelhos celulares dos médicos/enfermeiros
CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sector VARCHAR(50) NOT NULL, -- Ex: 'emergencia', 'pediatria'
    push_token TEXT NOT NULL, -- O token gerado pelo Firebase/OneSignal no celular
    platform VARCHAR(20), -- 'ios', 'android', 'web'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Cria a tabela de registro das Notificações disparadas
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    target_sector VARCHAR(50) NOT NULL,
    message_type VARCHAR(20) NOT NULL, -- 'push', 'sms', 'whatsapp'
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal', -- 'normal', 'high', 'critical'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilita o RLS (Row Level Security) para segurança
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Exemplo: Criação de um Trigger Básico
-- Imagine que você tem uma tabela `patients`. 
-- O trigger abaixo escutaria a tabela `patients` e inseriria uma notificação automaticamente se o risco for 'critico'

/*
CREATE OR REPLACE FUNCTION notify_critical_patient()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.risk_level = 'critico' THEN
        INSERT INTO public.notifications (target_sector, message_type, content, priority)
        VALUES ('emergencia', 'push', 'NOVO PACIENTE CRÍTICO DEU ENTRADA!', 'critical');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_critical
AFTER INSERT OR UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION notify_critical_patient();
*/
