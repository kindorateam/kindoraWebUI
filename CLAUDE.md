# CLAUDE.md — AI Agent Guide for Kindora Web

This document is for AI coding agents (particularly Claude) working in this codebase. It encodes the tech stack, conventions, and safe operating procedures so you can ship changes quickly and correctly.

---

## Quick Reference

```bash
# Development workflow
bun install          # Install dependencies
bun run dev          # Start dev server (port 5173)
bun run typecheck    # Type checking
bun run check        # Lint & format check (Biome)
bun run fix          # Auto-fix lint & format issues
bun run build        # Production build
bun run preview      # Preview production build
```

**Critical paths:**
- Routes → `src/routes/` (file-based, auto-generated tree)
- Features → `src/features/` (feature-based organization with colocated code)
- Global State → `src/stores/*.store.ts` (shared Jotai atoms only)
- Global API → `src/services/*.service.ts` (shared API infrastructure only)
- UI → HeroUI components (standard, minimal custom styling)
- Generated → `src/routeTree.gen.ts` (do NOT edit directly)

---

## Tech Stack

| Layer              | Technology      | Version                      |
| ------------------ | --------------- | ---------------------------- |
| Runtime            | Bun             | Latest                       |
| Framework          | React           | 19                           |
| Language           | TypeScript      | 5 (strict mode)              |
| Build Tool         | Vite            | 7                            |
| Routing            | TanStack Router | 1.x (file-based)             |
| Data Fetching      | TanStack Query  | 5.x                          |
| State              | Jotai           | 2.x (atoms with persistence) |
| HTTP Client        | Axios           | 1.x (interceptors for auth)  |
| Styling            | Tailwind CSS    | 4.x                          |
| UI Library         | HeroUI          | 2.x (standard components)    |
| Linting/Formatting | Biome           | 2.x                          |

---

## Architecture Overview

### Project Structure
```
src/
├── routes/                  # File-based routes (TanStack Router)
│   ├── __root.tsx          # Root layout with error boundary
│   ├── _auth.tsx           # Guest-only layout (login, etc.)
│   ├── _authenticated.tsx  # Protected layout
│   └── _authenticated/
│       ├── dashboard.tsx
│       └── students/
│           ├── index.tsx
│           └── $studentId.tsx
│
├── features/               # Feature-based organization
│   ├── students/
│   │   ├── components/    # StudentCard, StudentList, etc.
│   │   ├── hooks/         # useStudents, useStudentForm
│   │   ├── services/      # Feature-specific API calls
│   │   ├── stores/        # Feature-specific UI state
│   │   ├── utils/         # Feature-specific helpers
│   │   └── types.ts       # Student, StudentFormData, etc. (or types/ folder)
│   ├── rooms/
│   │   ├── components/    # RoomsTable, RoomDetailHeader, etc.
│   │   ├── hooks/         # useRooms, useRoom
│   │   ├── services/      # room.service.ts (API calls)
│   │   ├── stores/        # addRoomDrawer.store.ts
│   │   ├── utils/         # roomIcon.ts
│   │   └── types.ts       # Room, RoomType, etc.
│   └── auth/              # Reference implementation
│       ├── components/    # SignInForm, OTPVerificationForm, etc.
│       ├── constants.ts   # EMAIL_PATTERN, CODE_EXPIRATION_SECONDS
│       ├── hooks/         # useAuth
│       ├── services/      # auth.service.ts, token.service.ts
│       ├── stores/        # auth.store.ts
│       ├── utils/         # time.ts, password.ts
│       └── types/         # Modular types (see Types Organization)
│           ├── index.ts   # Re-exports all types
│           ├── user.ts    # User, AuthUser, AuthState
│           ├── api.ts     # Request/response types
│           └── forms.ts   # Form data types
│
├── components/             # Shared, generic UI components ONLY
│   └── ui/
│       ├── PageLoader.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
│
├── stores/                 # Global/shared state ONLY
│   ├── jotaiStore.ts      # appStore for outside React
│   └── auth.store.ts      # Auth atoms with localStorage
│                           # NOTE: Feature-specific state goes in features/{name}/stores/
│
├── services/               # Global/shared API infrastructure ONLY
│   ├── api.service.ts     # ApiClient singleton
│   ├── token.service.ts
│   └── redirect.service.ts
│                           # NOTE: Feature-specific API calls go in features/{name}/services/
│
├── utils/                  # Helper functions
└── routeTree.gen.ts        # Generated - do NOT edit
```

