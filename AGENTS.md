# General Guidelines

- Always use `specs.md` before working
- When unsure about implementation details, ALWAYS ask the developer.
- Never assume business logic - Always ask.
- Always run `lint` and `typecheck` to ensure there are no errors or warnings surfacing (they must be fixed, not ignored), before considering a task completed.
- Await confirmation from the user if it can be considered done or not.

# Development workflow

## Route Handlers

- Use async/await, not callbacks

## Typecheck

- Run `npm run type-check"` to run the TypeScript checker.

## Lint

- Run `npm run lint` to run the ESLint.

## Testing

- Run `npm run test` to run the tests.
