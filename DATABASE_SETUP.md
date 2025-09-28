# Database Setup Guide

This document explains how to set up the database for the Event Scheduler application.

## Files Overview

### Core Schema Files

- **`schema.sql`** - Complete database schema for fresh installations
- **`database-design.md`** - Comprehensive documentation of the database design

### Migration Files

- **`migrations/20240610_insert_sample_ai_conference.sql`** - Sample conference data
- **`migrations/20250928_add_conflict_detection.sql`** - Conflict detection system (for existing databases)

## Setup Options

### Option 1: Fresh Installation

For new Supabase projects, apply the complete schema:

```sql
-- Apply the complete schema
\i schema.sql

-- Then add sample data (optional)
\i migrations/20240610_insert_sample_ai_conference.sql
```

### Option 2: Existing Database Update

If you have an existing database missing the conflict detection features:

```sql
-- Apply the conflict detection migration
\i migrations/20250928_add_conflict_detection.sql
```

## Database Features

### Core Tables

1. **conferences** - Conference information
2. **session_tracks** - Session categories/tracks
3. **participants** - Speakers and presenters
4. **sessions** - Individual conference sessions
5. **session_participants** - Speaker-session relationships
6. **user_scheduled_sessions** - User's personal schedule

### Key Features

- **Authentication Integration**: Uses Supabase's built-in auth system
- **Row Level Security (RLS)**: Protects user data with proper policies
- **Conflict Detection**: Automatically detects scheduling conflicts
- **Performance Optimized**: Comprehensive indexing strategy
- **Audit Trail**: Automatic timestamp tracking

### Conflict Detection System

The system automatically detects when users schedule overlapping sessions:

- Triggers update the `has_conflict` column automatically
- Conflicts are based on time overlaps on the same date
- Performance optimized with partial indexing

## Environment Setup

Ensure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Testing

Use the built-in test page to verify everything is working:

- Visit `/test-auth` to test database connectivity
- Try the authentication flows
- Test scheduling conflicts by adding overlapping sessions

## Security Notes

- All tables have Row Level Security enabled
- Users can only access their own scheduled sessions
- Functions use secure search paths
- Proper foreign key constraints with cascade rules