### Component Organization Philosophy

**Feature-Based Structure** (preferred):
- Each feature (students, rooms, staff, etc.) gets its own folder
- Colocate **all** related code: components, hooks, services, stores, utils, and types
- Feature-specific services and state management live within the feature
- Makes features self-contained, easy to find, modify, and lazy-load
- Clear boundaries between feature-specific and shared code

**When to use `components/ui/`**:
- Only for truly generic, reusable components used across multiple features
- Examples: PageLoader, ErrorBoundary, generic EmptyState
- **NOT for feature-specific components** (those go in `features/`)

**When NOT to create custom components**:
- If HeroUI provides a standard component, use it directly
- Avoid wrapping HeroUI components unless adding significant shared logic
- Keep styling minimal and prefer Tailwind utilities when needed

### Feature-Specific vs Shared Code

**Feature folder structure quick reference:**

| Folder/File | Purpose | When to Create |
|-------------|---------|----------------|
| `components/` | UI components | Always |
| `hooks/` | Custom hooks (data fetching, logic) | When using React Query or complex state |
| `services/` | API calls | When feature has backend endpoints |
| `stores/` | Jotai atoms (UI state) | When feature needs shared UI state |
| `utils/` | Helper functions | When logic is reused across components |
| `constants.ts` | Config, validation, mappings | When values are shared across files |
| `types.ts` | Type definitions | Simple features (<15 types) |
| `types/` | Modular type definitions | Complex features (15+ types) |

**Use `features/{name}/services/`** when:
- ✅ Service is ONLY used by that feature (e.g., `room.service.ts` only used by rooms feature)
- ✅ Service handles feature-specific domain logic
- ❌ Service is used across multiple features → use `src/services/`

**Use `features/{name}/stores/`** when:
- ✅ State is feature-specific UI state (e.g., drawer open/closed, form state)
- ✅ State is only consumed within that feature
- ❌ State is global app state (auth, theme, config) → use `src/stores/`

**Use `features/{name}/utils/`** when:
- ✅ Utility is specific to that feature's domain (e.g., `roomIcon.ts` for room icons)
- ✅ Utility is only used within that feature
- ❌ Utility is generic and reusable → use `src/utils/`

**Examples:**
- ✅ `features/rooms/services/room.service.ts` - Only rooms feature calls this API
- ✅ `features/rooms/stores/addRoomDrawer.store.ts` - UI state for rooms feature
- ❌ `src/services/api.service.ts` - Shared infrastructure used everywhere
- ❌ `src/stores/auth.store.ts` - Global auth state used everywhere

### Types Organization

**Single `types.ts`** (simple features):
- Use when feature has < 10-15 types
- Use when types don't have clear categories
- Simpler imports: `import type { User } from "../types"`

**`types/` folder** (complex features):
- Use when feature has many types (15+)
- Use when types have clear categories (user, api, forms)
- Always include `index.ts` for re-exports (backwards compatible imports)

**Types folder structure:**
```
types/
├── index.ts      # Re-exports everything for clean imports
├── entity.ts     # Domain/entity types (core models)
├── api.ts        # API request/response types
└── forms.ts      # Form data types (React Hook Form)
```

**Type categories:**
| Category | File | Examples |
|----------|------|----------|
| Domain/Entity | `entity.ts` | `User`, `Room`, `Student`, `RoomType` |
| API Request | `api.ts` | `CreateRoomPayload`, `UpdateStudentRequest` |
| API Response | `api.ts` | `RoomListResponse`, `StudentDetailResponse` |
| Store Results | `api.ts` | `LoginResult`, `MutationResult` |
| Form Data | `forms.ts` | `RoomFormData`, `StudentFormData` |

