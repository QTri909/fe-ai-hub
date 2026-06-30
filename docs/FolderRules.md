# Folder Rules & Import Guidelines

To maintain code hygiene and avoid tight coupling between components:

## 1. The Barrel File Rule (Strict)
*   Every subdirectory inside `src/features/`, `src/core/`, and `src/app/` **MUST** expose an `index.ts` file.
*   The `index.ts` file acts as the public API gatekeeper for that folder. Only symbols exported through this barrel file may be consumed by external files.
*   Deep imports are strictly forbidden.
    *   **Incorrect**: `import { LoginPage } from '@/pages/login/index';`
    *   **Incorrect**: `import { logger } from '@/core/lib/logger';`
    *   **Correct**: `import { LoginPage } from '@/pages';`
    *   **Correct**: `import { logger } from '@/core/lib';`

## 2. Feature Boundaries
*   Features **must never** import anything from another feature.
*   If features need to share logic, that logic must be relocated to `src/core/` (if it's a presentation primitive, helper utility, hook, or state store) or managed using global state coordinate functions.
*   Pages may import from multiple features to build composite screens, but must keep logic minimal.

## 3. Configuration Ownership
*   Environment configs (`app.config.ts`), HTTP options (`axios.config.ts`), and Query options (`query.config.ts`) must live in `src/core/config/` to allow unified parsing and validation.
