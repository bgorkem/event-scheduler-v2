# EventSchedule - Copilot Instructions

## Architecture Overview

This is a Next.js 15 TypeScript conference session scheduling app with Supabase PostgreSQL backend. Users can browse sessions, add them to personal schedules, and get automatic conflict detection for overlapping sessions.

### Key Components

- **Frontend**: Next.js 14+ with App Router, Shadcn/ui + Tailwind CSS, Lucide icons
- **Backend**: Supabase with Row Level Security, stored procedures for conflict detection
- **Auth**: Supabase Auth with email/password and social login support
- **Database**: PostgreSQL with sophisticated session scheduling and conflict detection

## Core Architecture Patterns

### Supabase Client Patterns

- **Browser**: Use `@/lib/supabase/client` (`createClient()`) for client components
- **Server**: Use `@/lib/supabase/server` (`createClient()`) for server components/actions
- **Middleware**: Authentication handled in `src/middleware.ts` with session updates

### Data Access Layer

- All database operations go through DAL functions in `src/lib/dal/sessions.ts`
- Use stored procedures `schedule_session_for_user()` and `unschedule_session_for_user()` for scheduling
- Never manipulate `user_scheduled_sessions` directly - use the stored procedures for conflict detection

### Server Actions Pattern

- Server actions in `src/app/actions/` use `'use server'` directive
- Always `revalidatePath()` after mutations to refresh cached data
- Example: `toggleScheduleSessionAction` in `src/app/actions/schedule.ts`

### Component Organization

- UI components in `src/components/ui/` (Shadcn/ui generated)
- Layout components in `src/components/layout/`
- Feature-specific components co-located with routes (e.g., `SessionCard.tsx`)

## Database Schema Essentials

### Core Tables

- `conferences` - Conference info
- `sessions` - Individual conference sessions with date/time
- `participants` - Speakers/presenters
- `session_participants` - Many-to-many speaker-session relationships
- `user_scheduled_sessions` - User's personal schedule with conflict detection

### Critical Business Logic

- **Conflict Detection**: Automatic via stored procedures, never update `has_conflict` manually
- **Scheduling**: Always use `schedule_session_for_user(user_id, session_id)` and `unschedule_session_for_user(user_id, session_id)`
- **RLS**: All tables have Row Level Security enabled

## Development Workflows

### Environment Setup

```bash
npm install
# Create .env.local with Supabase keys (see README.md)
npm run dev  # Starts on localhost:3000
```

### Database Setup

- Fresh install: Apply `schema.sql` then sample data from `migrations/`
- Existing DB: Run migration files in `migrations/` directory
- Use Supabase SQL editor or local `psql` connection

### Key Routes Structure

- `/` - Landing page
- `/auth/signin` `/auth/signup` - Authentication
- `/members/sessions` - Browse all sessions (protected)
- `/members/schedule` - User's personal schedule (protected)
- `/admin` - Admin dashboard (protected)

## Component Patterns

### Server Components (Default)

```typescript
import { createClient } from "@/lib/supabase/server";
// Fetch data directly in component
```

### Client Components

```typescript
"use client";
import { supabase } from "@/lib/supabase/client";
// Use for interactivity, auth state, forms
```

### Form Actions with useActionState

```typescript
const [state, formAction, isPending] = useActionState(
  serverAction,
  initialState
);
// See SessionCard.tsx for pattern
```

## Common Tasks

### Adding New Session Features

1. Update database schema if needed (create migration in `migrations/`)
2. Add DAL function in `src/lib/dal/sessions.ts`
3. Create server action in `src/app/actions/`
4. Update UI components with `useActionState` pattern

### Authentication Checks

- Server: `const { data: { user } } = await supabase.auth.getUser()`
- Client: `supabase.auth.onAuthStateChange()` for real-time updates
- Protected routes use middleware for automatic redirects

### Code Style & Formatting

- **ESLint**: Run `npm run lint` to check, `npm run lint:fix` to auto-fix
- **Stylistic Rules**: 2-space indentation, double quotes, semicolons required
- **Line Length**: Max 100 characters (ignoring URLs, strings, templates)
- **JSX**: Double quotes, no spaces in curly braces, self-closing tags with space before `/>`
- **TypeScript**: Semicolon-delimited interfaces, proper type annotation spacing

### UI/Design Conventions

- Use Shadcn/ui components from `src/components/ui/`
- Tailwind CSS with mobile-first responsive design
- Lucide icons for consistency
- Professional, clean design with gradients for events/conferences

### Development Commands

```bash
npm run dev          # Start development server
npm run lint         # Check code style and errors
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with ESLint stylistic rules
npm run build        # Build for production
```