**DRY principle for types:**
- Define types in ONE place, import everywhere
- Never duplicate types in services or stores - move to `types/`
- Use `import type` for type-only imports

### Constants Organization

**File:** `constants.ts` at feature root

**Use `constants.ts`** for:
- Validation patterns (email regex, phone regex)
- Time values (timeouts, cooldowns, expiration)
- Magic numbers with semantic meaning
- Configuration values used across components
- Color/style maps for dynamic styling

**Common constant categories:**

| Category | Examples |
|----------|----------|
| Validation patterns | `EMAIL_PATTERN`, `PHONE_PATTERN`, `URL_PATTERN` |
| Time values | `TIMEOUT_MS`, `CACHE_DURATION_SECONDS`, `DEBOUNCE_MS` |
| Limits/Sizes | `MAX_FILE_SIZE`, `PAGE_SIZE`, `MAX_ITEMS` |
| Status/State maps | `statusColorMap`, `rolePermissions`, `stepConfig` |
| Configuration arrays | `tableColumns`, `filterOptions`, `sortOptions` |

**Example** (`features/rooms/constants.ts`):
```ts
// Validation
export const ROOM_NAME_MAX_LENGTH = 100
export const ROOM_CAPACITY_MAX = 50

// Configuration
export const roomTypeConfig = {
  classroom: { icon: "classroom", label: "Classroom", color: "primary" },
  office: { icon: "office", label: "Office", color: "secondary" },
  lab: { icon: "lab", label: "Laboratory", color: "warning" },
}

// Table columns
export const roomTableColumns = [
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "capacity", label: "Capacity", sortable: true },
  { key: "actions", label: "Actions" },
]
```

**When to use constants:**
- ✅ Value is used in multiple files
- ✅ Value has semantic meaning (not just a random number)
- ✅ Value might change in the future
- ❌ Value is only used once inline (keep it local)

**Naming conventions:**
- `SCREAMING_SNAKE_CASE` for primitive values (`CODE_EXPIRATION_SECONDS`)
- `camelCase` for objects/arrays (`passwordRequirements`, `strengthColorMap`)

---

## Code Conventions

### Module Exports
- **Prefer default export** when a module exports only one piece of code
  ```tsx
  // ✅ Good - single component
  export default function StudentCard({ student }: Props) {
    return <div>{student.name}</div>
  }
  ```
  ```ts
  // ✅ Good - multiple related exports (hooks, utils)
  export function useStudents() { }
  export function useStudentForm() { }
  ```
  ```tsx
  // ❌ Avoid - unnecessary named export for single component
  export function StudentCard({ student }: Props) { }
  ```

### React Types
- **Use `React.*` types** instead of importing separately
  ```tsx
  // ✅ Good
  function MyComponent({ children }: { children: React.ReactNode }) {
    const ref = React.useRef<HTMLDivElement>(null)
    return <div ref={ref}>{children}</div>
  }
  ```
  ```tsx
  // ❌ Avoid
  import type { ReactNode, useRef } from 'react'
  function MyComponent({ children }: { children: ReactNode }) { }
  ```

### TypeScript
- **Strict mode enabled** — no `any`, prefer explicit types
- **Path alias**: `@/*` → `src/*` (configured in `tsconfig.json`)
- **Type imports**: Biome auto-organizes with `type` keyword where applicable
- **Generics for API calls**:
  ```ts
  const data = await apiClient.get<User>('/users/me')
  //    ^? User
  ```

### Programming Paradigm
- **Prefer Functional Programming over OOP**
  ```ts
  // ✅ Good - pure function
  function calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price, 0)
  }
  ```
  ```ts
  // ❌ Avoid - unnecessary class
  class Calculator {
    calculateTotal(items: CartItem[]): number {
      return items.reduce((sum, item) => sum + item.price, 0)
    }
  }
  ```
  **Exception**: Classes are fine for stateful abstractions like `ApiClient` or when interfacing with class-based libraries.

