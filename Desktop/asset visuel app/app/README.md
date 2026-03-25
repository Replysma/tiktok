# AutoFlow - SaaS Automation Tool

A simple yet powerful automation platform that allows users to connect apps and create workflows automatically.

## Features

✅ **User Authentication** - Email/Password registration and login with JWT tokens
✅ **Dashboard** - View and manage all your workflows
✅ **Workflow Management** - Create, update, and delete workflows
✅ **Trigger + Action System** - Simple trigger to action workflow builder
✅ **Multiple Integrations** - TikTok, Discord, Google Drive, Email, and more
✅ **Execution Logs** - Track success and errors for each workflow run
✅ **Subscription System** - Free (3 workflows) and Premium (unlimited)
✅ **Dark Mode** - Modern UI with light/dark mode support
✅ **Workflow Execution** - Manual trigger and scheduled workflows

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Stripe (Test Mode)
- **Styling**: Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd autoflow
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/automation_saas"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
   STRIPE_SECRET_KEY="sk_test_your_key"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

3. **Set up the database:**
   ```bash
   npm run db:push
   npm run db:generate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Run scheduled workflows (in another terminal):**
   ```bash
   npm run run-scheduler
   ```

## Usage

### Creating Workflows

1. **Register/Login** - Create an account or sign in
2. **Dashboard** - View your existing workflows
3. **Create Workflow** - Click "Create Workflow" to build a new automation
4. **Configure Trigger** - Choose when the workflow should run (TikTok post, scheduled, etc.)
5. **Add Actions** - Define what should happen (send Discord message, save to Google Drive, etc.)
6. **Enable & Test** - Enable the workflow and test it manually

### Available Triggers
- **TikTok Post** - Triggers when new posts are detected
- **Email Received** - Triggers on email events (mock implementation)
- **Scheduled** - Runs at specified intervals

### Available Actions
- **Discord Message** - Send messages to Discord webhooks
- **Google Drive Save** - Save data to Google Drive (mock implementation)
- **Email Send** - Send emails (mock implementation)

### Subscription Plans
- **Free**: 3 workflows, basic features
- **Premium**: Unlimited workflows, priority support

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Workflows
- `GET /api/workflows` - List user workflows
- `POST /api/workflows` - Create new workflow
- `GET /api/workflows/[id]` - Get workflow details
- `PUT /api/workflows/[id]` - Update workflow
- `DELETE /api/workflows/[id]` - Delete workflow
- `POST /api/workflows/[id]/trigger` - Manually trigger workflow
- `GET /api/workflows/[id]/logs` - Get workflow execution logs

### Payments
- `POST /api/stripe/session` - Create Stripe checkout session
- `GET /api/stripe/session` - Get subscription info

## Project Structure

```
.
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── workflows/         # Workflow pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts           # JWT token management
│   │   ├── password.ts       # Password hashing
│   │   ├── errors.ts         # Error handling
│   │   ├── prisma.ts         # Prisma client
│   │   ├── logs.ts           # Logging functions
│   │   ├── integrations.ts   # Integration helpers
│   │   └── workflow-executor.ts # Workflow execution engine
│   └── types/                 # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── run-scheduler.ts       # Scheduled workflow runner
└── .env.example               # Environment variables template
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio
- `npm run run-scheduler` - Run scheduled workflows

### Adding New Integrations

1. **Update types** in `src/types/index.ts`
2. **Add integration logic** in `src/lib/integrations.ts`
3. **Update UI components** for new trigger/action types
4. **Test the integration** with mock data

### Deployment

The app is ready for deployment on Vercel, Netlify, or any Node.js hosting platform.

### Vercel configuration
1. Add `vercel.json` at project root (already set).
2. In Vercel Project Settings > Environment Variables, add:
   - `DATABASE_URL` (ex: `postgresql://user:pass@host:5432/dbname`)
   - `JWT_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PREMIUM_PRICE_ID`
   - `NEXT_PUBLIC_API_URL` (ex: `https://your-domain.vercel.app`)
3. Deploy simply with `vercel` or via Git integration.

### Additional options
- build command: `npm run build`
- output directory: (managed by Next.js)
- install command: `npm install`

For production:
1. Set `NODE_ENV=production`
2. Use a production PostgreSQL database
3. Set up Stripe live keys
4. Configure scheduled task runner (cron job)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
├── prisma/
│   └── schema.prisma         # Database schema
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
└── next.config.js            # Next.js config
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Setup database**
```bash
npx prisma db push
npx prisma generate
```

4. **Run development server**
```bash
npm run dev
```

Visit http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Workflows
- `GET /api/workflows` - List user workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/[id]` - Get workflow details
- `PUT /api/workflows/[id]` - Update workflow
- `DELETE /api/workflows/[id]` - Delete workflow
- `GET /api/workflows/[id]/logs` - Get workflow execution logs

### Stripe
- `GET /api/stripe/session` - Get subscription info
- `POST /api/stripe/session` - Create checkout session

## Available Integrations

### Triggers
- **TikTok Post** - Trigger when a user posts
- **Email Received** - Trigger when email arrives
- **Scheduled** - Trigger at a specific interval

### Actions
- **Discord Message** - Send message to Discord webhook
- **Google Drive** - Save files to Google Drive
- **Email** - Send email notifications

## Example Workflow

**Trigger**: When user posts on TikTok
**Actions**:
1. Send Discord message with post details
2. Save post metadata to Google Drive

## Authentication

The app uses JWT tokens for authentication. After login, the token is stored in localStorage and sent with each request via the Authorization header:

```
Authorization: Bearer <token>
```

## Database Schema

### Users
- id, email, password, name, createdAt, updatedAt

### Workflows
- id, userId, name, description, enabled, createdAt, updatedAt

### Triggers
- id, workflowId, type, config, createdAt

### Actions
- id, workflowId, type, config, order, createdAt

### Subscription
- id, userId, plan, workflowLimit, createdAt, expiresAt

### Logs
- id, workflowId, userId, status, message, errorDetails, executedAt

## Deployment

### To Vercel
```bash
vercel
```

### To Docker
Create a Dockerfile in the root directory and deploy to any cloud provider.

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/automation_saas
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Future Enhancements

- [ ] AI-powered workflow suggestions
- [ ] Pre-built workflow templates
- [ ] Advanced scheduling with cron
- [ ] Real-time webhook execution
- [ ] More integrations (Slack, GitHub, etc.)
- [ ] Workflow versioning and rollback
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Custom code execution in workflows

## License

MIT

## Support

For support, email support@autoflow.dev or create an issue on GitHub.
