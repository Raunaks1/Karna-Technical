This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase Dashboard Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run each file in `supabase/migrations/` in order. If you already ran the earlier ones, just run the newer files you haven't run yet.
3. Copy `.env.example` to `.env.local` and fill in the Project URL and `anon public` or `publishable` key from **Project Settings → Data API**. For the owner-only **Team** page (invite/reset/remove accounts), also add `SUPABASE_SERVICE_ROLE_KEY` from **Project Settings → API** (server-only secret — never prefix it with `NEXT_PUBLIC_`, never commit it). To email login credentials on invite, also add `RESEND_API_KEY` and `RESEND_FROM` (see https://resend.com).
4. Disable public sign-ups under **Authentication → Sign In / Providers → Email**, then create the first owner from **Authentication → Users**.
5. Give that user a profile by running this in the SQL Editor, replacing the email and name:

```sql
insert into public.profiles (id, full_name, role)
select id, 'Workspace Owner', 'owner'
from auth.users
where email = 'owner@example.com';
```

6. For Vercel, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `RESEND_FROM` under **Project Settings → Environment Variables**, then redeploy.
7. Restart the local server and open `/login`. Additional owner/HR accounts can be invited from the dashboard at `/dashboard/team` (owner only) — login credentials are emailed to them and they must change the password on first sign-in. Without a verified sending domain, Resend delivers test mail to your own address only, so verify your domain in Resend before inviting real addresses.

Never put the Supabase service-role key in the frontend or commit `.env.local`.