### Imports
Biome auto-organizes imports with these rules:
1. Node/package imports (external)
2. Blank line
3. Alias imports (`@/**`)
4. Blank line
5. Parent relative (`../**`)
6. Blank line
7. Sibling relative (`./**`)
8. Blank line
9. Current directory (`.`)
10. Blank line
11. Type imports
12. Blank line
13. CSS imports

**Run `bun run fix` to auto-organize.**

### Styling
- **Use standard HeroUI components** without custom styling
- **Tailwind v4** for spacing, layout, and minor tweaks only
- **Avoid custom wrapper components** unless adding shared logic
- **Class sorting**: Biome enforces sorted Tailwind classes (see `biome.json:23`)

**Example**:
```tsx
// ✅ Good - standard HeroUI + minimal Tailwind
import { Button, Card, CardBody } from '@heroui/react'

export default function StudentCard({ student }: Props) {
  return (
    <Card>
      <CardBody className="gap-4">
        <h3>{student.name}</h3>
        <Button onPress={() => handleEdit(student)}>Edit</Button>
      </CardBody>
    </Card>
  )
}
```

```tsx
// ❌ Avoid - unnecessary wrapper component
function CustomButton(props: ButtonProps) {
  return <Button {...props} />  // No added value
}
```

### Naming
- **Files**: kebab-case (e.g., `student-card.tsx`)
- **Components**: PascalCase (e.g., `StudentCard`)
- **Hooks**: camelCase starting with `use` (e.g., `useCurrentUser`)
- **Services**: camelCase (e.g., `fetchUserProfile`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `ApiResponse<T>`)

---

## Common Patterns & Recipes

### 1. Add a New Feature

**Step 1**: Create feature folder (create only what you need)

**Simple feature** (few types):
```
src/features/my-feature/
├── components/
│   ├── MyFeatureCard.tsx      # default export
│   └── MyFeatureList.tsx      # default export
├── hooks/
│   └── useMyFeature.ts        # named exports
├── services/                   # Optional: if feature needs API calls
│   └── myFeature.service.ts
├── stores/                     # Optional: if feature needs UI state
│   └── myFeature.store.ts
├── utils/                      # Optional: if feature needs helpers
│   └── myFeatureHelper.ts
├── constants.ts                # Optional: shared constants (patterns, timeouts)
└── types.ts                    # named exports
```

**Complex feature** (many types with clear categories):
```
src/features/my-feature/
├── components/
│   ├── MyFeatureCard.tsx
│   ├── MyFeatureList.tsx
│   └── MyFeatureForm.tsx
├── hooks/
│   └── useMyFeature.ts
├── services/
│   └── myFeature.service.ts
├── stores/
│   └── myFeature.store.ts
├── utils/
│   └── myFeatureHelper.ts
├── constants.ts               # Validation, config, column definitions
└── types/
    ├── index.ts               # Re-exports all types
    ├── entity.ts              # Domain types (MyFeature, MyFeatureStatus)
    ├── api.ts                 # API request/response types
    └── forms.ts               # Form data types
```

**Step 2**: Create route
```tsx
// src/routes/_authenticated/my-feature.tsx
import { createFileRoute } from '@tanstack/react-router'

import MyFeatureList from '@/features/my-feature/components/MyFeatureList'

export const Route = createFileRoute('/_authenticated/my-feature')({
  component: MyFeaturePage,
})

function MyFeaturePage() {
  return (
    <div className="p-6">
      <MyFeatureList />
    </div>
  )
}
```

### 2. Add a Feature Component

**File**: `src/features/students/components/StudentCard.tsx`
```tsx
import { Card, CardBody, CardHeader } from '@heroui/react'

import type { Student } from '../types'

interface Props {
  student: Student
  onEdit?: (student: Student) => void
}

export default function StudentCard({ student, onEdit }: Props) {
  return (
    <Card>
      <CardHeader>
        <h3>{student.name}</h3>
      </CardHeader>
      <CardBody className="gap-2">
        <p>Age: {student.age}</p>
        {onEdit && (
          <Button onPress={() => onEdit(student)}>Edit</Button>
        )}
      </CardBody>
    </Card>
  )
}
```

