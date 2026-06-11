import React from "react";
import { ModalsState } from "../hooks/useModalsState";
import { Patient } from "@/context/PatientsContext";

import { MorseModal } from "@/components/PatientEvolution/Modals/MorseModal";
import { BradenModal } from "@/components/PatientEvolution/Modals/BradenModal";
import { EvaModal } from "@/components/PatientEvolution/Modals/EvaModal";
import { MewsModal } from "@/components/PatientEvolution/Modals/MewsModal";
import { News2Modal } from "@/components/PatientEvolution/Modals/News2Modal";
import { QsofaModal } from "@/components/PatientEvolution/Modals/QsofaModal";
import { PewsModal } from "@/components/PatientEvolution/Modals/PewsModal";
import { GlasgowModal } from "@/components/PatientEvolution/Modals/GlasgowModal";
import { MentalModal } from "@/components/PatientEvolution/Modals/MentalModal";
import { UrgencyModal } from "@/components/PatientEvolution/Modals/UrgencyModal";
import { FugulinModal } from "@/components/PatientEvolution/Modals/FugulinModal";
import { NandaModal } from "@/components/PatientEvolution/Modals/NandaModal";
import { ClinicalProfileModal } from "@/components/PatientEvolution/Modals/ClinicalProfileModal";
import { VitalsHistoryModal } from "@/components/PatientEvolution/Modals/VitalsHistoryModal";
import { HeartScoreModal } from "@/components/PatientEvolution/Modals/HeartScoreModal";
import { Curb65Modal } from "@/components/PatientEvolution/Modals/Curb65Modal";
import { WellsScoreModal } from "@/components/PatientEvolution/Modals/WellsScoreModal";
import { NihssModal } from "@/components/PatientEvolution/Modals/NihssModal";
import { DehydrationScoreModal } from "@/components/PatientEvolution/Modals/DehydrationScoreModal";
import { WoodDownesModal } from "@/components/PatientEvolution/Modals/WoodDownesModal";
import { ParklandModal } from "@/components/PatientEvolution/Modals/ParklandModal";
import { BedTransferModal } from "@/components/PatientEvolution/Modals/BedTransferModal";
import { BedStatusModal } from "@/components/PatientEvolution/Modals/BedStatusModal";
import { PatientTimelineModal } from "@/components/PatientEvolution/Modals/PatientTimelineModal";
import { BedRequestModal } from "@/components/PatientEvolution/Modals/BedRequestModal";

interface ModalsContainerProps {
  modalsState: ModalsState;
  patient?: Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  appendDescription: (desc: string) => void;
}

export function ModalsContainer({
  modalsState: m,
  patient,
  updatePatient,
  appendDescription,
}: ModalsContainerProps) {
  return (
    <>
      {/* DIÁLOGOS DE ESCALAS CLÍNICAS E AVALIAÇÕES */}
      <MorseModal
        isOpen={m.openMorseCalc}
        onClose={m.setOpenMorseCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedMorse(sum);
        }}
      />
      <BradenModal
        isOpen={m.openBradenCalc}
        onClose={m.setOpenBradenCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedBraden(sum);
        }}
      />
      <EvaModal
        isOpen={m.openEvaCalc}
        onClose={m.setOpenEvaCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedEva(sum);
        }}
      />
      <MewsModal
        isOpen={m.openMewsCalc}
        onClose={m.setOpenMewsCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedMews(sum);
        }}
      />
      <News2Modal
        isOpen={m.openNews2Calc}
        onClose={m.setOpenNews2Calc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedNews2(sum);
        }}
      />
      <QsofaModal
        isOpen={m.openQsofaCalc}
        onClose={m.setOpenQsofaCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedQsofa(sum);
        }}
      />
      <PewsModal
        isOpen={m.openPewsCalc}
        onClose={m.setOpenPewsCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedPews(sum);
        }}
      />
      <GlasgowModal
        isOpen={m.openGlasgowCalc}
        onClose={m.setOpenGlasgowCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedGlasgow(sum);
        }}
      />
      <MentalModal
        isOpen={m.openMentalCalc}
        onClose={m.setOpenMentalCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedMentalSummary(sum);
        }}
      />

      {/* Modais de Gestão de Leitos */}
      <BedTransferModal
        isOpen={m.openBedTransfer}
        onClose={m.setOpenBedTransfer}
        patientId={patient?.id}
        fugulinSummary={m.selectedNursingSummary}
        onApply={appendDescription}
      />
      <BedStatusModal
        isOpen={m.openBedStatus}
        onClose={m.setOpenBedStatus}
        onApply={appendDescription}
      />

      {/* Outros Modais Isolados e Painéis Extras */}
      <PatientTimelineModal
        isOpen={m.isTimelineOpen}
        onClose={m.setIsTimelineOpen}
        patient={patient}
      />
      <BedRequestModal
        patient={patient}
        isOpen={m.isBedRequestOpen}
        onClose={() => m.setIsBedRequestOpen(false)}
      />

      {/* Modais Médicos / Pediátricos */}
      <UrgencyModal
        isOpen={m.openUrgencyCalc}
        onClose={m.setOpenUrgencyCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedUrgencySummary(sum);
        }}
      />
      <FugulinModal
        isOpen={m.openNursingCalc}
        onClose={m.setOpenNursingCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setSelectedNursingSummary(sum);
        }}
      />
      <NandaModal
        isOpen={m.openNandaCalc}
        onClose={m.setOpenNandaCalc}
        onApply={(desc, sum) => {
          appendDescription(desc);
          m.setActiveNandaPlan(sum);
        }}
      />

      <HeartScoreModal
        isOpen={m.openHeartCalc}
        onClose={m.setOpenHeartCalc}
        onApply={(desc, sum) => appendDescription(desc)}
      />
      <Curb65Modal
        isOpen={m.openCurb65Calc}
        onClose={m.setOpenCurb65Calc}
        onApply={(desc, sum) => appendDescription(desc)}
      />
      <WellsScoreModal
        isOpen={m.openWellsCalc}
        onClose={m.setOpenWellsCalc}
        onApply={(desc, sum) => appendDescription(desc)}
      />
      <NihssModal
        isOpen={m.openNihssCalc}
        onClose={m.setOpenNihssCalc}
        onApply={(desc, sum) => appendDescription(desc)}
      />
      <DehydrationScoreModal
        isOpen={m.openDehydrationCalc}
        onClose={m.setOpenDehydrationCalc}
        onApply={(desc, sum) => appendDescription(desc)}
      />
      <WoodDownesModal
        isOpen={m.openWoodDownesCalc}
        onClose={m.setOpenWoodDownesCalc}
        onApply={(desc, sum) => appendDescription(desc)}
      />
      <ParklandModal
        isOpen={m.openParklandCalc}
        onClose={m.setOpenParklandCalc}
        onApply={(desc, sum) => appendDescription(desc)}
      />

      {patient && (
        <>
          <ClinicalProfileModal
            isOpen={m.isClinicalProfileOpen}
            onClose={() => m.setIsClinicalProfileOpen(false)}
            patient={patient}
            onSave={(pid, updates) => updatePatient(pid, updates)}
          />
          <VitalsHistoryModal
            isOpen={m.isVitalsHistoryOpen}
            onClose={() => m.setIsVitalsHistoryOpen(false)}
            patient={patient}
          />
        </>
      )}
    </>
  );
}
