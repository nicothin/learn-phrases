import { useEffect, useState } from 'react';

import './TextToSpeechButton.css';

import { REPLACEMENTS } from '../../constants';
import { useNotificationContext } from '../../hooks';
import { STATUS } from '../../enums';

interface TextToSpeechButtonProps {
  text: string;
  voiceURI: string;
  className?: string;
}

export const TextToSpeechButton = ({ text, voiceURI, className = '' }: TextToSpeechButtonProps) => {
  const { addNotification } = useNotificationContext();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [validVoice, setValidVoice] = useState<SpeechSynthesisVoice | null>(null);

  const cleanText = (rawText: string) => {
    let result = rawText;
    REPLACEMENTS.forEach(({ search }) => {
      result = result.replace(search, '$1');
    });
    return result;
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();

    // Chrome
    const interval = setInterval(() => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoices(voices);
        clearInterval(interval);
      }
    }, 200);

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!voiceURI) {
      setValidVoice(null);
      return;
    }
    const matched = voices.find((voice) => voice.voiceURI === voiceURI);
    setValidVoice(matched || null);
  }, [voiceURI, voices]);

  const onClick = () => {
    if (!validVoice) {
      addNotification({
        text: 'No usable voice',
        type: STATUS.ERROR,
        duration: 3000,
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText(text));
    utterance.voice = validVoice;

    utterance.onerror = (e) => {
      if (e.error === 'interrupted') return;

      addNotification({
        text: `Speech error: ${e.error}`,
        type: STATUS.ERROR,
        duration: 3000,
      });
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return text.trim() && validVoice ? (
    <button className={`text-to-speech-button ${className}`} onClick={onClick} aria-label="Speak text">
      <svg width="18" height="18">
        <use xlinkHref="#sound" />
      </svg>
    </button>
  ) : null;
};
