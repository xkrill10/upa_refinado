import { useState } from "react";
import { toast } from "sonner";
import { PrescriptionMedication } from "@/context/PrescriptionsContext";

export function useEvolutionPrescriptions() {
  const [prescWizard, setPrescWizard] = useState({
    medication: "",
    dosage: "",
    route: "",
    frequency: "",
  });
  const [prescribedMedications, setPrescribedMedications] = useState<
    PrescriptionMedication[]
  >([]);

  const handleAddPrescriptionItem = () => {
    if (
      !prescWizard.medication ||
      !prescWizard.dosage ||
      !prescWizard.route ||
      !prescWizard.frequency
    ) {
      toast.error("Preencha todos os campos do medicamento!");
      return;
    }
    const newItem: PrescriptionMedication = {
      id: `med-${Date.now()}`,
      medication: prescWizard.medication,
      dosage: prescWizard.dosage,
      route: prescWizard.route,
      frequency: prescWizard.frequency,
      status: "awaiting_pharmacy",
      hours: [],
    };
    setPrescribedMedications([...prescribedMedications, newItem]);
    setPrescWizard({ medication: "", dosage: "", route: "", frequency: "" });
  };

  const handleRemovePrescriptionItem = (idx: number) => {
    const arr = [...prescribedMedications];
    arr.splice(idx, 1);
    setPrescribedMedications(arr);
  };

  return {
    prescWizard,
    setPrescWizard,
    prescribedMedications,
    setPrescribedMedications,
    handleAddPrescriptionItem,
    handleRemovePrescriptionItem,
  };
}
