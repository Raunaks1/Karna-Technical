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
3. Copy `.env.example` to `.env.local` and fill in the Project URL and `anon public` or `publishable` key from **Project Settings → Data API**. For the owner-only **Team** page (invite/reset/remove accounts), also add `SUPABASE_SERVICE_ROLE_KEY` from **Project Settings → API** (server-only secret — never prefix it with `NEXT_PUBLIC_`, never commit it). To email Team invitations, also add `RESEND_API_KEY`, `RESEND_FROM` (see https://resend.com), and `NEXT_PUBLIC_SITE_URL` (local: `http://localhost:3000`, production: your Vercel URL — used to build absolute invitation links).
4. Disable public sign-ups under **Authentication → Sign In / Providers → Email**, then create the first owner from **Authentication → Users**.
5. Give that user a profile by running this in the SQL Editor, replacing the email and name:

```sql
insert into public.profiles (id, full_name, role)
select id, 'Workspace Owner', 'owner'
from auth.users
where email = 'owner@example.com';
```

6. For Vercel, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, and `NEXT_PUBLIC_SITE_URL` (your production URL) under **Project Settings → Environment Variables**, then redeploy.
7. Restart the local server and open `/login`. Additional owner/HR accounts are invited from the dashboard at `/dashboard/team` (owner only) — each invitee gets a secure magic link to accept and set their password (no temporary passwords). Deactivating or removing the last active owner is blocked to prevent lockout.
8. **Fix invite email delivery (one-time):** Resend's `onboarding@resend.dev` sender only delivers to your own inbox, so real invites never arrive until you verify your domain:
   1. Resend → **Domains** → **Add Domain** → enter `karnaengservice.com`.
   2. Open its **Records** tab and copy the SPF/DKIM values exactly (TXT/MX, or CNAMEs for newer domains — add them at the `send` subdomain shown, not root).
   3. Squarespace → **Domains** → click the domain → **DNS** → **DNS Settings** → **Custom Records** → **Add record** for each value.
   4. Back in Resend, verify the domain (usually ~15 min, up to 72 h for DNS propagation).
   5. Set `RESEND_FROM` to a verified address (e.g. `Karna Technical <team@karnaengservice.com>`) in `.env.local` and Vercel Production env, then redeploy. Until then, use the invitation link shown after each invite (copy + share manually).

9. **Unlock Supabase email templates with Resend SMTP (one-time, required for forgot-password):** Supabase locks template editing until custom SMTP is configured. Reuse your Resend key — no app code changes needed:
   1. Supabase → **Project Settings → Configuration → SMTP Settings** → enable custom SMTP: Host `smtp.resend.com`, Port `465`, Username `resend`, Password = your `RESEND_API_KEY`, Sender name `Karna Technical`, Sender email = a Resend-sendable address. Save and send the test email.
   2. Auth → **Email Templates** → **Reset password** → in Source view set the link to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery` (our `/auth/confirm` route verifies exactly this shape server-side). Save.
   3. Auth → **URL Configuration**: Site URL = production URL; Additional Redirect URLs must include `http://localhost:3000/**` and `https://<your-prod>/**`.
   4. Auth → Providers → **Email**: note **Email OTP Expiration** (default 3600s = 1h — it also governs invite/recovery links; raise to at most 86400s if your people click late).
   5. Request a **fresh** reset email and check its button URL starts with `<origin>/auth/confirm?token_hash=…` — that proves the new template is live. Old emails stay dead; every link works once, so click promptly and don't resend mid-test.

Never put the Supabase service-role key in the frontend or commit `.env.local`.
