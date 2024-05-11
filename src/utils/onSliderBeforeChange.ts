export const onSliderBeforeChange = ({
  current,
  next,
  onToNext,
  onToPrev,
}: {
  current: number;
  next: number;
  onToNext: () => void;
  onToPrev: () => void;
}) => {
  if (
    (current === 0 && next === 1) ||
    (current === 1 && next === 2) ||
    (current === 2 && next === 0)
  ) {
    onToNext();
  } else if (
    (current === 0 && next === 2) ||
    (current === 1 && next === 0) ||
    (current === 2 && next === 1)
  ) {
    onToPrev();
  }
};
