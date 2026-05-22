import { useState, useMemo } from 'react';
import { Medication, Movement, MedicationCategory, MovementType } from '@/lib/pharmacy-store';

const initialMedications: Medication[] = [
  // Adrenalina / Emergência (Vermelha)
  { id: 'e1', name: 'ADRENALINA 1MG/ML', genericName: 'EPINEFRINA', category: 'emergency', currentStock: 45, minStock: 20, maxStock: 200, presentation: 'Ampola 1ml', unit: 'amp', lot: 'A2201', expirationDate: '2027-04-15', location: 'CARRINHO-01', controlled: false },
  { id: 'e2', name: 'AMIODARONA 50MG/ML', genericName: 'ANCORON', category: 'emergency', currentStock: 12, minStock: 15, maxStock: 100, presentation: 'Ampola 3ml', unit: 'amp', lot: 'A3302', expirationDate: '2027-08-20', location: 'CARRINHO-01', controlled: false },
  { id: 'e3', name: 'ATROPINA 0,25MG/ML', genericName: 'ATROPION', category: 'emergency', currentStock: 22, minStock: 20, maxStock: 150, presentation: 'Ampola 1ml', unit: 'amp', lot: 'A4403', expirationDate: '2026-12-10', location: 'CARRINHO-01', controlled: false },
  { id: 'e4', name: 'DOPAMINA 5MG/ML', genericName: 'REVIVAN', category: 'emergency', currentStock: 8, minStock: 10, maxStock: 50, presentation: 'Ampola 10ml', unit: 'amp', lot: 'D5504', expirationDate: '2027-01-30', location: 'CARRINHO-02', controlled: false },
  { id: 'e5', name: 'DOBUTAMINA 12,5MG/ML', genericName: 'DOBUTREX', category: 'emergency', currentStock: 15, minStock: 10, maxStock: 80, presentation: 'Ampola 20ml', unit: 'amp', lot: 'D6605', expirationDate: '2026-11-25', location: 'CARRINHO-02', controlled: false },
  { id: 'e6', name: 'ETOMIDATO 2MG/ML', genericName: 'HYPNOMIDATE', category: 'emergency', currentStock: 10, minStock: 5, maxStock: 40, presentation: 'Ampola 10ml', unit: 'amp', lot: 'E7706', expirationDate: '2027-03-12', location: 'CARRINHO-01', controlled: false },
  { id: 'e7', name: 'SUCCINILCOLINA 100MG', genericName: 'QUELICIN', category: 'emergency', currentStock: 18, minStock: 10, maxStock: 60, presentation: 'Frasco-ampola', unit: 'fr', lot: 'S8807', expirationDate: '2027-05-18', location: 'CARRINHO-01', controlled: false },
  { id: 'e8', name: 'ROCURÔNIO 10MG/ML', genericName: 'ESMERON', category: 'emergency', currentStock: 25, minStock: 15, maxStock: 100, presentation: 'Ampola 5ml', unit: 'amp', lot: 'R9908', expirationDate: '2026-09-05', location: 'CARRINHO-01', controlled: false },
  { id: 'e9', name: 'VASOPRESSINA 20UI/ML', genericName: 'ENCRIDIL', category: 'emergency', currentStock: 5, minStock: 8, maxStock: 30, presentation: 'Ampola 1ml', unit: 'amp', lot: 'V0009', expirationDate: '2027-02-14', location: 'CARRINHO-02', controlled: false },
  { id: 'e10', name: 'ADENOSINA 3MG/ML', genericName: 'ADENOCARD', category: 'emergency', currentStock: 20, minStock: 10, maxStock: 100, presentation: 'Ampola 2ml', unit: 'amp', lot: 'A1110', expirationDate: '2027-06-22', location: 'CARRINHO-01', controlled: false },

  // Quimioterapia (Amarela)
  { id: 'q1', name: 'CISPLATINA 50MG', genericName: 'CISPLATINA', category: 'chemotherapy', currentStock: 15, minStock: 10, maxStock: 50, presentation: 'Frasco-ampola', unit: 'fr', lot: 'Q1101', expirationDate: '2027-04-10', location: 'QUIMIO-01', controlled: false },
  { id: 'q2', name: 'DOXORRUBICINA 50MG', genericName: 'ADRIAMICINA', category: 'chemotherapy', currentStock: 12, minStock: 5, maxStock: 40, presentation: 'Frasco-ampola', unit: 'fr', lot: 'Q2202', expirationDate: '2027-09-01', location: 'QUIMIO-01', controlled: false },
  { id: 'q3', name: 'PACLITAXEL 30MG', genericName: 'TAXOL', category: 'chemotherapy', currentStock: 20, minStock: 10, maxStock: 80, presentation: 'Frasco-ampola 5ml', unit: 'fr', lot: 'Q3303', expirationDate: '2026-10-15', location: 'QUIMIO-01', controlled: false },
  { id: 'q4', name: 'MTX 500MG', genericName: 'METOTREXATO', category: 'chemotherapy', currentStock: 30, minStock: 15, maxStock: 100, presentation: 'Frasco-ampola', unit: 'fr', lot: 'Q4404', expirationDate: '2027-01-20', location: 'QUIMIO-02', controlled: false },
  { id: 'q5', name: 'CICLOFOSFAMIDA 1G', genericName: 'GENUXAL', category: 'chemotherapy', currentStock: 10, minStock: 5, maxStock: 40, presentation: 'Frasco-ampola', unit: 'fr', lot: 'Q5505', expirationDate: '2027-03-30', location: 'QUIMIO-02', controlled: false },
  { id: 'q6', name: 'FLUOROURACILA 500MG', genericName: '5-FU', category: 'chemotherapy', currentStock: 100, minStock: 50, maxStock: 500, presentation: 'Ampola 10ml', unit: 'amp', lot: 'Q6606', expirationDate: '2027-05-12', location: 'QUIMIO-02', controlled: false },
  { id: 'q7', name: 'OXALIPLATINA 100MG', genericName: 'ELOXATIN', category: 'chemotherapy', currentStock: 8, minStock: 5, maxStock: 30, presentation: 'Frasco-ampola', unit: 'fr', lot: 'Q7707', expirationDate: '2027-11-10', location: 'QUIMIO-01', controlled: false },
  { id: 'q8', name: 'VINCRISTINA 1MG', genericName: 'ONCOVIN', category: 'chemotherapy', currentStock: 25, minStock: 10, maxStock: 100, presentation: 'Frasco-ampola', unit: 'fr', lot: 'Q8808', expirationDate: '2027-02-15', location: 'QUIMIO-01', controlled: false },
  { id: 'q9', name: 'ETOPOSÍDEO 100MG', genericName: 'VEPESID', category: 'chemotherapy', currentStock: 40, minStock: 20, maxStock: 150, presentation: 'Ampola 5ml', unit: 'amp', lot: 'Q9909', expirationDate: '2028-01-20', location: 'QUIMIO-02', controlled: false },
  { id: 'q10', name: 'DOCETAXEL 80MG', genericName: 'TAXOTERE', category: 'chemotherapy', currentStock: 15, minStock: 10, maxStock: 60, presentation: 'Frasco-ampola', unit: 'fr', lot: 'Q0010', expirationDate: '2027-04-12', location: 'QUIMIO-01', controlled: false },

  // Uso Enteral (Roxa)
  { id: 'en1', name: 'NUTRI ENTERAL 1.0', genericName: 'DIETA ENTERAL', category: 'enteral', currentStock: 200, minStock: 100, maxStock: 1000, presentation: 'Sistema Fechado 1L', unit: 'un', lot: 'EN1101', expirationDate: '2027-09-30', location: 'ENTERAL-01', controlled: false },
  { id: 'en2', name: 'FRESUBIN HP ENERGY', genericName: 'DIETA HIPERPROTEICA', category: 'enteral', currentStock: 150, minStock: 80, maxStock: 600, presentation: 'Bolsa 500ml', unit: 'un', lot: 'EN2202', expirationDate: '2027-12-05', location: 'ENTERAL-01', controlled: false },
  { id: 'en3', name: 'ISOSOURCE 1.5', genericName: 'DIETA ENTERAL', category: 'enteral', currentStock: 180, minStock: 90, maxStock: 800, presentation: 'Sistema Fechado 1L', unit: 'un', lot: 'EN3303', expirationDate: '2027-03-01', location: 'ENTERAL-01', controlled: false },
  { id: 'en4', name: 'NOVASOURCE GC', genericName: 'DIETA P/ DIABÉTICOS', category: 'enteral', currentStock: 100, minStock: 50, maxStock: 400, presentation: 'Sistema Fechado 1L', unit: 'un', lot: 'EN4404', expirationDate: '2026-11-20', location: 'ENTERAL-02', controlled: false },
  { id: 'en5', name: 'PEPTAMEN AF', genericName: 'DIETA OLIGOMÉRICA', category: 'enteral', currentStock: 60, minStock: 40, maxStock: 300, presentation: 'Sistema Fechado 1L', unit: 'un', lot: 'EN5505', expirationDate: '2027-06-15', location: 'ENTERAL-02', controlled: false },
  { id: 'en6', name: 'RESOURCE PROTEIN', genericName: 'SUPLEMENTO PROTEICO', category: 'enteral', currentStock: 450, minStock: 200, maxStock: 2000, presentation: 'Frasco 200ml', unit: 'fr', lot: 'EN6606', expirationDate: '2028-02-10', location: 'ENTERAL-03', controlled: false },
  { id: 'en7', name: 'DIAMEL', genericName: 'DIETA P/ DIABÉTICOS', category: 'enteral', currentStock: 120, minStock: 60, maxStock: 500, presentation: 'Tetra Pak 1L', unit: 'un', lot: 'EN7707', expirationDate: '2027-10-25', location: 'ENTERAL-02', controlled: false },
  { id: 'en8', name: 'TROPHIC BASIC', genericName: 'DIETA ENTERAL', category: 'enteral', currentStock: 300, minStock: 150, maxStock: 1200, presentation: 'Lata 800g', unit: 'lat', lot: 'EN8808', expirationDate: '2026-12-01', location: 'ENTERAL-03', controlled: false },
  { id: 'en9', name: 'FIBERSOURCE', genericName: 'DIETA COM FIBRAS', category: 'enteral', currentStock: 140, minStock: 70, maxStock: 600, presentation: 'Sistema Fechado 1L', unit: 'un', lot: 'EN9909', expirationDate: '2027-07-20', location: 'ENTERAL-02', controlled: false },
  { id: 'en10', name: 'IMPACT', genericName: 'DIETA IMUNOMODULADORA', category: 'enteral', currentStock: 80, minStock: 40, maxStock: 300, presentation: 'Sistema Fechado 1L', unit: 'un', lot: 'EN0010', expirationDate: '2027-05-10', location: 'ENTERAL-01', controlled: false },

  // Não Padronizados (Salmão)
  { id: 'np1', name: 'SECUKINUMABE 150MG', genericName: 'COSENTYX', category: 'non-standard', currentStock: 5, minStock: 2, maxStock: 20, presentation: 'Caneta Preenchida', unit: 'un', lot: 'NP1101', expirationDate: '2027-10-30', location: 'ESPECIAL-01', controlled: false },
  { id: 'np2', name: 'UPADACITINIBE 15MG', genericName: 'RINVOQ', category: 'non-standard', currentStock: 30, minStock: 15, maxStock: 90, presentation: 'Comprimido', unit: 'cp', lot: 'NP2202', expirationDate: '2027-06-15', location: 'ESPECIAL-01', controlled: false },
  { id: 'np3', name: 'RITUXIMABE 500MG', genericName: 'MABTHERA', category: 'non-standard', currentStock: 2, minStock: 1, maxStock: 10, presentation: 'Frasco-ampola', unit: 'fr', lot: 'NP3303', expirationDate: '2027-11-20', location: 'GELADEIRA-01', controlled: false },
  { id: 'np4', name: 'ECULIZUMABE 300MG', genericName: 'SOLIRIS', category: 'non-standard', currentStock: 8, minStock: 4, maxStock: 20, presentation: 'Frasco-ampola', unit: 'fr', lot: 'NP4404', expirationDate: '2026-12-10', location: 'GELADEIRA-01', controlled: false },
  { id: 'np5', name: 'BARICITINIBE 4MG', genericName: 'OLUMIANT', category: 'non-standard', currentStock: 28, minStock: 14, maxStock: 84, presentation: 'Comprimido', unit: 'cp', lot: 'NP5505', expirationDate: '2027-03-05', location: 'ESPECIAL-01', controlled: false },
  { id: 'np6', name: 'AFATINIBE 40MG', genericName: 'GIOTRIF', category: 'non-standard', currentStock: 30, minStock: 30, maxStock: 90, presentation: 'Comprimido', unit: 'cp', lot: 'NP6606', expirationDate: '2027-08-15', location: 'ESPECIAL-02', controlled: false },
  { id: 'np7', name: 'NINTEDANIBE 150MG', genericName: 'OFEV', category: 'non-standard', currentStock: 60, minStock: 60, maxStock: 180, presentation: 'Cápsula', unit: 'cap', lot: 'NP7707', expirationDate: '2026-09-30', location: 'ESPECIAL-02', controlled: false },
  { id: 'np8', name: 'IVACAFTOR 150MG', genericName: 'KALYDECO', category: 'non-standard', currentStock: 56, minStock: 56, maxStock: 112, presentation: 'Comprimido', unit: 'cp', lot: 'NP8808', expirationDate: '2027-01-20', location: 'ESPECIAL-02', controlled: false },
  { id: 'np9', name: 'LAROTRECTINIBE 100MG', genericName: 'VITRAKVI', category: 'non-standard', currentStock: 30, minStock: 30, maxStock: 90, presentation: 'Cápsula', unit: 'cap', lot: 'NP9909', expirationDate: '2026-12-15', location: 'ESPECIAL-02', controlled: false },
  { id: 'np10', name: 'PEMBROLIZUMABE 100MG', genericName: 'KEYTRUDA', category: 'non-standard', currentStock: 4, minStock: 2, maxStock: 15, presentation: 'Frasco-ampola', unit: 'fr', lot: 'NP0010', expirationDate: '2027-05-22', location: 'GELADEIRA-01', controlled: false },

  // Narcóticos (Portaria 344-A)
  { id: 'n1', name: 'MORFINA 10MG/ML', genericName: 'SULFATO DE MORFINA', category: 'narcotic', currentStock: 45, minStock: 20, maxStock: 200, presentation: 'Ampola 1ml', unit: 'amp', lot: 'M2201', expirationDate: '2027-04-15', location: 'COFRE-01', controlled: true },
  { id: 'n2', name: 'FENTANIL 0,05MG/ML', genericName: 'CITRATO DE FENTANILA', category: 'narcotic', currentStock: 12, minStock: 15, maxStock: 100, presentation: 'Ampola 2ml', unit: 'amp', lot: 'F3302', expirationDate: '2027-08-20', location: 'COFRE-01', controlled: true },
  { id: 'n3', name: 'TRAMADOL 50MG/ML', genericName: 'TRAMADOL', category: 'narcotic', currentStock: 22, minStock: 20, maxStock: 150, presentation: 'Ampola 2ml', unit: 'amp', lot: 'T4403', expirationDate: '2026-12-10', location: 'COFRE-02', controlled: true },
  { id: 'n4', name: 'PETIDINA 50MG/ML', genericName: 'PETIDINA', category: 'narcotic', currentStock: 8, minStock: 10, maxStock: 50, presentation: 'Ampola 2ml', unit: 'amp', lot: 'P5504', expirationDate: '2027-01-30', location: 'COFRE-01', controlled: true },
  { id: 'n5', name: 'METADONA 10MG', genericName: 'METADONA', category: 'narcotic', currentStock: 60, minStock: 30, maxStock: 300, presentation: 'Comprimido', unit: 'cp', lot: 'M6605', expirationDate: '2026-11-25', location: 'COFRE-02', controlled: true },
  { id: 'n6', name: 'CODEÍNA 30MG', genericName: 'FOSFATO DE CODEÍNA', category: 'narcotic', currentStock: 15, minStock: 20, maxStock: 200, presentation: 'Comprimido', unit: 'cp', lot: 'C7706', expirationDate: '2027-03-12', location: 'COFRE-02', controlled: true },
  { id: 'n7', name: 'OXICODONA 10MG', genericName: 'OXICODONA', category: 'narcotic', currentStock: 25, minStock: 15, maxStock: 100, presentation: 'Comprimido', unit: 'cp', lot: 'O8807', expirationDate: '2027-05-18', location: 'COFRE-02', controlled: true },
  { id: 'n8', name: 'REMIFENTANILA 2MG', genericName: 'REMIFENTANILA', category: 'narcotic', currentStock: 5, minStock: 10, maxStock: 40, presentation: 'Frasco-ampola', unit: 'fr', lot: 'R9908', expirationDate: '2026-09-05', location: 'COFRE-01', controlled: true },
  { id: 'n9', name: 'ALFENTANILA 0,5MG/ML', genericName: 'ALFENTANILA', category: 'narcotic', currentStock: 18, minStock: 10, maxStock: 60, presentation: 'Ampola 5ml', unit: 'amp', lot: 'A0009', expirationDate: '2027-02-14', location: 'COFRE-01', controlled: true },
  { id: 'n10', name: 'HIDROMORFONA 2MG', genericName: 'HIDROMORFONA', category: 'narcotic', currentStock: 20, minStock: 15, maxStock: 100, presentation: 'Comprimido', unit: 'cp', lot: 'H1110', expirationDate: '2027-06-22', location: 'COFRE-02', controlled: true },
  { id: 'n11', name: 'SUFENTANILA 5MCG/ML', genericName: 'SUFENTANILA', category: 'narcotic', currentStock: 7, minStock: 15, maxStock: 50, presentation: 'Ampola 2ml', unit: 'amp', lot: 'S2211', expirationDate: '2027-04-10', location: 'COFRE-01', controlled: true },
  { id: 'n12', name: 'OXICODONA 20MG', genericName: 'OXICODONA', category: 'narcotic', currentStock: 30, minStock: 15, maxStock: 80, presentation: 'Comprimido', unit: 'cp', lot: 'O3312', expirationDate: '2027-09-01', location: 'COFRE-02', controlled: true },
  { id: 'n13', name: 'METADONA 5MG', genericName: 'METADONA', category: 'narcotic', currentStock: 40, minStock: 20, maxStock: 200, presentation: 'Comprimido', unit: 'cp', lot: 'M4413', expirationDate: '2026-10-15', location: 'COFRE-02', controlled: true },
  { id: 'n14', name: 'MORFINA 30MG', genericName: 'MORFINA', category: 'narcotic', currentStock: 50, minStock: 25, maxStock: 150, presentation: 'Comprimido', unit: 'cp', lot: 'M5514', expirationDate: '2027-01-20', location: 'COFRE-02', controlled: true },
  { id: 'n15', name: 'MORFINA 10MG (SC)', genericName: 'MORFINA', category: 'narcotic', currentStock: 20, minStock: 15, maxStock: 100, presentation: 'Ampola 1ml', unit: 'amp', lot: 'M6615', expirationDate: '2027-03-30', location: 'COFRE-01', controlled: true },

  // Psicotrópicos (Portaria 344-B/C)
  { id: 'p1', name: 'DIAZEPAM 10MG', genericName: 'DIAZEPAM', category: 'psychotropic', currentStock: 500, minStock: 200, maxStock: 2000, presentation: 'Comprimido', unit: 'cp', lot: 'D2201', expirationDate: '2027-05-30', location: 'ARMARIO-C', controlled: true },
  { id: 'p2', name: 'DIAZEPAM 5MG/ML', genericName: 'DIAZEPAM', category: 'psychotropic', currentStock: 85, minStock: 50, maxStock: 300, presentation: 'Ampola 2ml', unit: 'amp', lot: 'D3302', expirationDate: '2027-11-10', location: 'ARMARIO-C', controlled: true },
  { id: 'p3', name: 'MIDAZOLAM 5MG/ML', genericName: 'MIDAZOLAM', category: 'psychotropic', currentStock: 42, minStock: 30, maxStock: 200, presentation: 'Ampola 3ml', unit: 'amp', lot: 'M4403', expirationDate: '2027-02-15', location: 'ARMARIO-C', controlled: true },
  { id: 'p4', name: 'CLONAZEPAM 2MG', genericName: 'CLONAZEPAM', category: 'psychotropic', currentStock: 300, minStock: 100, maxStock: 1500, presentation: 'Comprimido', unit: 'cp', lot: 'C5504', expirationDate: '2028-01-20', location: 'ARMARIO-C', controlled: true },
  { id: 'p5', name: 'FENOBARBITAL 100MG', genericName: 'FENOBARBITAL', category: 'psychotropic', currentStock: 150, minStock: 100, maxStock: 800, presentation: 'Comprimido', unit: 'cp', lot: 'F6605', expirationDate: '2027-04-12', location: 'ARMARIO-C', controlled: true },
  { id: 'p6', name: 'HALOPERIDOL 5MG', genericName: 'HALOPERIDOL', category: 'psychotropic', currentStock: 180, minStock: 50, maxStock: 500, presentation: 'Comprimido', unit: 'cp', lot: 'H7706', expirationDate: '2027-09-30', location: 'ARMARIO-C', controlled: true },
  { id: 'p7', name: 'ALPRAZOLAM 0,5MG', genericName: 'ALPRAZOLAM', category: 'psychotropic', currentStock: 200, minStock: 100, maxStock: 1000, presentation: 'Comprimido', unit: 'cp', lot: 'A8807', expirationDate: '2027-12-05', location: 'ARMARIO-C', controlled: true },
  { id: 'p8', name: 'CLOMIPRAMINA 25MG', genericName: 'CLOMIPRAMINA', category: 'psychotropic', currentStock: 90, minStock: 40, maxStock: 300, presentation: 'Drágea', unit: 'cp', lot: 'C9908', expirationDate: '2027-03-01', location: 'ARMARIO-C', controlled: true },
  { id: 'p9', name: 'FENITOÍNA 100MG', genericName: 'FENITOÍNA', category: 'psychotropic', currentStock: 60, minStock: 100, maxStock: 500, presentation: 'Comprimido', unit: 'cp', lot: 'F0009', expirationDate: '2026-11-20', location: 'ARMARIO-C', controlled: true },
  { id: 'p10', name: 'LORAZEPAM 2MG', genericName: 'LORAZEPAM', category: 'psychotropic', currentStock: 110, minStock: 50, maxStock: 400, presentation: 'Comprimido', unit: 'cp', lot: 'L1110', expirationDate: '2027-06-15', location: 'ARMARIO-C', controlled: true },
  { id: 'p11', name: 'FLUOXETINA 20MG', genericName: 'FLUOXETINA', category: 'psychotropic', currentStock: 450, minStock: 200, maxStock: 2000, presentation: 'Cápsula', unit: 'cap', lot: 'F2211', expirationDate: '2028-02-10', location: 'ARMARIO-C', controlled: true },
  { id: 'p12', name: 'AMITRIPTILINA 25MG', genericName: 'AMITRIPTILINA', category: 'psychotropic', currentStock: 320, minStock: 150, maxStock: 1200, presentation: 'Comprimido', unit: 'cp', lot: 'A3312', expirationDate: '2027-10-25', location: 'ARMARIO-C', controlled: true },
  { id: 'p13', name: 'VALPROATO DE SÓDIO 250MG/5ML', genericName: 'VALPROATO', category: 'psychotropic', currentStock: 45, minStock: 30, maxStock: 150, presentation: 'Xarope 100ml', unit: 'fr', lot: 'V4413', expirationDate: '2026-12-01', location: 'ARMARIO-C', controlled: true },
  { id: 'p14', name: 'RISPERIDONA 2MG', genericName: 'RISPERIDONA', category: 'psychotropic', currentStock: 150, minStock: 50, maxStock: 600, presentation: 'Comprimido', unit: 'cp', lot: 'R5514', expirationDate: '2027-07-20', location: 'ARMARIO-C', controlled: true },
  { id: 'p15', name: 'LEVOMEPROMAZINA 25MG', genericName: 'LEVOMEPROMAZINA', category: 'psychotropic', currentStock: 80, minStock: 40, maxStock: 300, presentation: 'Comprimido', unit: 'cp', lot: 'L6615', expirationDate: '2027-05-10', location: 'ARMARIO-C', controlled: true },

  // Alta Vigilância (High-Alert / Eletrólitos Concentrados)
  { id: 'h1', name: 'CLORETO DE POTÁSSIO 19,1%', genericName: 'KCL 19,1%', category: 'high-alert', currentStock: 30, minStock: 50, maxStock: 300, presentation: 'Ampola 10ml', unit: 'amp', lot: 'K2201', expirationDate: '2027-10-30', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h2', name: 'SULFATO DE MAGNÉSIO 50%', genericName: 'MGSO4 50%', category: 'high-alert', currentStock: 25, minStock: 30, maxStock: 150, presentation: 'Ampola 10ml', unit: 'amp', lot: 'M3302', expirationDate: '2027-06-15', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h3', name: 'CLORETO DE SÓDIO 20%', genericName: 'NACL 20%', category: 'high-alert', currentStock: 45, minStock: 50, maxStock: 400, presentation: 'Ampola 10ml', unit: 'amp', lot: 'N4403', expirationDate: '2027-11-20', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h4', name: 'GLUCONATO DE CÁLCIO 10%', genericName: 'CÁLCIO 10%', category: 'high-alert', currentStock: 20, minStock: 40, maxStock: 200, presentation: 'Ampola 10ml', unit: 'amp', lot: 'G5504', expirationDate: '2026-12-10', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h5', name: 'HEPARINA 5.000 UI/ML', genericName: 'HEPARINA SÓDICA', category: 'high-alert', currentStock: 15, minStock: 20, maxStock: 100, presentation: 'Frasco-ampola 5ml', unit: 'fr', lot: 'H6605', expirationDate: '2027-03-05', location: 'GELADEIRA-01', controlled: false },
  { id: 'h6', name: 'ENOXAPARINA 40MG', genericName: 'CRXAN', category: 'high-alert', currentStock: 35, minStock: 25, maxStock: 150, presentation: 'Seringa Preenchida', unit: 'un', lot: 'E7706', expirationDate: '2027-08-15', location: 'GELADEIRA-01', controlled: false },
  { id: 'h7', name: 'NORADRENALINA 1MG/ML', genericName: 'NOREPINEFRINA', category: 'high-alert', currentStock: 10, minStock: 40, maxStock: 200, presentation: 'Ampola 4ml', unit: 'amp', lot: 'N8807', expirationDate: '2026-09-30', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h8', name: 'DOPAMINA 5MG/ML', genericName: 'DOPAMINA', category: 'high-alert', currentStock: 28, minStock: 30, maxStock: 100, presentation: 'Ampola 10ml', unit: 'amp', lot: 'D9908', expirationDate: '2027-01-20', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h9', name: 'NITROPRUSSIATO DE SÓDIO', genericName: 'NIPRIDE', category: 'high-alert', currentStock: 12, minStock: 10, maxStock: 40, presentation: 'Frasco-ampola', unit: 'fr', lot: 'N0009', expirationDate: '2026-12-15', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h10', name: 'VARFARINA SÓDICA 5MG', genericName: 'MAREVAN', category: 'high-alert', currentStock: 80, minStock: 50, maxStock: 400, presentation: 'Comprimido', unit: 'cp', lot: 'V1110', expirationDate: '2027-05-22', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h11', name: 'AMIODARONA 50MG/ML', genericName: 'AMIODARONA', category: 'high-alert', currentStock: 40, minStock: 20, maxStock: 100, presentation: 'Ampola 3ml', unit: 'amp', lot: 'A2211', expirationDate: '2027-02-15', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h12', name: 'TIROFIBANA 0,25MG/ML', genericName: 'AGRASTAT', category: 'high-alert', currentStock: 5, minStock: 10, maxStock: 30, presentation: 'Frasco 12,5ml', unit: 'fr', lot: 'T3312', expirationDate: '2026-10-10', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h13', name: 'DIGOXINA 0,25MG', genericName: 'DIGOXINA', category: 'high-alert', currentStock: 100, minStock: 50, maxStock: 500, presentation: 'Comprimido', unit: 'cp', lot: 'D4413', expirationDate: '2027-11-20', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h14', name: 'ATROPINA 0,25MG/ML', genericName: 'SULFATO DE ATROPINA', category: 'high-alert', currentStock: 20, minStock: 50, maxStock: 200, presentation: 'Ampola 1ml', unit: 'amp', lot: 'A5514', expirationDate: '2026-11-05', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h15', name: 'ADRENALINA 1MG/ML', genericName: 'EPINEFRINA', category: 'high-alert', currentStock: 15, minStock: 60, maxStock: 300, presentation: 'Ampola 1ml', unit: 'amp', lot: 'A6615', expirationDate: '2026-08-15', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h16', name: 'INSULINA HUMULIN R U-500', genericName: 'INSULINA REGULAR CONCENTRADA', category: 'high-alert', currentStock: 5, minStock: 10, maxStock: 40, presentation: 'Frasco 20ml', unit: 'fr', lot: 'I7716', expirationDate: '2027-10-12', location: 'GELADEIRA-01', controlled: false },
  { id: 'h17', name: 'PROMETAZINA 50MG/2ML', genericName: 'FENERGAN', category: 'high-alert', currentStock: 40, minStock: 50, maxStock: 300, presentation: 'Ampola 2ml', unit: 'amp', lot: 'P8817', expirationDate: '2027-02-28', location: 'PRATELEIRA-V', controlled: false },
  { id: 'h18', name: 'VASELO 10% (CLORETO POTÁSSIO)', genericName: 'KCL CONCENTRADO', category: 'high-alert', currentStock: 12, minStock: 20, maxStock: 100, presentation: 'Ampola 10ml', unit: 'amp', lot: 'V9918', expirationDate: '2026-11-15', location: 'PRATELEIRA-V', controlled: false },

  // Termolábeis (Cadeia de Frio)
  { id: 't1', name: 'INSULINA NPH', genericName: 'INSULINA NPH', category: 'thermolabile', currentStock: 150, minStock: 100, maxStock: 1000, presentation: 'Frasco 10ml', unit: 'fr', lot: 'I1101', expirationDate: '2027-04-30', location: 'GELADEIRA-01', controlled: false },
  { id: 't2', name: 'INSULINA REGULAR', genericName: 'INSULINA REGULAR', category: 'thermolabile', currentStock: 80, minStock: 50, maxStock: 500, presentation: 'Frasco 10ml', unit: 'fr', lot: 'I2202', expirationDate: '2027-05-15', location: 'GELADEIRA-01', controlled: false },
  { id: 't3', name: 'VACINA HEPATITE B', genericName: 'VACINA HEPATITE B', category: 'thermolabile', currentStock: 200, minStock: 100, maxStock: 1000, presentation: 'Frasco 0,5ml', unit: 'fr', lot: 'V3303', expirationDate: '2027-09-20', location: 'GELADEIRA-02', controlled: false },
  { id: 't4', name: 'VACINA INFLUENZA', genericName: 'VACINA GRIPE', category: 'thermolabile', currentStock: 50, minStock: 200, maxStock: 2000, presentation: 'Frasco Monodose', unit: 'fr', lot: 'V4404', expirationDate: '2026-06-30', location: 'GELADEIRA-02', controlled: false },
  { id: 't5', name: 'SORO ANTIESCORPIÔNICO', genericName: 'SORO ESCORPIÃO', category: 'thermolabile', currentStock: 15, minStock: 25, maxStock: 100, presentation: 'Ampola 5ml', unit: 'amp', lot: 'S5505', expirationDate: '2026-07-10', location: 'GELADEIRA-03', controlled: false },
  { id: 't6', name: 'SORO ANTIOFÍDICO', genericName: 'SORO SERPENTE', category: 'thermolabile', currentStock: 8, minStock: 10, maxStock: 50, presentation: 'Ampola 10ml', unit: 'amp', lot: 'S6606', expirationDate: '2026-08-05', location: 'GELADEIRA-03', controlled: false },
  { id: 't7', name: 'VACINA BCG', genericName: 'VACINA BCG', category: 'thermolabile', currentStock: 40, minStock: 50, maxStock: 300, presentation: 'Frasco Multidose', unit: 'fr', lot: 'V7707', expirationDate: '2026-10-30', location: 'GELADEIRA-02', controlled: false },
  { id: 't8', name: 'VACINA TRÍPLICE VIRAL', genericName: 'VACINA SCR', category: 'thermolabile', currentStock: 120, minStock: 100, maxStock: 800, presentation: 'Frasco Monodose', unit: 'fr', lot: 'V8808', expirationDate: '2027-02-15', location: 'GELADEIRA-02', controlled: false },
  { id: 't9', name: 'ERITROPOETINA 4.000 UI', genericName: 'ERITROPOETINA', category: 'thermolabile', currentStock: 60, minStock: 40, maxStock: 200, presentation: 'Frasco-ampola', unit: 'fr', lot: 'E9909', expirationDate: '2027-03-22', location: 'GELADEIRA-01', controlled: false },
  { id: 't10', name: 'INTERFERON ALFA 2B', genericName: 'INTERFERON', category: 'thermolabile', currentStock: 25, minStock: 20, maxStock: 100, presentation: 'Frasco-ampola', unit: 'fr', lot: 'I0010', expirationDate: '2027-01-15', location: 'GELADEIRA-01', controlled: false },
  { id: 't11', name: 'OCITOCINA 5UI/ML', genericName: 'SYNTOCINON', category: 'thermolabile', currentStock: 90, minStock: 50, maxStock: 300, presentation: 'Ampola 1ml', unit: 'amp', lot: 'O1111', expirationDate: '2027-06-10', location: 'GELADEIRA-01', controlled: false },
  { id: 't12', name: 'SURFACTANTE ALVEOFACT', genericName: 'SURFACTANTE', category: 'thermolabile', currentStock: 12, minStock: 10, maxStock: 40, presentation: 'Frasco-ampola', unit: 'fr', lot: 'S2212', expirationDate: '2026-11-25', location: 'GELADEIRA-01', controlled: false },
  { id: 't13', name: 'VACINA VIP/VOP', genericName: 'VACINA POLIO', category: 'thermolabile', currentStock: 150, minStock: 100, maxStock: 1000, presentation: 'Frasco-ampola', unit: 'fr', lot: 'V3313', expirationDate: '2027-09-12', location: 'GELADEIRA-02', controlled: false },
  { id: 't14', name: 'VACINA PENTA', genericName: 'VACINA PENTAVALENTE', category: 'thermolabile', currentStock: 80, minStock: 100, maxStock: 800, presentation: 'Frasco Monodose', unit: 'fr', lot: 'V4414', expirationDate: '2026-10-18', location: 'GELADEIRA-02', controlled: false },
  { id: 't15', name: 'IMUNOGLOBULINA ANTI-D', genericName: 'RHOPHYLAC', category: 'thermolabile', currentStock: 10, minStock: 15, maxStock: 50, presentation: 'Seringa Preenchida', unit: 'un', lot: 'I5515', expirationDate: '2027-03-25', location: 'GELADEIRA-03', controlled: false },

  // Itens de Giro Geral (Para completar volume)
  // Giro Geral (Padronizados SUS / UBS / UPA)
  { id: 'g1', name: 'DIPIRONA SÓDICA 500MG', genericName: 'DIPIRONA', category: 'general', currentStock: 1500, minStock: 500, maxStock: 5000, presentation: 'Comprimido', unit: 'cp', lot: 'L1010', expirationDate: '2027-12-31', location: 'A1-P1', controlled: false },
  { id: 'g2', name: 'DIPIRONA GOTAS', genericName: 'DIPIRONA', category: 'general', currentStock: 450, minStock: 200, maxStock: 2000, presentation: 'Frasco 20ml', unit: 'fr', lot: 'L2020', expirationDate: '2027-05-15', location: 'A1-P2', controlled: false },
  { id: 'g3', name: 'AMOXICILINA 500MG', genericName: 'AMOXICILINA', category: 'antibiotic', currentStock: 600, minStock: 200, maxStock: 2000, presentation: 'Cápsula', unit: 'cap', lot: 'A3030', expirationDate: '2026-12-01', location: 'A2-P1', controlled: false },
  { id: 'g4', name: 'CEFTRIAXONA 1G IV', genericName: 'CEFTRIAXONA', category: 'antibiotic', currentStock: 120, minStock: 50, maxStock: 500, presentation: 'Frasco-ampola', unit: 'fr', lot: 'C4040', expirationDate: '2027-02-15', location: 'A2-P2', controlled: false },
  { id: 'g5', name: 'SALBUTAMOL SPRAY', genericName: 'AEROLIN', category: 'respiratory', currentStock: 100, minStock: 50, maxStock: 300, presentation: 'Aerossol 100mcg', unit: 'fr', lot: 'B5050', expirationDate: '2027-03-10', location: 'C1-P1', controlled: false },
  { id: 'g6', name: 'OMEPRAZOL 20MG', genericName: 'OMEPRAZOL', category: 'gastrointestinal', currentStock: 800, minStock: 200, maxStock: 3000, presentation: 'Cápsula', unit: 'cap', lot: 'O6060', expirationDate: '2028-01-01', location: 'D1-P1', controlled: false },
  { id: 'g7', name: 'SORO FISIOLÓGICO 500ML', genericName: 'NACL 0,9%', category: 'solution', currentStock: 400, minStock: 300, maxStock: 2000, presentation: 'Bolsa', unit: 'bl', lot: 'S7070', expirationDate: '2027-10-10', location: 'DEP-SORO', controlled: false },
  
  // Novos Itens Padronizados REMUME / SUS
  { id: 's1', name: 'RIFAMPICINA 300MG', genericName: 'RIFAMPICINA', category: 'antibiotic', currentStock: 120, minStock: 50, maxStock: 400, presentation: 'Cápsula', unit: 'cap', lot: 'RF1101', expirationDate: '2027-08-30', location: 'A2-P3', controlled: false },
  { id: 's2', name: 'AZITROMICINA 500MG', genericName: 'AZITROMICINA', category: 'antibiotic', currentStock: 250, minStock: 100, maxStock: 800, presentation: 'Comprimido', unit: 'cp', lot: 'AZ2202', expirationDate: '2027-11-15', location: 'A2-P3', controlled: false },
  { id: 's3', name: 'LOSARTANA POTÁSSICA 50MG', genericName: 'LOSARTANA', category: 'general', currentStock: 2000, minStock: 500, maxStock: 10000, presentation: 'Comprimido', unit: 'cp', lot: 'LS3303', expirationDate: '2028-04-20', location: 'A3-P1', controlled: false },
  { id: 's4', name: 'METFORMINA 850MG', genericName: 'METFORMINA', category: 'general', currentStock: 1800, minStock: 400, maxStock: 8000, presentation: 'Comprimido', unit: 'cp', lot: 'MT4404', expirationDate: '2028-02-14', location: 'A3-P2', controlled: false },
  { id: 's5', name: 'GLIBENCLAMIDA 5MG', genericName: 'GLIBENCLAMIDA', category: 'general', currentStock: 1200, minStock: 300, maxStock: 5000, presentation: 'Comprimido', unit: 'cp', lot: 'GL5505', expirationDate: '2027-10-10', location: 'A3-P2', controlled: false },
  { id: 's6', name: 'ENALAPRIL 20MG', genericName: 'MALEATO DE ENALAPRIL', category: 'general', currentStock: 1500, minStock: 400, maxStock: 6000, presentation: 'Comprimido', unit: 'cp', lot: 'EN6606', expirationDate: '2027-12-05', location: 'A3-P3', controlled: false },
  { id: 's7', name: 'HIDROCLOROTIAZIDA 25MG', genericName: 'HCTZ', category: 'general', currentStock: 2500, minStock: 600, maxStock: 10000, presentation: 'Comprimido', unit: 'cp', lot: 'HC7707', expirationDate: '2028-06-30', location: 'A3-P3', controlled: false },
  { id: 's8', name: 'ATENOLOL 50MG', genericName: 'ATENOLOL', category: 'general', currentStock: 900, minStock: 300, maxStock: 4000, presentation: 'Comprimido', unit: 'cp', lot: 'AT8808', expirationDate: '2027-09-15', location: 'A3-P4', controlled: false },
  { id: 's9', name: 'SIMVASTATINA 20MG', genericName: 'SIMVASTATINA', category: 'general', currentStock: 600, minStock: 200, maxStock: 3000, presentation: 'Comprimido', unit: 'cp', lot: 'ST9909', expirationDate: '2027-11-20', location: 'A3-P4', controlled: false },
  { id: 's10', name: 'CAPTOPRIL 25MG', genericName: 'CAPTOPRIL', category: 'general', currentStock: 1300, minStock: 400, maxStock: 5000, presentation: 'Comprimido', unit: 'cp', lot: 'CP0010', expirationDate: '2027-04-12', location: 'A3-P5', controlled: false },
  { id: 's11', name: 'PARACETAMOL 500MG', genericName: 'PARACETAMOL', category: 'general', currentStock: 3000, minStock: 1000, maxStock: 10000, presentation: 'Comprimido', unit: 'cp', lot: 'PR1111', expirationDate: '2028-03-30', location: 'A1-P3', controlled: false },
  { id: 's12', name: 'IBUPROFENO 600MG', genericName: 'IBUPROFENO', category: 'general', currentStock: 800, minStock: 300, maxStock: 3000, presentation: 'Comprimido', unit: 'cp', lot: 'IB2212', expirationDate: '2027-10-25', location: 'A1-P4', controlled: false },
  { id: 's13', name: 'DEXAMETASONA 4MG/ML', genericName: 'DECADRON', category: 'general', currentStock: 150, minStock: 50, maxStock: 500, presentation: 'Ampola 2,5ml', unit: 'amp', lot: 'DX3313', expirationDate: '2027-05-18', location: 'A4-P1', controlled: false },
  { id: 's14', name: 'METOCLOPRAMIDA 10MG/2ML', genericName: 'PLASIL', category: 'general', currentStock: 400, minStock: 100, maxStock: 1500, presentation: 'Ampola 2ml', unit: 'amp', lot: 'MC4414', expirationDate: '2027-02-14', location: 'A4-P2', controlled: false },
  { id: 's15', name: 'SULFAMETOXAZOL+TRIMETOPRIMA', genericName: 'BACTRIM', category: 'antibiotic', currentStock: 500, minStock: 200, maxStock: 2000, presentation: 'Comprimido', unit: 'cp', lot: 'SM5515', expirationDate: '2027-07-20', location: 'A2-P4', controlled: false },
  { id: 's16', name: 'METRONIDAZOL 250MG', genericName: 'METRONIDAZOL', category: 'antibiotic', currentStock: 300, minStock: 100, maxStock: 1000, presentation: 'Comprimido', unit: 'cp', lot: 'MZ6616', expirationDate: '2027-10-15', location: 'A2-P4', controlled: false },
  { id: 's17', name: 'CIPROFLOXACINO 500MG', genericName: 'CIPROFLOXACINO', category: 'antibiotic', currentStock: 450, minStock: 150, maxStock: 1500, presentation: 'Comprimido', unit: 'cp', lot: 'CI7717', expirationDate: '2027-06-30', location: 'A2-P5', controlled: false },
  { id: 's18', name: 'CEFALEXINA 500MG', genericName: 'CEFALEXINA', category: 'antibiotic', currentStock: 600, minStock: 200, maxStock: 2000, presentation: 'Cápsula', unit: 'cap', lot: 'CF8818', expirationDate: '2027-03-12', location: 'A2-P5', controlled: false },
  { id: 's19', name: 'FUROSEMIDA 40MG', genericName: 'LASIX', category: 'general', currentStock: 1200, minStock: 300, maxStock: 5000, presentation: 'Comprimido', unit: 'cp', lot: 'FR9919', expirationDate: '2027-09-05', location: 'A3-P5', controlled: false },
  { id: 's20', name: 'BENZILPENICILINA BENZATINA', genericName: 'BENZETACIL', category: 'antibiotic', currentStock: 100, minStock: 50, maxStock: 400, presentation: 'Frasco-ampola', unit: 'fr', lot: 'BZ0020', expirationDate: '2027-11-10', location: 'A2-P6', controlled: false },

  { id: 'g8', name: 'SERINGA 10ML C/ AGULHA', genericName: 'SERINGA', category: 'supply', currentStock: 1200, minStock: 500, maxStock: 5000, presentation: 'Unidade', unit: 'un', lot: 'E8080', expirationDate: '2028-12-31', location: 'DEP-INS', controlled: false },
  { id: 'g9', name: 'ALCOOL 70% 1L', genericName: 'ALCOOL', category: 'supply', currentStock: 100, minStock: 50, maxStock: 500, presentation: 'Frasco', unit: 'fr', lot: 'A9090', expirationDate: '2027-01-01', location: 'DEP-GEN', controlled: false },
  { id: 'g10', name: 'MÁSCARA CIRÚRGICA', genericName: 'MÁSCARA', category: 'supply', currentStock: 5000, minStock: 1000, maxStock: 20000, presentation: 'Caixa c/ 50', unit: 'cx', lot: 'M0000', expirationDate: '2028-06-30', location: 'DEP-GEN', controlled: false },
];


const initialMovements: Movement[] = [
  { id: '1', medicationId: '1', type: 'dispensing', quantity: 10, date: '2026-04-28 14:30', userId: '1', professional: 'Farm. Ana Paula', patientName: 'João Silva' },
  { id: '2', medicationId: '3', type: 'dispensing', quantity: 2, date: '2026-04-28 15:15', userId: '1', professional: 'Farm. Ana Paula', patientName: 'Maria Santos' },
];

export function usePharmacy() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [movements, setMovements] = useState<Movement[]>(initialMovements);

  const lowStock = useMemo(() => 
    medications.filter(m => m.currentStock <= m.minStock), 
  [medications]);

  const expiringSoon = useMemo(() => {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    return medications.filter(m => {
      const expDate = new Date(m.expirationDate);
      return expDate <= threeMonthsFromNow;
    });
  }, [medications]);

  const addMedication = (m: Omit<Medication, 'id'>) => {
    const newMed: Medication = {
      ...m,
      id: Math.random().toString(36).substr(2, 9)
    };
    setMedications(prev => [...prev, newMed]);
  };

  const addMovement = (m: Omit<Movement, 'id' | 'userId'>) => {
    const newMovement: Movement = {
      ...m,
      id: Math.random().toString(36).substr(2, 9),
      userId: '1', // Default mock user
    };
    
    setMovements(prev => [newMovement, ...prev]);

    // Update stock
    setMedications(prev => prev.map(med => {
      if (med.id === m.medicationId) {
        const factor = (m.type === 'entry') ? 1 : -1;
        return {
          ...med,
          currentStock: Math.max(0, med.currentStock + (m.quantity * factor))
        };
      }
      return med;
    }));
  };

  return { 
    medications, 
    movements, 
    addMedication, 
    addMovement, 
    lowStock, 
    expiringSoon 
  };
}
