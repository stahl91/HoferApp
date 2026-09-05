# HoferApp

Starter version of a private client/revenue management app.

## Current behavior
- Google OAuth login
- Requests Google Calendar read-only access
- Reads existing Google Calendar events
- Parses titles like `Robin 20min 50$`
- Automatically creates a client if the name does not exist
- Stores session date/time, minutes and revenue
- Dashboard for today's/month's revenue, active clients and outstanding revenue
- Manual client creation

## Run locally
1. Install Node.js 20+.
2. Create a Google Cloud project and OAuth Web Application credentials.
3. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
4. Copy `.env.example` to `.env` and fill in the Google credentials and AUTH_SECRET.
5. Run:
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev

Then open http://localhost:3000.

## Google OAuth
Use the Google Calendar API scope:
`https://www.googleapis.com/auth/calendar.readonly`

The app never needs Calendar edit permission.

## Important
This is a development starter, not yet production-ready. Before public deployment, add encrypted token storage, proper token refresh handling, CSRF/session hardening, audit logging, backups, and production database hosting.
