<!-- AutoFlow - SaaS Automation Tool MVP -->

# AutoFlow Project Structure & Setup

## Project Type
Next.js 14 Full-Stack SaaS Application with TypeScript, PostgreSQL, and Stripe integration.

## Setup Status Checklist

- [x] **Project Structure Created** - Next.js 14 with App Router and src directory
- [x] **Dependencies Configured** - All required packages in package.json
- [x] **Database Schema** - Prisma schema for users, workflows, triggers, actions, logs
- [x] **Authentication** - JWT-based auth with register/login endpoints
- [x] **API Routes** - Complete REST API for workflows and subscription management
- [x] **Frontend Pages** - Landing, Login, Register, Dashboard, Workflow management
- [x] **Components** - Reusable UI components with Tailwind CSS
- [x] **Configuration Files** - TypeScript, Tailwind, ESLint, PostCSS configs
- [x] **Documentation** - README with setup instructions

## Next Steps

1. **Install dependencies**: `npm install`
2. **Configure database**: Update DATABASE_URL in .env with PostgreSQL connection
3. **Generate Prisma client**: `npx prisma db push`
4. **Start development**: `npm run dev`
5. **Test endpoints**: Use Postman or Thunder Client to test API routes

## Key Files

- `src/app/api/` - All API endpoints
- `src/app/` - Frontend pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and helpers
- `prisma/schema.prisma` - Database models
- `.env.example` - Environment variables template

## Important Notes

- Stripe integration is in test mode - update with live keys for production
- Database uses PostgreSQL - install and configure locally or use managed service
- JWT secret should be changed in production
- Dark mode support is fully implemented with Tailwind
- All API endpoints require JWT token authentication (except register/login)
