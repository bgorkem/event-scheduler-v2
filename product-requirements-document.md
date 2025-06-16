# Product Requirements Doc for eventschedule.co.uk

Create a Product Requirements Document about this web application eventschedule.co.uk which allows users to browse / search sessions of a conference and schedule them in their calendar. Application allows users to upload conference schedule using smart AI parsing web urls.

# Non-functional requirements

- Application has to be built by NextJs Typescript
- Use ShadCN Tailwind CSS with clean and professional design with mobile first design principles,
- Backend should be implemented with Supabase PostgreSQL database on the cloud.
- Use Supabase project by using Supabase MCP tool
- Use the `database-design.md` document to design and populate the database.
- It should have testing library react and playwright automation tests.
- Use Lucide icons and modern gradients. Focus on conference/event imagery.

# Functional Requirements

## Login/Signup page

It should use Supabase supported social login or email/password login authentication

## Home Page (Landing page)

Create a modern NextJS homepage. On home page include:

- Hero section with tagline "Never miss another session" and search bar
- Features showcase (browse sessions, smart filtering, calendar sync)
- CTA section for conference organizers
- Responsive design with dark mode toggle

## Admin page

- Add a new conference schedule (including edit and delete)
- Edit session details including title, speaker, photo, time date, location, session track

## Session Browse / Search page

- Advanced search bar with filters (date, time, track, speaker, difficulty)
- Session cards showing title, speaker, time, duration, and Add to Calendar and Share buttons
- Left sidebar with filter options (collapsible on mobile)
- Grid/list view toggle
- Pagination or infinite scroll
- Loading states and empty statesInclude realistic conference session data. Use Card, Badge, Button, and Input components.

## Session Detail View

Create a detailed session view for eventschedule.co.uk using NextJS and Shadcn/ui:

- Session header with title, speaker photo, time, and location
- Tabs for Description, Speaker Bio, and Related Sessions
- Prominent "Add to Calendar" and "Share" buttons
- Recommended sessions carousel
- Breadcrumb navigation
- Responsive layout with proper typography hierarchyUse realistic conference content and modern UI patterns.

## Calendar/Schedule View

Build a personal schedule view using NextJS and Shadcn/ui components:

- Calendar grid showing user's selected sessions- Day/week view toggle- Time slots with session cards- Conflict detection (overlapping sessions highlighted)- Export options (Google Calendar, Outlook, ICS)- Quick actions to remove or modify sessions- Empty states for days with no sessionsUse Calendar component if available, or create custom time grid layout.
