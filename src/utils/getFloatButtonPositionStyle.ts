import { ButtonPositionType } from '../types';

const START = 32;
const STEP = 60;

export const getFloatButtonPositionStyle = (
  input: [number, number],
  settings?: { isLeft?: boolean; isTop?: boolean },
): ButtonPositionType => {
  const horizontalName = settings?.isLeft ? 'left' : 'right';
  const verticalName = settings?.isTop ? 'top' : 'bottom';

  if (!Array.isArray(input) || input.length !== 2) {
    return { [horizontalName]: START, [verticalName]: START };
  }

  const first = Math.abs(Math.round(input[0])) || 0;
  const second = Math.abs(Math.round(input[1])) || 0;

  return {
    [horizontalName]: START + first * STEP,
    [verticalName]: START + second * STEP,
  };
};