**Usage in route**:
```tsx
import StudentCard from '@/features/students/components/StudentCard'

function StudentsPage() {
  return <StudentCard student={student} onEdit={handleEdit} />
}
```

### 3. Add a Data-Fetching Hook (React Query)

**Service function** (`src/features/students/services/student.service.ts`):
```ts
import { apiClient } from '@/services/api.service'

import type { Student } from '../types'

export async function fetchStudentById(studentId: string): Promise<Student> {
  return apiClient.get<Student>(`/students/${studentId}`)
}

export async function fetchStudents(): Promise<Student[]> {
  return apiClient.get<Student[]>('/students')
}
```

**Hook** (`src/features/students/hooks/useStudents.ts`):
```ts
import { useQuery } from '@tanstack/react-query'

import { fetchStudentById, fetchStudents } from '../services/student.service'

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: () => fetchStudentById(studentId),
    enabled: !!studentId,
  })
}
```

**Usage in component**:
```tsx
import { Spinner } from '@heroui/react'

import { useStudents } from '@/features/students/hooks/useStudents'
import StudentCard from '@/features/students/components/StudentCard'

export default function StudentList() {
  const { data: students, isLoading, error } = useStudents()

  if (isLoading) return <Spinner />
  if (error) return <div>Error loading students</div>

  return (
    <div className="grid gap-4">
      {students?.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  )
}
```

### 4. Add Global State (Jotai Atom)

**For GLOBAL state only** (theme, auth, etc.). For feature-specific state, use `features/{name}/stores/`.

**File**: `src/stores/theme.store.ts`
```ts
import { atomWithStorage } from 'jotai/utils'

export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'light')
```

**Usage in React**:
```tsx
import { useAtom } from 'jotai'

import { themeAtom } from '@/stores/theme.store'

export default function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <Button onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme ({theme})
    </Button>
  )
}
```

**Usage outside React**:
```ts
import { appStore } from '@/stores/jotaiStore'
import { themeAtom } from '@/stores/theme.store'

const currentTheme = appStore.get(themeAtom)
appStore.set(themeAtom, 'dark')
```

### 5. Add Authentication Guard (beforeLoad)

**Example**: Check user role before entering route
```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

import { appStore } from '@/stores/jotaiStore'
import { userAtom } from '@/stores/auth.store'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: () => {
    const user = appStore.get(userAtom)
    if (user?.role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  return <div>Admin only content</div>
}
```

### 6. Handle API Errors Consistently

**Service layer** (`src/features/students/services/student.service.ts`):
```ts
import { apiClient } from '@/services/api.service'

import { ApplicationError, logError } from '@/utils/error'

import type { Student } from '../types'

export async function deleteStudent(studentId: string): Promise<void> {
  try {
    await apiClient.delete(`/students/${studentId}`)
  } catch (error) {
    logError('Failed to delete student', error)
    throw new ApplicationError('Could not delete student. Please try again.')
  }
}
```

**Component layer**:
```tsx
import { Button } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'

import { deleteStudent } from '../services/student.service'

interface Props {
  studentId: string
}

export default function DeleteStudentButton({ studentId }: Props) {
  const deleteMutation = useMutation({
    mutationFn: () => deleteStudent(studentId),
    onSuccess: () => {
      // Invalidate cache, show success toast, etc.
    },
    onError: (error) => {
      // Show error toast with error.message
      console.error('Delete failed:', error)
    },
  })

  return (
    <Button
      onPress={() => deleteMutation.mutate()}
      isLoading={deleteMutation.isPending}
      color="danger"
    >
      Delete
    </Button>
  )
}
```

---

## Key Concepts

### 1. File-Based Routing
- Routes are defined by file structure in `src/routes/`
- Plugin auto-generates route tree → `src/routeTree.gen.ts`
- Layouts: `_authenticated.tsx` (protected), `_auth.tsx` (guest)
- Ignore files from routing by prefixing with `-` (e.g., `-components.tsx`)

