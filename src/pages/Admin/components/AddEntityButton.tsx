import { Button, Icon } from '@shared/components';

type AddEntityButtonProps = {
  onClick: () => void;
  label: string;
  className?: string;
};

export function AddEntityButton({ onClick, label, className }: AddEntityButtonProps) {
  return (
    <Button className={className} circle onClick={onClick} aria-label={label} title="Add">
      <Icon name="plus" />
    </Button>
  );
}
