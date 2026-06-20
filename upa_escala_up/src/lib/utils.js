import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

export const isIframe = window.self !== window.top;

export function formatName(name) {
  if (!name) return '';
  const lowercasedWords = ['de', 'da', 'do', 'das', 'dos', 'e'];
  return name
    .toLowerCase()
    .split(' ')
    .map((word, index, arr) => {
      if (!word) return '';
      // Sempre capitaliza a primeira e a última palavra, além das palavras que não estão na lista de exceções
      if (index === 0 || index === arr.length - 1 || !lowercasedWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

export function formatPhone(value) {
  if (!value) return '';
  
  let v = value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length === 0) return '';
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}
