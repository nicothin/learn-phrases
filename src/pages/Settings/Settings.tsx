import { LayoutText } from '@shared/layouts/LayoutText/LayoutText';
import { useStore } from '../../services/store';

export function Settings() {
  const settings = useStore((s) => s.settings);
  console.info('settings', settings);
  // const updateSettings = useStore((s) => s.updateSettings);

  return (
    <LayoutText>
      <div>
        <h1>Settings</h1>
        <p>Under construction.</p>
      </div>
    </LayoutText>
  );
}
