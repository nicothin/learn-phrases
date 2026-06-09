import { render, screen } from '@testing-library/react';
import { ProgressBar, type ProgressBarProps } from '../ProgressBar';

function setup(props?: Partial<ProgressBarProps>) {
  return { ...render(<ProgressBar percentage={50} {...props} />) };
}

describe('ProgressBar', () => {
  test('renders with percentage', () => {
    setup({ percentage: 50 });

    const line = screen.getByTestId('progress-bar__line');

    expect(line).toBeInTheDocument();
    expect(line).toHaveStyle({ width: '50%' });
  });

  test('clamps percentage to 0–100', () => {
    const { rerender } = render(<ProgressBar percentage={-10} />);

    expect(screen.getByTestId('progress-bar__line')).toHaveStyle({ width: '0%' });

    rerender(<ProgressBar percentage={150} />);

    expect(screen.getByTestId('progress-bar__line')).toHaveStyle({ width: '100%' });
  });

  test('adds --done modifier at 100%', () => {
    const { container } = render(<ProgressBar percentage={100} />);

    expect(container.firstChild).toHaveClass('progress-bar--done');
  });

  test('renders children as text', () => {
    setup({ children: '3 / 10' });

    expect(screen.getByText('3 / 10')).toBeInTheDocument();
  });

  test('does not render text when children is empty', () => {
    const { container } = render(<ProgressBar percentage={50} />);

    expect(container.querySelector('.progress-bar__text')).not.toBeInTheDocument();
  });

  test('accepts custom className', () => {
    const { container } = render(<ProgressBar percentage={50} className="my-class" />);

    expect(container.firstChild).toHaveClass('my-class');
  });
});
