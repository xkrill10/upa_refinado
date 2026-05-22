-- Script de Criação do Banco de Dados para o Sistema Hospitalar
-- Compatível com SQL Server (MSSQL)

CREATE DATABASE HospitalDB;
GO

USE HospitalDB;
GO

-- Tabela de Pacientes
CREATE TABLE Patients (
    PatientID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FullName NVARCHAR(200) NOT NULL,
    SocialName NVARCHAR(200),
    CPF CHAR(14) NOT NULL UNIQUE,
    BirthDate DATE NOT NULL,
    Gender NVARCHAR(20),
    MotherName NVARCHAR(200),
    
    -- Contato
    Phone1 NVARCHAR(20),
    Phone2 NVARCHAR(20),
    Email NVARCHAR(100),
    
    -- Endereço
    CEP CHAR(9),
    Street NVARCHAR(200),
    Number NVARCHAR(20),
    Neighborhood NVARCHAR(100),
    City NVARCHAR(100),
    State CHAR(2),
    
    -- Informações Médicas Iniciais
    MainComplaint NVARCHAR(MAX),
    Allergies NVARCHAR(MAX),
    CurrentMedications NVARCHAR(MAX),
    
    -- Status do Sistema
    Status NVARCHAR(20) DEFAULT 'waiting', -- waiting, attending, completed
    RiskLevel NVARCHAR(20), -- emergency, very-urgent, urgent, less-urgent, not-urgent
    ArrivalTime DATETIME DEFAULT GETDATE(),
    Sector NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Tabela de Triagens/Sinais Vitais
CREATE TABLE TriageAssessments (
    AssessmentID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PatientID UNIQUEIDENTIFIER REFERENCES Patients(PatientID),
    BloodPressure NVARCHAR(20),
    OxygenSaturation INT,
    HeartRate INT,
    Temperature DECIMAL(4,1),
    PainLevel INT, -- 0-10
    TriageDate DATETIME DEFAULT GETDATE(),
    ClassifiedRisk NVARCHAR(20),
    NurseNotes NVARCHAR(MAX),
    PerformedBy NVARCHAR(100) -- Nome ou ID do enfermeiro
);

-- Índices para Performance
CREATE INDEX IX_Patients_CPF ON Patients(CPF);
CREATE INDEX IX_Patients_Status ON Patients(Status);
CREATE INDEX IX_Patients_Risk ON Patients(RiskLevel);
GO

-- Procedure para Admissão Simples
CREATE PROCEDURE sp_AdmitPatient
    @Name NVARCHAR(200),
    @SocialName NVARCHAR(200) = NULL,
    @CPF CHAR(14),
    @BirthDate DATE,
    @Gender NVARCHAR(20),
    @MainComplaint NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Patients (FullName, SocialName, CPF, BirthDate, Gender, MainComplaint)
    VALUES (@Name, @SocialName, @CPF, @BirthDate, @Gender, @MainComplaint);
    
    SELECT SCOPE_IDENTITY() AS NewID;
END;
GO
