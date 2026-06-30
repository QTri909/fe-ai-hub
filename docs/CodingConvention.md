# Coding Conventions & Styling Guidelines

Adhering to code conventions ensures consistency and enables agents to collaborate seamlessly.

## Naming Conventions
*   **Components**: PascalCase (e.g. `LoginForm.tsx`, `LoadingOverlay.tsx`)
*   **Hooks**: camelCase starting with `use` (e.g. `useDebounce.ts`, `useThemeStore.ts`)
*   **Constants**: UPPER_SNAKE_CASE (e.g. `STORAGE_KEYS`, `ROUTES`)
*   **Files / Stores**: lowercase dot notation (e.g. `auth.store.ts`, `date.ts`, `routes.ts`)

## TypeScript / Styling
*   **Strict Types**: Use strict type definitions. Do not use `any` unless absolutely unavoidable. Use `unknown` for arbitrary values (e.g. error catch blocks).
*   **Type Imports**: When importing types, use `import type` where possible to keep build outputs optimized under `verbatimModuleSyntax` options.
*   **CSS / Styles**: Rely on TailwindCSS utility classes. Do not write raw inline styles or CSS rules unless defining global theme properties in `src/index.css`.

## API Request Pattern
*   Do not instantiate Axios or call Axios directly inside features.
*   Always invoke functional endpoints defined within features or shared utilities.
*   All data queries and mutations must utilize TanStack Query (`useQuery` / `useMutation`) hooks. Do not manage loading / error states for fetch calls manually inside components.
