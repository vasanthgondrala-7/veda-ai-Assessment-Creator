# VedaAI Assessment Creator - Monorepo Structure

## Overview

This repository has been converted from a single repository to an npm workspaces monorepo. This structure improves code organization, dependency management, and enables sharing code between frontend and backend.

## Directory Structure

```
veda-ai-Assessment-Creator/
├── packages/
│   ├── frontend/          # React/Vite frontend application
│   │   ├── src/
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── backend/           # Express.js backend application
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── shared/            # Shared types, utils, and constants
│       ├── src/
│       │   ├── types/
│       │   ├── utils/
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
├── tsconfig.json          # Root TypeScript configuration
├── package.json           # Root package configuration with workspaces
└── .npmrc                 # NPM configuration for workspaces
```

## Packages

### `@veda-ai/frontend`
- React 19 + Vite
- TypeScript
- Tailwind CSS
- React Router
- Socket.io client for real-time updates
- Zustand for state management

**Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Type check with TypeScript

### `@veda-ai/backend`
- Express.js
- TypeScript
- Google GenAI SDK
- Socket.io for real-time updates
- Node.js ESM modules

**Scripts:**
- `npm run dev` - Start development server with tsx
- `npm run build` - Build for production with esbuild
- `npm run start` - Run production build
- `npm run lint` - Type check with TypeScript

### `@veda-ai/shared`
- Shared TypeScript types
- Utility functions
- No external dependencies
- Reusable across frontend and backend

**Exports:**
- Default: All types and utils
- `./types` - Type definitions
- `./utils` - Utility functions

## Root Scripts

Run from the root directory:

```bash
# Development
npm run dev                # Run all packages in development
npm run dev:frontend       # Run only frontend
npm run dev:backend        # Run only backend

# Build
npm run build              # Build all packages
npm run build:frontend     # Build only frontend
npm run build:backend      # Build only backend

# Linting
npm run lint:all           # Lint all packages

# Cleanup
npm run clean              # Clean all dist folders and node_modules
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vasanthgondrala-7/veda-ai-Assessment-Creator.git
cd veda-ai-Assessment-Creator
```

2. Install dependencies:
```bash
npm install
```

NPM will automatically install dependencies for all workspaces.

## Development

### Option 1: Run all workspaces together
```bash
npm run dev
```

### Option 2: Run individual workspaces in separate terminals
```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

## TypeScript Configuration

- **Root (`tsconfig.json`)**: Base configuration with path aliases
- **Workspace configs**: Extend root config and override as needed

### Path Aliases

Import from other packages using path aliases:

```typescript
// In frontend or backend
import { Question, Assessment } from '@veda-ai/shared';
import { formatDate, calculateTotalMarks } from '@veda-ai/shared/utils';
```

## Workspace Dependencies

Workspaces reference each other using `workspace:*` protocol in package.json:

```json
{
  "dependencies": {
    "@veda-ai/shared": "workspace:*"
  }
}
```

This ensures local development works seamlessly without publishing to npm.

## Adding New Packages

1. Create a new directory in `packages/`
2. Add `package.json` with name prefixed by `@veda-ai/`
3. Add `tsconfig.json` extending root config
4. Add to root `package.json` workspaces array
5. Run `npm install` from root

## Benefits of This Structure

1. **Code Sharing**: Common types and utilities shared between frontend and backend
2. **Dependency Management**: Single `node_modules` at root level
3. **Scalability**: Easy to add more packages (e.g., `@veda-ai/cli`, `@veda-ai/worker`)
4. **Type Safety**: Shared TypeScript configuration and types
5. **Development Experience**: Unified scripts and easy local development
6. **Independent Deployment**: Each package can be deployed separately

## Environment Variables

Create `.env` files in respective packages:
- `packages/frontend/.env`
- `packages/backend/.env`

See `.env.example` in each package for required variables.

## Building for Production

```bash
# Build all packages
npm run build

# Frontend builds to: packages/frontend/dist
# Backend builds to: packages/backend/dist
```

## Deployment

Each package can be deployed independently:
- Frontend: Deploy `packages/frontend/dist` to static hosting (Vercel, Netlify, etc.)
- Backend: Deploy `packages/backend/dist` to Node.js hosting (Render, Railway, etc.)

## Troubleshooting

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors with path aliases
- Ensure `tsconfig.json` paths are correct
- Run `npm install` to regenerate symlinks in `node_modules`

### Port conflicts
- Frontend runs on `5173` by default (configurable in `vite.config.ts`)
- Backend runs on `3000` by default (configurable in server code)
