import { Resend } from "resend";

/**
 * Server-only credential emails via Resend. Must never be imported by a
 * client component (reads a non-public env var and handles temp passwords).
 */
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
  role: "owner" | "hr";
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

  const roleLabel = role === "owner" ? "Owner" : "HR administrator";
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
    const { error } = await resend.emails.send({ from, to, subject, text });

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
