import { useState } from "react";

export function useEvolutionCalculators() {
  const [openMorseCalc, setOpenMorseCalc] = useState(false);
  const [selectedMorse, setSelectedMorse] = useState("");

  const [openBradenCalc, setOpenBradenCalc] = useState(false);
  const [selectedBraden, setSelectedBraden] = useState("");

  const [openEvaCalc, setOpenEvaCalc] = useState(false);
  const [selectedEva, setSelectedEva] = useState("");

  const [openMewsCalc, setOpenMewsCalc] = useState(false);
  const [selectedMews, setSelectedMews] = useState("");

  const [openNews2Calc, setOpenNews2Calc] = useState(false);
  const [selectedNews2, setSelectedNews2] = useState("");

  const [openQsofaCalc, setOpenQsofaCalc] = useState(false);
  const [selectedQsofa, setSelectedQsofa] = useState("");

  const [openPewsCalc, setOpenPewsCalc] = useState(false);
  const [selectedPews, setSelectedPews] = useState("");

  const [openGlasgowCalc, setOpenGlasgowCalc] = useState(false);
  const [selectedGlasgow, setSelectedGlasgow] = useState("");

  const [openMentalCalc, setOpenMentalCalc] = useState(false);
  const [selectedMentalSummary, setSelectedMentalSummary] = useState("");

  const [openUrgencyCalc, setOpenUrgencyCalc] = useState(false);
  const [selectedUrgencySummary, setSelectedUrgencySummary] = useState("");

  const [openNandaCalc, setOpenNandaCalc] = useState(false);
  const [activeNandaPlan, setActiveNandaPlan] = useState("");

  const [openNursingCalc, setOpenNursingCalc] = useState(false);
  const [selectedNursingSummary, setSelectedNursingSummary] = useState("");

  // Extras
  const [openHeartCalc, setOpenHeartCalc] = useState(false);
  const [openCurb65Calc, setOpenCurb65Calc] = useState(false);
  const [openWellsCalc, setOpenWellsCalc] = useState(false);
  const [openNihssCalc, setOpenNihssCalc] = useState(false);
  const [openDehydrationCalc, setOpenDehydrationCalc] = useState(false);
  const [openWoodDownesCalc, setOpenWoodDownesCalc] = useState(false);
  const [openParklandCalc, setOpenParklandCalc] = useState(false);

  return {
    openMorseCalc, setOpenMorseCalc,
    selectedMorse, setSelectedMorse,
    openBradenCalc, setOpenBradenCalc,
    selectedBraden, setSelectedBraden,
    openEvaCalc, setOpenEvaCalc,
    selectedEva, setSelectedEva,
    openMewsCalc, setOpenMewsCalc,
    selectedMews, setSelectedMews,
    openNews2Calc, setOpenNews2Calc,
    selectedNews2, setSelectedNews2,
    openQsofaCalc, setOpenQsofaCalc,
    selectedQsofa, setSelectedQsofa,
    openPewsCalc, setOpenPewsCalc,
    selectedPews, setSelectedPews,
    openGlasgowCalc, setOpenGlasgowCalc,
    selectedGlasgow, setSelectedGlasgow,
    openMentalCalc, setOpenMentalCalc,
    selectedMentalSummary, setSelectedMentalSummary,
    openUrgencyCalc, setOpenUrgencyCalc,
    selectedUrgencySummary, setSelectedUrgencySummary,
    openNandaCalc, setOpenNandaCalc,
    activeNandaPlan, setActiveNandaPlan,
    openNursingCalc, setOpenNursingCalc,
    selectedNursingSummary, setSelectedNursingSummary,
    openHeartCalc, setOpenHeartCalc,
    openCurb65Calc, setOpenCurb65Calc,
    openWellsCalc, setOpenWellsCalc,
    openNihssCalc, setOpenNihssCalc,
    openDehydrationCalc, setOpenDehydrationCalc,
    openWoodDownesCalc, setOpenWoodDownesCalc,
    openParklandCalc, setOpenParklandCalc
  };
}
