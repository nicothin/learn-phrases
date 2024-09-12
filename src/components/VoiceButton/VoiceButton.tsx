import { useMainContext, useNotificationContext } from '../../hooks';

interface VoiceButtonProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const MAIN_USER_ID = 1;

export function VoiceButton(data: VoiceButtonProps) {
  const { text, className = '', style } = data;

  const { sayThisPhrase } = useMainContext();
  const { addNotification } = useNotificationContext();

  const onVoicePhrase = () => {
    sayThisPhrase({ text, userId: MAIN_USER_ID }).catch((result) => addNotification(result));
  };

  return (
    <button
      className={`voice-button ${className}`}
      style={style ?? undefined}
      type="button"
      onClick={onVoicePhrase}
    >
      <svg width="18" height="18">
        <use xlinkHref="#sound" />
      </svg>
    </button>
  );
}
