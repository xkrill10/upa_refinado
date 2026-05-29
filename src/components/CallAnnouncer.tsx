import { useEffect, useRef, useCallback } from "react";
import { usePatients } from "@/hooks/use-patients";
import { formatPatientNameLGPD } from "@/lib/utils";
import { useLocation } from "react-router-dom";

// Create a singleton AudioContext to avoid issues with multiple instances or browser restrictions
let sharedAudioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioContextClass();
  }
  return sharedAudioCtx;
};

export function CallAnnouncer() {
  const { currentCall, isAudioEnabled, setIsAnnouncing } = usePatients();
  const lastCallId = useRef<string | null>(null);
  const location = useLocation();
  const isCallPanelRoute = location.pathname === "/painel-chamadas";

  const playChime = useCallback(() => {
    // If we're on the dedicated CallPanel, it handles its own audio
    if (!isAudioEnabled || isCallPanelRoute) return;
    
    try {
      const audioCtx = getAudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.3, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      // Simple Ding-Dong sequence
      const now = audioCtx.currentTime;
      playNote(880, now, 0.8); // A5
      playNote(659.25, now + 0.3, 1.2); // E5
    } catch (e) {
      console.error("Erro ao reproduzir chime:", e);
    }
  }, [isAudioEnabled, isCallPanelRoute]);

  const announceCall = useCallback((callName: string, roomName: string, ticket?: string) => {
    if (!isAudioEnabled || isCallPanelRoute || !window.speechSynthesis) return;

    // Filter out mock names or IDs if they look like tickets
    const isTicketLike = /^[A-Z]\d{3}$/.test(callName);
    if (!callName || (isTicketLike && !ticket)) return;

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Wait bit after chime
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance();
      
      const isUnidentified = callName.toUpperCase().includes('NÃO IDENTIFICADO') || callName.toUpperCase().includes('PRÉ-CADASTRO') || callName.toUpperCase().includes('DESCONHECIDO');
      
      let spoken = "";
      if (isUnidentified && ticket) {
        spoken = `Senha ${ticket.split('').join(' ')}`;
      } else {
        const isTicketName = /^[A-Z]\d{3}$/.test(callName);
        const displayName = formatPatientNameLGPD(callName);
        spoken = isTicketName ? `Senha ${callName.split('').join(' ')}` : displayName.toLowerCase();
      }

      utterance.text = `${spoken}. Comparecer ao local: ${roomName.toLowerCase()}.`;
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsAnnouncing(true);
      utterance.onend = () => setIsAnnouncing(false);
      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        setIsAnnouncing(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 1500);
  }, [isAudioEnabled, isCallPanelRoute, setIsAnnouncing]);

  useEffect(() => {
    if (currentCall && currentCall.id !== lastCallId.current) {
      lastCallId.current = currentCall.id;
      playChime();
      announceCall(currentCall.patientName, currentCall.room, currentCall.ticket);
    }
  }, [currentCall, playChime, announceCall]);

  return null; // This component doesn't render anything
}
