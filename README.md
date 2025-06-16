# EventSchedule - Conference Session Scheduler

A modern web application for browsing, filtering, and scheduling conference sessions with smart AI parsing capabilities.

## 🚀 Features

### 🏠 Homepage
- Modern landing page with hero section
- Feature showcase and statistics
- Call-to-action for conference organizers
- Responsive design with clean UI

### 🔍 Session Browse & Search
- Advanced search with filters (date, time, track, speaker, difficulty)
- Session cards with Add to Calendar and Share buttons
- Grid/list view toggle
- Pagination and loading states
- Mobile-responsive with collapsible sidebar

### 🗓️ Personal Schedule Management
- Calendar grid showing selected sessions
- Day/week view toggle
- Conflict detection for overlapping sessions
- Export options (Google Calendar, Outlook, ICS)
- Quick actions to remove or modify sessions

### 👨‍💼 Admin Dashboard
- Add and manage conferences
- Create and edit session details
- AI-powered URL parsing for automatic schedule extraction
- CRUD operations for conferences and sessions

### 🔐 Authentication
- Supabase authentication with email/password
- Social login support (Google, GitHub)
- Secure session management
- Registration and login flows

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, React
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-scheduler-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the SQL from `database-design.md` to create tables
   - Insert the test data provided in the database design document

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following main tables:

- **conferences**: Store conference information
- **session_tracks**: Session categories/tracks
- **participants**: Speakers and attendees
- **sessions**: Individual conference sessions
- **session_participants**: Many-to-many relationship for session speakers

See `database-design.md` for complete schema and test data.

## 🎨 UI Components

The application uses Shadcn/ui components for consistent design:

- Button, Card, Input, Textarea
- Select, Badge, Tabs, Dialog
- Calendar, Navigation, Skeleton
- Form controls and layout components

## 📱 Responsive Design

- Mobile-first design approach
- Responsive navigation with mobile menu
- Collapsible filters on mobile
- Touch-friendly interface
- Progressive enhancement

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Go to Settings > API to get your keys
3. Copy the SQL from `database-design.md` and run it in the SQL editor
4. Configure authentication providers (Google, GitHub) if needed

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run Playwright e2e tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## 📋 TODO / Future Enhancements

- [ ] Implement real Supabase integration
- [ ] Add session detail pages
- [ ] Implement real AI parsing functionality
- [ ] Add user profiles and preferences
- [ ] Email notifications for schedule changes
- [ ] Session recommendations based on interests
- [ ] Mobile app with React Native
- [ ] Real-time updates with WebSockets
- [ ] Conference analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@eventschedule.co.uk
- Documentation: [eventschedule.co.uk/docs](https://eventschedule.co.uk/docs)

## 🎯 Product Requirements

This application was built based on the requirements in `product-requirements-document.md`:
- NextJS TypeScript with Shadcn/Tailwind CSS
- Supabase PostgreSQL backend
- Modern, professional design with mobile-first principles
- Conference session browsing and scheduling
- AI-powered schedule parsing
- Authentication and admin functionality

---

**EventSchedule** - Never miss another session! 🎯
