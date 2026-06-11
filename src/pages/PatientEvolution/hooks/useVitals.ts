import { useState } from "react";

export function useVitals() {
  const [vsBloodPressure, setVsBloodPressure] = useState("");
  const [vsHeartRate, setVsHeartRate] = useState("");
  const [vsRespiratoryRate, setVsRespiratoryRate] = useState("");
  const [vsTemperature, setVsTemperature] = useState("");
  const [vsSpO2, setVsSpO2] = useState("");
  const [vsPain, setVsPain] = useState("0");
  const [vsConsciousness, setVsConsciousness] = useState("A"); // A: Alerta, V: Voz, D: Dor, I: Inconsciente

  const vsSystolic = vsBloodPressure.split("/")[0] || "";
  const vsDiastolic = vsBloodPressure.split("/")[1] || "";

  const isDefaultBloodPressure =
    vsBloodPressure === "120/080" ||
    vsBloodPressure === "120/80" ||
    vsBloodPressure === "";
  const isDefaultHeartRate = vsHeartRate === "80";
  const isDefaultRespiratoryRate = vsRespiratoryRate === "16";
  const isDefaultTemperature =
    vsTemperature === "36.5" || vsTemperature === "36,5";
  const isDefaultSpO2 = vsSpO2 === "98";
  const isDefaultPain = vsPain === "0";
  const isDefaultConsciousness = vsConsciousness === "A";

  const handleBloodPressureChange = (val: string) => {
    let clean = val.replace(/[^\d/]/g, "");
    const isDeleting = val.length < vsBloodPressure.length;

    if (isDeleting && vsBloodPressure.endsWith("/") && !clean.includes("/")) {
      setVsBloodPressure(clean.slice(0, -1));
      return;
    }

    if (!clean.includes("/") && clean.length > 3) {
      clean = clean.slice(0, 3) + "/" + clean.slice(3);
    }

    const parts = clean.split("/");
    const sys = parts[0] ? parts[0].slice(0, 3) : "";
    const dia = parts[1] ? parts[1].slice(0, 3) : "";

    if (clean.includes("/")) {
      setVsBloodPressure(sys + "/" + dia);
    } else {
      if (sys.length >= 3) {
        setVsBloodPressure(sys + "/");
      } else {
        setVsBloodPressure(sys);
      }
    }
  };

  const handleBloodPressureBlur = () => {
    if (!vsBloodPressure) return;

    const parts = vsBloodPressure.split("/");
    const sysPart = parts[0] ? parts[0].replace(/\D/g, "") : "";
    const diaPart = parts[1] ? parts[1].replace(/\D/g, "") : "";

    if (!sysPart && !diaPart) {
      setVsBloodPressure("");
      return;
    }

    const formattedSys = sysPart ? sysPart.padStart(3, "0") : "120";
    const formattedDia = diaPart ? diaPart.padStart(3, "0") : "080";

    setVsBloodPressure(`${formattedSys}/${formattedDia}`);
  };

  const calculateMEWS = () => {
    let score = 0;

    const pas = parseInt(vsSystolic);
    if (!isNaN(pas)) {
      if (pas <= 70) score += 3;
      else if (pas <= 80) score += 2;
      else if (pas <= 100) score += 1;
      else if (pas >= 200) score += 2;
    }

    const fc = parseInt(vsHeartRate);
    if (!isNaN(fc)) {
      if (fc <= 40) score += 2;
      else if (fc <= 50) score += 1;
      else if (fc >= 101 && fc <= 110) score += 1;
      else if (fc >= 111 && fc <= 129) score += 2;
      else if (fc >= 130) score += 3;
    }

    const fr = parseInt(vsRespiratoryRate);
    if (!isNaN(fr)) {
      if (fr <= 8) score += 2;
      else if (fr >= 15 && fr <= 20) score += 1;
      else if (fr >= 21 && fr <= 29) score += 2;
      else if (fr >= 30) score += 3;
    }

    const temp = parseFloat(vsTemperature.replace(",", "."));
    if (!isNaN(temp)) {
      if (temp <= 34.9) score += 2;
      else if (temp >= 38.5) score += 2;
    }

    if (vsConsciousness === "V") score += 1;
    else if (vsConsciousness === "D") score += 2;
    else if (vsConsciousness === "I") score += 3;

    return score;
  };

  const getMEWSClassification = (score: number) => {
    if (score >= 5)
      return {
        label: "RISCO IMEDIATO (Grave)",
        color: "text-red-600 bg-red-500/10 border-red-500/20",
        alert: "Alta urgência! Chame a equipe médica imediatamente.",
      };
    if (score >= 3)
      return {
        label: "ATENÇÃO (Moderado)",
        color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
        alert: "Alerta de risco. Monitore o paciente com maior frequência.",
      };
    return {
      label: "ESTÁVEL (Baixo Risco)",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      alert: "Paciente estável e dentro dos parâmetros normais.",
    };
  };

  const clearVitals = () => {
    setVsBloodPressure("");
    setVsHeartRate("");
    setVsRespiratoryRate("");
    setVsTemperature("");
    setVsSpO2("");
    setVsPain("0");
    setVsConsciousness("A");
  };

  const setInitialVitals = () => {
    setVsBloodPressure("120/080");
    setVsHeartRate("80");
    setVsSpO2("98");
    setVsTemperature("36.5");
    setVsRespiratoryRate("16");
    setVsPain("0");
    setVsConsciousness("A");
  };

  return {
    vsBloodPressure,
    setVsBloodPressure,
    vsHeartRate,
    setVsHeartRate,
    vsRespiratoryRate,
    setVsRespiratoryRate,
    vsTemperature,
    setVsTemperature,
    vsSpO2,
    setVsSpO2,
    vsPain,
    setVsPain,
    vsConsciousness,
    setVsConsciousness,
    vsSystolic,
    vsDiastolic,
    isDefaultBloodPressure,
    isDefaultHeartRate,
    isDefaultRespiratoryRate,
    isDefaultTemperature,
    isDefaultSpO2,
    isDefaultPain,
    isDefaultConsciousness,
    handleBloodPressureChange,
    handleBloodPressureBlur,
    calculateMEWS,
    getMEWSClassification,
    clearVitals,
    setInitialVitals,
  };
}
