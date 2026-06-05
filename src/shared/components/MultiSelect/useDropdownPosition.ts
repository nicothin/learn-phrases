import { type CSSProperties, type RefObject, useCallback, useEffect, useState } from 'react';

const SPACE_BELOW = 200;

export function useDropdownPosition(
  triggerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
): { style: CSSProperties; isPositioned: boolean } {
  const [style, setStyle] = useState<CSSProperties>({});
  const [isPositioned, setIsPositioned] = useState(false);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    setIsPositioned(false);

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const flipUp = spaceBelow < SPACE_BELOW && spaceAbove >= spaceBelow;

    setStyle({
      position: 'fixed',
      left: rect.left,
      top: flipUp ? undefined : rect.bottom,
      bottom: flipUp ? window.innerHeight - rect.top : undefined,
      width: rect.width,
      maxHeight: flipUp ? Math.min(SPACE_BELOW, spaceAbove - 8) : Math.min(SPACE_BELOW, spaceBelow - 8),
      zIndex: 9999,
    });
    setIsPositioned(true);
  }, [triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const resizeObserver = new ResizeObserver(updatePosition);
    const triggerEl = triggerRef.current;
    if (triggerEl) {
      resizeObserver.observe(triggerEl);
    }

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition, triggerRef]);

  return { style, isPositioned };
}
