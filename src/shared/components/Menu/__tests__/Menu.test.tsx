import { render, screen } from '@testing-library/react';
import { Menu } from '../Menu';

describe('Menu', () => {
  test('renders items', () => {
    render(<Menu items={['Item']} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('Item');
  });

  test('renders each item as listitem', () => {
    render(<Menu items={['One', 'Two', 'Three']} />);

    const items = screen.getAllByRole('listitem');

    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('One');
    expect(items[1]).toHaveTextContent('Two');
    expect(items[2]).toHaveTextContent('Three');
  });

  test('renders ReactNode items', () => {
    render(
      <Menu
        items={[
          <a href="/">Link</a>,
          <button type="button">Button</button>,
          <span>Text</span>,
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Menu className="custom-class" items={['Item']} />);

    expect(screen.getByRole('list')).toHaveClass('custom-class');
  });

  test('renders empty list when items is empty', () => {
    render(<Menu items={[]} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
