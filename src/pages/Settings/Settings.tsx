import { useStore } from '../../services/store';

export function Settings() {
  const settings = useStore((s) => s.settings);
  console.info('settings', settings);
  // const updateSettings = useStore((s) => s.updateSettings);

  return (
    <div>
      settings
    </div>
  );
}
