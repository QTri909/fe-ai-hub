# JiraAutoTest (Frontend)

JiraAutoTest is a high-performance web application designed to automate QA workflows, synchronize test results, and auto-create rich Jira tickets directly on test failures.

This repository hosts the frontend application built with **React 19 + TypeScript + Vite + TailwindCSS v4**.

## Tech Stack

*   **Core**: React 19, TypeScript 6.0, Vite 8.1
*   **Routing**: React Router v7 (Library Mode)
*   **State Management**: Zustand 5.0
*   **Data Fetching**: TanStack Query (React Query) v5
*   **HTTP Client**: Axios 1.18
*   **Form Management**: React Hook Form, Zod
*   **Styling**: TailwindCSS v4
*   **Testing**: Vitest, React Testing Library, Mock Service Worker (MSW)
*   **Linter & Formatter**: ESLint, Prettier

## Architectural Principles

The application is structured following a **Feature-Driven Modular Architecture**. Deep imports are forbidden. Access constraints are enforced to maintain logical boundaries and code scalability.

For detailed guidelines, see the documentation under `docs/`:
*   [docs/Architecture.md](file:///e:/University/Subjects/MSS/JiraProject/fe_ai_hub/docs/Architecture.md)
*   [docs/FolderRules.md](file:///e:/University/Subjects/MSS/JiraProject/fe_ai_hub/docs/FolderRules.md)
*   [docs/CodingConvention.md](file:///e:/University/Subjects/MSS/JiraProject/fe_ai_hub/docs/CodingConvention.md)

## Development Quickstart

### Prerequisites
*   Node.js (LTS version recommended)
*   pnpm (v11+)
### Install `pnpm` (If not already installed)
This project uses **pnpm** to manage dependencies for optimal speed and disk space. If you don't have it installed yet, run this global command:
> **npm install -g pnpm**

### Installation
```bash
# Clone the repository
pnpm install
```

### Running Local Dev Server
```bash
# Copy and configure environment variables
cp .env.example .env

# Run development server
pnpm run dev
```

### Testing
```bash
# Run unit and integration tests (Vitest)
pnpm run test

# Run tests in watch mode
pnpm run test:watch
```

### Building for Production
```bash
pnpm run build
```
