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
  const isForward = (next - current + 3) % 3 === 1;

  if (isForward) {
    onToNext();
  } else {
    onToPrev();
  }
};
