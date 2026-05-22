-- Esquema de Banco de Dados para Gestão de Pacientes e Triagem (PostgreSQL/MySQL)

-- Tabela de Pacientes
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    social_name VARCHAR(255),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(20),
    phone1 VARCHAR(20),
    phone2 VARCHAR(20),
    email VARCHAR(255),
    
    -- Endereço
    cep VARCHAR(9),
    street VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(255),
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    state CHAR(2),
    
    -- Informações Clínicas
    main_complaint TEXT,
    blood_type VARCHAR(5),
    allergies TEXT,
    current_medications TEXT,
    
    -- Status Operacional
    status VARCHAR(20) DEFAULT 'waiting', -- waiting, attending, completed
    risk_level VARCHAR(20),              -- emergency, very-urgent, urgent, less-urgent, not-urgent
    sector VARCHAR(100),                 -- Triagem, Consultório 1, Sala Vermelha, etc.
    
    arrival_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Logs de Triagem (Histórico)
CREATE TABLE triage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    flowchart_id VARCHAR(50),
    classification VARCHAR(20),
    details JSONB, -- Armazena as perguntas e respostas do protocolo
    triage_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    professional_id UUID -- Referência ao profissional que realizou a triagem
);

-- Índices para performance
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_cpf ON patients(cpf);
CREATE INDEX idx_patients_risk ON patients(risk_level);
