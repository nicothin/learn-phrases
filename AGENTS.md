# AI Agent Instructions

## Testing (Vitest + Testing Library)

- File: `__tests__/ComponentName.test.tsx` next to the component
- Group tests in `describe('Button', () => { ... })`
- Separate Arrange / Act / Assert with blank lines
- Use `setup()` for render to avoid duplicating props
- Queries: `getByRole` > `getByText` > `getByTestId`. `getByTestId` only if no semantic alternative
- Do not test CSS classes or BEM naming — test behavior
- `userEvent` instead of `fireEvent`
- `vi.fn()` / `vi.mock()` for mocks
- Cover edge cases: empty, disabled, boundary values
