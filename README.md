# JanSeva - Civic Grievance Portal

A production-ready, scalable MVP for civic grievance registration and tracking. Built with Next.js 15, React 19, PostgreSQL, Prisma ORM, and NextAuth.

## Features

### For Citizens
- 📝 **File Complaints** - Multi-step form with department selection, location input, and evidence upload
- 🔍 **Track Complaints** - Real-time status tracking with ticket number
- 📊 **Dashboard** - View all complaints, filter by status, and manage grievances
- ⭐ **Rate Resolutions** - Provide satisfaction ratings for resolved complaints

### For Authorities
- 📋 **View Assigned Complaints** - See complaints assigned to their jurisdiction
- ✅ **Update Status** - Mark complaints as viewed, in-progress, or resolved
- 📈 **Performance Metrics** - Track resolution rate, response time, and ratings

### For Admins
- 🏢 **Manage Departments** - Add, edit, and deactivate departments
- 👮 **Manage Authorities** - Create authority profiles and assign jurisdictions
- ⏫ **Escalation Rules** - Configure auto-escalation timelines per department
- 📍 **Location Management** - Manage states, districts, cities, and wards

### System Features
- 🔄 **Auto-Assignment** - Complaints automatically assigned based on department and location
- ⏰ **Auto-Escalation** - Overdue complaints escalate to higher authorities
- 🔐 **Role-Based Access** - Separate dashboards for citizens, authorities, and admins
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 19, Next.js 15 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Credentials Provider
- **UI Components**: Radix UI, Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RoleAssigner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/grievance_portal?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

After seeding, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@demo.com | demo123 |
| Authority | authority@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Authentication
│   │   │   ├── complaints/# Complaint CRUD
│   │   │   ├── departments/
│   │   │   ├── locations/
│   │   │   └── cron/      # Escalation cron
│   │   ├── admin/         # Admin dashboard
│   │   ├── authority/     # Authority dashboard
│   │   ├── dashboard/     # Citizen dashboard
│   │   ├── track/         # Complaint tracking
│   │   ├── file-complaint/# Filing form
│   │   └── auth/          # Auth pages
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   └── layout/        # Header, footer
│   ├── lib/
│   │   ├── auth.ts        # NextAuth config
│   │   ├── db.ts          # Prisma client
│   │   └── utils.ts       # Utility functions
│   └── types/             # TypeScript definitions
└── public/                # Static assets
```

## Database Schema

### Core Entities
- **User** - Citizens, authorities, admins
- **Department** - Government departments
- **Authority** - Officials with jurisdiction assignments
- **Complaint** - Grievance records with status tracking
- **ComplaintStatusLog** - Status change history

### Location Hierarchy
- State → District → City → Ward

### Escalation
- **EscalationRule** - Auto-escalation rules per department
- Complaints escalate when not resolved within specified days

## API Endpoints

### Public
- `GET /api/complaints?ticket=xxx` - Track by ticket number
- `GET /api/departments` - List departments

### Authenticated
- `POST /api/complaints` - File new complaint
- `GET /api/complaints` - List user's complaints
- `PATCH /api/complaints/[id]` - Update complaint
- `POST /api/complaints/[id]/rate` - Submit rating

### Admin Only
- `POST /api/departments` - Create department
- Manage authorities, locations, escalation rules

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a PR

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open a GitHub issue.
