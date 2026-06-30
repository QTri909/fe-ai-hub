src/
├── app/                  # (1) Cấu hình toàn cục
│   ├── routes.tsx        # Khai báo Routing
│   ├── providers.tsx     # Global Context/Redux Provider
│   └── store.ts          # Root state
│
├── core/                 # (2) Dùng chung toàn dự án (Shared)
│   ├── components/       # UI Components nguyên thủy (Button, Modal, Input)
│   ├── hooks/            # Global hooks (useTheme, useDebounce)
│   ├── utils/            # Helper functions (formatDate, validator)
│   └── types/            # Global TypeScript Interfaces
│
├── infrastructure/       # (3) Giao tiếp với bên ngoài
│   ├── http/             # Cấu hình HTTP Client (Axios interceptors/Fetch)
│   └── services/         # Cấu hình WebSocket, Firebase, Jira API...
│
├── features/             # (4) TRÁI TIM CỦA KIẾN TRÚC (Nơi Agent làm việc chính)
│   ├── auth/             # Tính năng Đăng nhập/Xác thực
│   │   ├── api/          # Gọi API riêng của auth (login, register)
│   │   ├── components/   # UI phức tạp riêng của auth (LoginForm, OAuthButtons)
│   │   ├── hooks/        # hooks riêng (useAuth, usePermissions)
│   │   ├── store/        # State cục bộ (Zustand slice)
│   │   ├── types/        # Interfaces chỉ dùng cho auth
│   │   └── index.ts      # (QUAN TRỌNG) Barrel file để export
│   │
│   └── test_suites/      # Ví dụ một module tính năng khác
│       ├── api/
│       ├── components/
│       └── index.ts
│
└── pages/                # (5) Lắp ráp các Features thành màn hình hoàn chỉnh
    ├── login/
    │   └── index.tsx     # Chỉ gọi <LoginForm /> từ features/auth
    └── dashboard/
        └── index.tsx

# Project Architecture Guidelines

This project follows a Feature-Driven Modular Architecture. All AI Agents must strictly adhere to these rules when creating, modifying, or moving files.

## 1. Directory Structure Strategy
- `app/`: Global configurations (routes, providers, store init).
- `core/`: Shared primitives (UI components, hooks, utils, types) accessible by all features.
- `infrastructure/`: External communication (HTTP client, API services, WebSocket).
- `features/`: The heart of the application. Each feature is an isolated domain (e.g., `auth`, `test_suites`).
- `pages/`: Page-level components that assemble features. NO business logic here.

## 2. The "Barrel File" Rule (Strict)
Every sub-folder inside `features/` MUST expose its functionality through an `index.ts` file.
- External modules (other features, pages) can ONLY import from the `index.ts` of a feature.
- Deep imports like `features/auth/components/LoginForm` are FORBIDDEN.
- Correct: `import { LoginForm } from '@/features/auth';`

## 3. Data Flow & Communication Flow
- `Features` do not import from other `Features`. If cross-feature communication is needed, it must be coordinated through a shared service in `infrastructure/` or a global state in `core/`.
- `Pages` only import from `features/` and `core/`.
- `Infrastructure` code is the ONLY place allowed to handle raw API definitions (OkHttpClient wrappers, Axios instances).

## 4. Agent Execution Principles
- When asked to add a feature, first check the existing `features/` directory.
- Maintain isolation: If the task is related to `TestSuites`, all logic must reside in `features/test_suites/`.
- Maintain simplicity: `pages/` should only contain layout-assembling logic.
- If a component is used in more than two features, move it to `core/components/`.

## 5. Flow Overview

- User -> Pages (Assembly) -> Features (Domain Logic) -> Infrastructure (API/Services) -> External API (Jira/Backend).