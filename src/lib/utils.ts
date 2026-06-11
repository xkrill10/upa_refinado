import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWords(text: string) {
  if (!text) return "";

  // Conectivos e artigos que devem permanecer em minúsculo em português (exceto no início da frase)
  const skipWords = [
    "de",
    "da",
    "do",
    "dos",
    "das",
    "e",
    "o",
    "a",
    "os",
    "as",
    "em",
    "no",
    "na",
    "nos",
    "nas",
    "com",
    "por",
    "para",
    "um",
    "uma",
  ];

  // Siglas comuns e termos médicos que devem permanecer em maiúsculo
  const acronyms = [
    "SUS",
    "UPA",
    "SAMU",
    "AVC",
    "IAM",
    "HAS",
    "DM",
    "DPOC",
    "IRC",
    "HIV",
    "AAS",
    "PA",
    "FC",
    "FR",
    "SPO2",
    "UTI",
    "UCO",
    "GCS",
    "TC",
    "RM",
    "ECG",
    "EEG",
    "HGT",
  ];

  const isAllCaps = text.length > 3 && text === text.toUpperCase();
  const workingText = isAllCaps ? text.toLowerCase() : text;

  return workingText
    .split(/(\s+)/)
    .map((word, index) => {
      if (!word.trim()) return word; // Preserva espaços

      const upper = word.toUpperCase();
      if (acronyms.includes(upper)) return upper;

      if (word.length > 1 && word === upper && !/^\d+$/.test(word)) return word;

      const lower = word.toLowerCase();

      if (index === 0) {
        return (
          word.charAt(0).toUpperCase() +
          (isAllCaps ? word.slice(1).toLowerCase() : word.slice(1))
        );
      }

      if (skipWords.includes(lower)) return lower;

      return (
        word.charAt(0).toUpperCase() +
        (isAllCaps ? word.slice(1).toLowerCase() : word.slice(1))
      );
    })
    .join("");
}

export function formatPatientNameLGPD(name: string) {
  if (
    !name ||
    name.toUpperCase().includes("NÃO IDENTIFICADO") ||
    name.toUpperCase().includes("PRÉ-CADASTRO") ||
    name.toUpperCase().includes("DESCONHECIDO")
  ) {
    return "PACIENTE";
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "PACIENTE";
  if (parts.length === 1) return parts[0].toUpperCase();

  const firstName = parts[0].toUpperCase();

  // Find the first valid subsequent name that is not a connector/preposition
  const skipWords = ["DE", "DA", "DO", "DOS", "DAS", "E"];
  let index = 1;
  while (
    index < parts.length &&
    skipWords.includes(parts[index].toUpperCase())
  ) {
    index++;
  }

  if (index < parts.length) {
    const nextInitial = parts[index][0].toUpperCase();
    return `${firstName} ${nextInitial}.`;
  }
}

export function formatPatientAge(
  age?: number | string | null,
  birthDate?: string | null,
) {
  if (birthDate) {
    const bDate = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - bDate.getFullYear();
    let months = now.getMonth() - bDate.getMonth();
    let days = now.getDate() - bDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years >= 2) {
      return `${years} anos`;
    } else {
      let result = [];
      if (years === 1) result.push("1 ano");
      if (months > 0)
        result.push(`${months} ${months === 1 ? "mês" : "meses"}`);
      if (days > 0 || (years === 0 && months === 0))
        result.push(`${days} ${days === 1 ? "dia" : "dias"}`);
      return result.join(" e ");
    }
  }

  if (age !== undefined && age !== null) {
    return `${age} ${Number(age) === 1 ? "ano" : "anos"}`;
  }

  return "";
}
