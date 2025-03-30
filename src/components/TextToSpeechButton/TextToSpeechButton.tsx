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

  const [isValidVoice, setIsValidVoice] = useState<boolean>(false);

  const cleanText = (rawText: string) => {
    let result = rawText;
    REPLACEMENTS.forEach(({ search }) => {
      result = result.replace(search, '');
    });
    return result;
  };

  const onClick = () => {
    const utterance = new SpeechSynthesisUtterance(cleanText(text));
    // TODO[@nicothin]: continue here: move selected voice to the component state
    // utterance.voice = voice;

    utterance.onerror = (event) => {
      addNotification({
        text: `Speech error: ${event.error}`,
        type: STATUS.ERROR,
        duration: 3000,
      });
    };

    // window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!('speechSynthesis' in window) || !voiceURI) {
      setIsValidVoice(false);
      return;
    }

    const checkVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const voiceExists = voices.find((voice) => voice.voiceURI === voiceURI);
      setIsValidVoice(!!voiceExists);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = checkVoice;
    } else {
      checkVoice();
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceURI]);

  return text.trim() && isValidVoice ? (
    <button className={`text-to-speech-button ${className}`} onClick={onClick} aria-label="Speak text">
      <svg width="18" height="18">
        <use xlinkHref="#sound" />
      </svg>
    </button>
  ) : null;
};
