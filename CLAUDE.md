# Claude Code Guide: Frontend Development with React & TypeScript 🎨

## Project Stack Overview
- **React 19+** with TypeScript
- **HeroUI** (NextUI-based component library) with Tailwind CSS
- **TanStack Query** (React Query) with file-based router
- **React Hook Form** for form management
- **Vite** for blazing-fast builds
- **Bun** for package management
- **ESLint/Prettier** for code quality

## Available Scripts
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint issues
- `bun run typecheck` - Run TypeScript checking
- `bun run format` - Format code with Prettier

# Claude Code Guide: Modular Frontend Development 🎨

## Core Principles 🎯
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)
- **SRP** (Single Responsibility Principle)
- Keep code as simple as possible
- Use modern stable APIs
- Check solution before implementing it
- Prevent potential errors and inconsistencies
- **IGNORE node_modules FOLDER**

## Project Structure 📁

```
src/
├── assets/             # images/fonts etc
│   ├── images/         # Static images like png/jpeg/webp etc
│   └── fonts/          # Fonts
├── components/         # UI components
│   ├── [name].tsx      # Common component
│   └── [name]/├──index.tsx
               └──[name].data.tsx # If a component has mock data create a folder.
├── hooks/
      └── use[Name].ts  # Custom React hooks
├── services/           # API services
├── types/              # TypeScript types
├── utils/              # Utilities
├── pages/              # Page components
├── schemas/            # Validation schemas
└── styles/             # Global styles
```

## Code Organization Patterns 🚀

### Component Structure
Every component should follow this pattern(otherwise export default if a module exports only 1 thing. Applies to component/hooks/types/services/utils etc):
```typescript
// types/[domain].types.ts
interface ComponentProps { }

export default ComponentProps;  //Otherwise use named export if a module has multiple exports

// hooks/use[Feature].ts
const useFeature = () => {
  // Business logic here
  return { /* ... */ }
}

export default useFeature;

// services/[domain].service.ts
const fetchData = async () => {
  // API calls here
}

export default fetchData; //Otherwise use named export if a module has multiple exports

// components/[Component].tsx
const Component = () => {
  // UI only, use hooks for logic
}

export default Component;
```

### Service Layer Pattern
```typescript
// services/api.client.ts
// Axios instance with base config

// services/[resource].service.ts
import { apiClient } from './api.client'
// CRUD operations for specific resource
```

### Hook Pattern
```typescript
// hooks/use[Name].ts
const useName = (params?: Type) => {
  // Logic encapsulation
  // State management
  // Side effects
  return { /* data, methods, state */ }
}

export default useName;
```

### Type Organization
```typescript
// types/api.types.ts - API response types
// types/models/[domain].ts - Domain models
// types/common.types.ts - Shared types
```

## File Naming Conventions 📚

| Type       | Pattern             | Example            |
| ---------- | ------------------- | ------------------ |
| Component  | `PascalCase.tsx`    | `UserCard.tsx`     |
| Hook       | `use[Name].ts`      | `useAuth.ts`       |
| Query Hook | `use[Name]Query.ts` | `useUsersQuery.ts` |
| Service    | `[name].ts`         | `auth.ts`          |
| Type       | `[name].ts`         | `User.ts`          |
| Util       | `[name].ts`         | `date.ts`          |
| Schema     | `[name].ts`         | `login.ts`         |

## Modular Development Rules 📋

### 1. Separation of Concerns
- **Components**: UI rendering only
- **Hooks**: Business logic & state
- **Services**: External communications
- **Utils**: Pure functions
- **Types**: Data contracts

### 2. Import Order
```typescript
// 1. External libraries
import axios from 'axios'
import { useCallback, useEffect } from 'react'

// 2. Internal absolute paths
import Button from '@/components/Button.tsx'

// 3. Relative imports
import useLocalHook from './hooks/useLocalHook.ts'

// 4. Types
import type User from '@/types/userSpecificPath'

// 5. Styles
import './styles.css'
```

### 3. Folder Structure Rules
- Each feature gets its own folder
- No circular dependencies
- Index files for clean exports

### 4. When to Create Files
- **New file when**: Different responsibility
- **Same file when**: Tightly coupled logic
- **New folder when**: Multiple related files

## Best Practices 🎯

### TypeScript First
- Define types before implementation
- Use strict mode
- Avoid `any` type
- Leverage type inference

### API Integration
- Centralized error handling
- Request/response interceptors
- Type-safe responses
- Loading state management

### State Management
- Local state for component-specific data
- Global state only when necessary
- Server state separate from UI state

### Code Quality
- Single responsibility per file
- Descriptive naming
- Consistent patterns
- Avoid premature optimization

### Hook Naming Conventions
- **Regular Hooks**: `use[Name].ts` - For state management, side effects, and business logic (e.g., `useAuth.ts`, `useTheme.ts`)
- **Query Hooks**: `use[Name]Query.ts` - For TanStack Query hooks that fetch data (e.g., `useUsersQuery.ts`, `useDashboardQuery.ts`)
- This distinction helps identify data-fetching hooks at a glance and keeps them organized

## Anti-Patterns to Avoid ⚠️
- Business logic in components
- API calls in components
- Multiple responsibilities per file
- Deep nesting
- Circular dependencies
- Over-abstraction

## Development Workflow 💡

1. **Define types** first
2. **Create service** layer
3. **Build hooks** for logic
4. **Implement UI** components
5. **Add utilities** as needed

Remember: Consistency and clarity over cleverness! 🚀