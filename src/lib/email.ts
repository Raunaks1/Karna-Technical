import { Resend } from "resend";

/**
 * Server-only transactional emails via Resend. Must never be imported by a
 * client component (reads a non-public env var).
 *
 * Replies go to RESEND_REPLY_TO (the business mailbox) while the envelope
 * sender stays on the verified subdomain.
 */
const DEFAULT_REPLY_TO = "karnatech@karnaengservice.com";

function getReplyTo() {
  return process.env.RESEND_REPLY_TO?.trim() || DEFAULT_REPLY_TO;
}

export async function sendInvitationEmail({
  to,
  name,
  role,
  inviterName,
  inviteUrl,
}: {
  to: string;
  name: string;
  role: "owner" | "hr" | "marketing";
  inviterName?: string;
  inviteUrl: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      error: "Email is not configured. Add RESEND_API_KEY and RESEND_FROM to .env.local.",
    };
  }

  const roleLabel = role === "owner" ? "Owner" : role === "hr" ? "HR Administrator" : "Marketing Executive";
  const roleArticle = role === "marketing" ? "a Marketing Executive" : role === "owner" ? "an Owner" : "an HR Administrator";
  const subject = `Invitation: Join Karna Technical Dashboard as ${roleLabel}`;

  const text = [
    `Hi ${name},`,
    ``,
    `${inviterName || "A workspace administrator"} has invited you to join the Karna Technical Management Dashboard as ${roleArticle}.`,
    ``,
    `Click the link below to accept the invitation and set up your password:`,
    inviteUrl,
    ``,
    `This secure link is unique to you.`,
    `If you did not expect this invitation, you can safely ignore this email.`,
  ].join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-width: 100%; background-color: #f8fafc; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" max-width="540" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                <!-- Header Banner -->
                <tr>
                  <td style="padding: 32px 32px 20px 32px; background-color: #0f172a; text-align: left;">
                    <div style="display: inline-block; padding: 6px 14px; background-color: #d32f2f; border-radius: 8px; font-weight: 800; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #ffffff;">
                      Karna Technical
                    </div>
                    <h1 style="margin: 16px 0 0 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                      Team Invitation
                    </h1>
                  </td>
                </tr>
                <!-- Body Content -->
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #334155;">
                      Hi <strong>${name}</strong>,
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #475569;">
                      ${inviterName ? `<strong>${inviterName}</strong>` : "A workspace administrator"} has invited you to join the <strong>Karna Technical Management Dashboard</strong> as:
                    </p>
                    <div style="display: inline-block; padding: 8px 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; font-weight: 700; font-size: 14px; color: #1d4ed8; margin-bottom: 24px;">
                      🛡️ Role: ${roleLabel}
                    </div>
                    <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 22px; color: #64748b;">
                      Click the button below to accept your invitation and create your password. No temporary password needed.
                    </p>
                    <!-- CTA Button -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                      <tr>
                        <td align="center" style="border-radius: 10px; background-color: #d32f2f;">
                          <a href="${inviteUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
                            Accept Invitation & Set Password &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin: 0 0 24px 0; font-size: 12px; line-height: 18px; word-break: break-all; color: #64748b;">
                      <a href="${inviteUrl}" style="color: #d32f2f; text-decoration: underline;">${inviteUrl}</a>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;">
                    <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                      If you weren't expecting this invitation, you can ignore this email.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 16px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                      &copy; ${new Date().getFullYear()} Karna Technical Services. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, subject, text, html, replyTo: getReplyTo() });

    if (error) {
      return { ok: false, error: error.message || "The email could not be sent." };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The email could not be sent.",
    };
  }
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      error: "Email is not configured. Add RESEND_API_KEY and RESEND_FROM to .env.local.",
    };
  }

  const subject = "Reset your Karna Technical password";
  const text = [
    `Hi ${name},`,
    ``,
    `A password reset link was requested for your Karna Technical dashboard account.`,
    ``,
    `Click the link below to set a new password:`,
    resetUrl,
    ``,
    `If you did not request this, your account is safe and you can ignore this email.`,
  ].join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" max-width="540" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
                <tr>
                  <td style="padding: 32px 32px 20px 32px; background-color: #0f172a;">
                    <div style="display: inline-block; padding: 6px 14px; background-color: #d32f2f; border-radius: 8px; font-weight: 800; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #ffffff;">
                      Karna Technical
                    </div>
                    <h1 style="margin: 16px 0 0 0; font-size: 22px; font-weight: 800; color: #ffffff;">
                      Password Reset
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Hi <strong>${name}</strong>,</p>
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #475569;">
                      An administrator requested a password reset link for your account. Click the button below to set your new password:
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                      <tr>
                        <td align="center" style="border-radius: 10px; background-color: #0f172a;">
                          <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
                            Reset Password &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">
                      Link not working? Paste this into your browser:
                    </p>
                    <p style="margin: 0; font-size: 12px; line-height: 18px; word-break: break-all; color: #64748b;">
                      <a href="${resetUrl}" style="color: #d32f2f;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, subject, text, html, replyTo: getReplyTo() });
    if (error) {
      return { ok: false, error: error.message || "The email could not be sent." };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The email could not be sent.",
    };
  }
}

export async function sendCredentialsEmail({
  to,
  name,
  loginEmail,
  tempPassword,
  role,
  loginUrl,
}: {
  to: string;
  name: string;
  loginEmail: string;
  tempPassword: string;
  role: "owner" | "hr" | "marketing";
  loginUrl: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    return {
      ok: false,
      error: "Email is not configured. Add RESEND_API_KEY and RESEND_FROM to .env.local.",
    };
  }

  const roleLabel = role === "owner" ? "Owner" : role === "hr" ? "HR administrator" : "Marketing Executive";
  const subject = `Your Karna ${roleLabel} login details`;
  const text = [
    `Hi ${name},`,
    ``,
    `Your Karna Technical dashboard account is ready. Sign in here:`,
    loginUrl,
    ``,
    `Email: ${loginEmail}`,
    `Temporary password: ${tempPassword}`,
    ``,
    `You will be asked to change this password when you first sign in.`,
    `If you did not expect this email, contact your workspace owner.`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, subject, text, replyTo: getReplyTo() });

    if (error) {
      return { ok: false, error: error.message || "The email could not be sent." };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The email could not be sent.",
    };
  }
}