### 2. State Management
- Jotai atoms in `src/stores/*.store.ts`
- Atoms with persistence use `atomWithStorage` (backed by localStorage)
- Outside React: import `appStore` from `src/stores/jotaiStore.ts`
  ```ts
  import { appStore } from '@/stores/jotaiStore'
  appStore.get(myAtom)  // read
  appStore.set(myAtom, value)  // write
  ```

### 3. API Layer
- Always use `apiClient` from `src/services/api.service.ts`
- Never call `axios` directly from components
- Interceptors handle:
  - Auto-inject `Authorization: Bearer {token}` header
  - 401 → attempt token refresh → retry request OR redirect to login
- Dev proxy: `/api/*` → `http://localhost:8000` (see [vite.config.ts:27](vite.config.ts#L27))

### 4. Authentication Flow
- Tokens stored in atoms ([src/stores/auth.store.ts](src/stores/auth.store.ts))
- Protected routes use `_authenticated` layout with `beforeLoad` guards
- On 401 (non-auth endpoint):
  1. Call `refreshAccessToken()` via interceptor
  2. If success → retry original request
  3. If fail → `clearToken()` + `redirectToLogin()`

---

## Critical Don'ts

### 🚫 DO NOT
1. **Edit generated files** — `src/routeTree.gen.ts` is auto-generated by TanStack Router
2. **Call axios directly** — always use `apiClient` from `src/services/api.service.ts`
3. **Access localStorage directly** — use Jotai `atomWithStorage` in `src/stores/`
4. **Create unnecessary wrapper components** — use HeroUI components directly
5. **Add custom styling to HeroUI components** — keep them standard
6. **Bypass the services layer** — components should never import `axios`
7. **Commit without running checks** — always run `bun run typecheck` and `bun run check`
8. **Use `any` type** — use `unknown` and type narrowing, or proper generics
9. **Put feature-specific code in `components/ui/`** — use `features/` instead
10. **Import React types separately** — use `React.ReactNode`, `React.FC`, etc.
11. **Use classes unnecessarily** — prefer functional programming

### ✅ DO
1. **Follow feature-based structure** — colocate related code in `features/`
2. **Use default export** for single-component modules
3. **Use standard HeroUI components** without wrappers
4. **Follow existing file patterns** — grep for similar implementations
5. **Use the service layer** — components → hooks → services → `apiClient`
6. **Run `bun run fix`** — before committing to auto-organize imports/formatting
7. **Add types for API responses** — use generics with `apiClient.get<T>()`
8. **Prefer functional programming** — pure functions over classes
9. **Keep components simple** — extract hooks for complex logic
10. **Test auth flows** — if touching auth/API, verify token refresh and redirects

---

## Development Workflow

### Before You Start
1. Ensure Bun is installed (this is a Bun-first project)
2. Run `bun install` to install dependencies
3. Check `bun run typecheck` and `bun run check` pass

### Making Changes
1. **Read existing patterns first** — search for similar components/routes/services
2. **Use existing utilities** — don't reinvent helpers that already exist
3. **Follow the layers**:
   - UI components → call hooks
   - Hooks (React Query) → call service functions
   - Services → use `apiClient`
4. **Keep changes surgical** — small, focused commits aligned with existing patterns

### Before Committing
- [ ] `bun run typecheck` — no TypeScript errors
- [ ] `bun run check` — no linting/formatting issues (or run `bun run fix`)
- [ ] Test auth flows if touching API/auth code
- [ ] Verify new routes appear in `src/routeTree.gen.ts` after dev run
- [ ] Check import organization (Biome auto-sorts, but verify)
- [ ] Ensure components use default export when appropriate
- [ ] Verify HeroUI components are used without unnecessary wrappers

---

## Environment Variables

**Defined in**: [src/vite-env.d.ts](src/vite-env.d.ts)

```ts
VITE_API_BASE_URL       // API base URL (e.g., http://localhost:8000/api/v1)
VITE_API_URL            // Deprecated - use VITE_API_BASE_URL instead
VITE_APP_TITLE          // Application title
VITE_GOOGLE_CLIENT_ID   // Google OAuth client ID
```

**Usage**:
```ts
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

**Dev Proxy**: The dev server proxies `/api/*` to `http://localhost:8000` (see [vite.config.ts:27](vite.config.ts#L27))

**Note**: There's an inconsistency — both `VITE_API_BASE_URL` and `VITE_API_URL` are declared. The codebase uses `VITE_API_BASE_URL` with fallback to `/api/v1`. Prefer `VITE_API_BASE_URL`.

---

## Error Handling

### Error Boundary
- **Root level**: [src/routes/__root.tsx](src/routes/__root.tsx) wraps app in `ErrorBoundary`
- **Component isolation**: Import `ErrorBoundary` from [src/components/error/ErrorBoundary.tsx](src/components/error/ErrorBoundary.tsx) and set `isolate` prop

### API Errors
1. **401 Unauthorized**:
   - Interceptor attempts `refreshAccessToken()`
   - If refresh fails → `clearToken()` + `redirectToLogin()`
   - Exception: auth check endpoints (`/auth/me`, `/auth/verify`, `/auth/refresh`) skip retry

2. **Other errors**:
   - Service layer converts to `ApplicationError` with user-friendly message
   - Log via `logError` from [src/utils/error.ts](src/utils/error.ts)
   - React Query `onError` displays toast/notification

---

## Known Issues & Inconsistencies

1. **Environment variable naming**:
   - Both `VITE_API_BASE_URL` and `VITE_API_URL` are declared
   - Codebase uses `VITE_API_BASE_URL` — recommend removing `VITE_API_URL`

2. **README run instructions**:
   - README mentions `bun run index.ts` (backend-style)
   - This is a Vite React SPA — use `bun run dev` instead
   - Consider updating README to reflect frontend commands

3. **Dev/prod environment**:
   - Dev server proxies `/api` to `localhost:8000`
   - Production builds expect backend at same origin or `VITE_API_BASE_URL`
   - Ensure deployment config matches this expectation

---

## Development Principles

When working in this codebase, apply these principles:

- **KISS** (Keep It Simple, Stupid) — prefer simple, obvious solutions
- **YAGNI** (You Aren't Gonna Need It) — don't add features/abstractions speculatively
- **DRY** (Don't Repeat Yourself) — extract reusable utilities, but don't over-abstract
- **Functional over OOP** — prefer pure functions, avoid classes unless necessary
- **Explicit over implicit** — clear types, descriptive names, obvious data flow
- **Fail fast** — validate early, throw meaningful errors, don't silently swallow issues
- **Composition over inheritance** — compose small functions/components into larger ones

---

## Troubleshooting

### Route not appearing?
- Check file is in `src/routes/` and doesn't start with `-`
- Restart dev server to regenerate `src/routeTree.gen.ts`
- Verify `export const Route = createFileRoute('...')({ component })`

### Import errors?
- Run `bun run fix` to auto-organize imports
- Check path alias (`@/*`) is correct in `tsconfig.json`
- Verify file exists at expected path

### Component not found?
- Check if it's in `features/[feature-name]/components/`
- Verify default export: `export default function MyComponent() {}`
- Use import: `import MyComponent from '@/features/[feature]/components/MyComponent'`

### API 401 errors?
- Check `localStorage` for `auth-token` (via DevTools → Application → Local Storage)
- Verify backend is running on `localhost:8000` (or configured proxy target)
- Check Network tab for token refresh attempts

### TypeScript errors?
- Run `bun run typecheck` to see all errors
- Vite plugin checker shows real-time errors in browser (see [vite.config.ts:21](vite.config.ts#L21))
- Check `tsconfig.json` for strict mode settings

### Biome/linting errors?
- Run `bun run check` to see all issues
- Run `bun run fix` to auto-fix most issues
- Check [biome.json](biome.json) for configuration

## Commit rules:
- Don't include internal comments like 🤖 Generated with [Claude Code](https://claude.com/claude-code) etc.

---

## Resources

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [Jotai Docs](https://jotai.org/)
- [HeroUI Docs](https://heroui.com/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Biome Docs](https://biomejs.dev/)

---

**Last Updated**: 2025-12-01
**For**: Claude Code & AI Agents
