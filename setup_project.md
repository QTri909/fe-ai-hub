Project Bootstrap Prompt

You are the Lead Software Architect for this project.

Your responsibility is to initialize the entire project following the architecture below.

Do NOT create business features unless requested.

Only setup the project foundation.

Tech Stack
React 19
TypeScript
Vite
React Router v7
Axios
TanStack Query
Zustand
React Hook Form
Zod
TailwindCSS
shadcn/ui
Lucide Icons
Prettier
lint-staged

Architecture

Use Feature-Driven Modular Architecture.
src/
│
├── app/
│   ├── providers/
│   ├── router/
│   ├── store/
│   └── index.ts
│
├── core/
│   ├── components/
│   ├── hooks/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   ├── lib/
│   └── index.ts
│
├── infrastructure/
│   ├── api/
│   ├── axios/
│   ├── websocket/
│   ├── services/
│   └── index.ts
│
├── features/
│
├── pages/
│
├── assets/
│
└── main.tsx
Every folder must expose an index.ts.
Deep import is forbidden.

Axios Setup
Create
infrastructure/
    axios/
        axios.ts
        interceptors.ts
        auth.interceptor.ts
        error.interceptor.ts
        index.ts

Requirements

Base URL from env
Request timeout
Request interceptor
Response interceptor
Refresh Token support
Authorization header
Global error handling
Retry mechanism
Cancel duplicate requests

API Layer
Create
infrastructure/api/

    auth.api.ts

    user.api.ts

    base.api.ts

Rules
Never call axios directly inside Feature.
All HTTP requests go through API layer.

Environment
Setup
.env
.env.example
Support
VITE_API_URL
VITE_APP_NAME
VITE_ENABLE_LOG
VITE_TIMEOUT
Create typed env helper.

TanStack Query
Setup
QueryClient
QueryClientProvider
Default retry
Default staleTime
Default gcTime
Global Query Error Handler
Mutation Error Handler

Zustand
Setup
core/store/
auth.store.ts
theme.store.ts
app.store.ts

Support
persist middleware
devtools
selectors

Authentication

Prepare infrastructure only.
Support
Access Token
Refresh Token
Auto Refresh
Logout
Token Storage
Permission helper
Role helper

Routing
Setup
Public Route
Protected Route
Guest Route
404 Page
Layout Route

Form
Setup
React Hook Form
Zod
Global Form Components
Validation Helpers

UI
Install
TailwindCSS
shadcn/ui
Lucide
Class Variance Authority
clsx
tailwind-merge

Error Handling
Global Error Boundary
Axios Error Handler
Unknown Error Handler
Toast Notification

Loading Overlay
Logging
Create Logger
Support
info
warn
error
debug
Disable log in production.

Utilities
Prepare
Date Utils
String Utils
Number Utils
Storage Utils
Cookie Utils
URL Utils
Debounce
Throttle

Constants
Create
Routes
Roles
Permissions
Regex
Storage Keys
API Endpoints

Types
Prepare
ApiResponse<T>
Pagination
User
ErrorResponse
JWT Payload

Hooks
useDebounce
useThrottle
useBoolean
useLocalStorage
usePagination
useDisclosure

Providers

Setup

ThemeProvider

QueryProvider

RouterProvider

ToastProvider

AuthProvider
ESLint
Strict TypeScript
No any
Unused import check
Import order
No deep import
Prettier
Standard formatting
Tailwind plugin

Testing

Prepare

Vitest

React Testing Library

Mock Service Worker

Naming Convention

Components

PascalCase

Hooks

useXXX

Stores

xxx.store.ts

API

xxx.api.ts

Types

xxx.types.ts

Constants

UPPER_SNAKE_CASE

Barrel Rule

Every folder must contain
index.ts
No file outside the folder can perform deep import.

Documentation

Generate

README

Folder explanation

Architecture explanation

Dependency explanation

Run instructions

Agent Rules

Do not create business code.

Do not create dummy pages.

Do not create fake APIs.

Only initialize reusable infrastructure.

All code must be production-ready.