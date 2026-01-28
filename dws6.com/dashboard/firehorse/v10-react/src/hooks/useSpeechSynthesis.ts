/**
 * useSpeechSynthesis Hook
 * Speech Synthesis API integration for text-to-speech
 * Reads AI assistant responses aloud
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechSynthesisOptions {
  lang?: string;
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: SpeechSynthesisVoice;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const {
    lang = 'en-US',
    rate = 1,
    pitch = 1,
    volume = 1,
    voice,
    onEnd,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      setError('Speech Synthesis not supported in this browser');
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    // Chrome requires voices to load asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !window.speechSynthesis) {
        setError('Speech Synthesis not available');
        if (onError) {
          onError('Speech Synthesis not available');
        }
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Set voice if provided, otherwise use default for language
      if (voice) {
        utterance.voice = voice;
      } else {
        const langVoice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
        if (langVoice) {
          utterance.voice = langVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (onEnd) {
          onEnd();
        }
      };

      utterance.onerror = (event) => {
        const errorMessage = `Speech synthesis error: ${event.error}`;
        setError(errorMessage);
        setIsSpeaking(false);
        setIsPaused(false);
        if (onError) {
          onError(errorMessage);
        }
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, lang, rate, pitch, volume, voice, voices, onEnd, onError]
  );

  const pause = useCallback(() => {
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.pause();
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
    }
  }, [isPaused]);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  return {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    error,
  };
}
